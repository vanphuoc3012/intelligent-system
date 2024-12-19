from fastapi import (
    FastAPI,
    Body,
    File,
    UploadFile,
    Response,
    status,
    Depends,
    HTTPException,
    Form,
)
from sqlalchemy.orm import Session
from config import settings
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database import Base, engine, get_db
from base64 import b64decode
from models import User
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from model.request import PredictRequest, UserCreate, UserLogin, Token, RefreshTokenRequest
from predictor import Predicter
import pandas as pd
import io
from fastapi.responses import StreamingResponse
from fastapi.logger import logger

# gunicorn_logger  = logging.getLogger('uvicorn.error')
# logger.handlers = gunicorn_logger.handlers
# logger.setLevel(logging.DEBUG)
# stdout_handler = logging.StreamHandler(sys.stdout)
# logger.addHandler(stdout_handler)
# logger.info("API is starting up")
# logger.info(uvicorn.Config.asgi_version)

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

predictor = Predicter()

def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    """Get current logged-in user from token."""
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token or token expired")
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/register")
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with an email and password."""
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and store user
    hashed_password = get_password_hash(user_create.password)
    new_user = User(
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        email=user_create.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return status code and message
    return JSONResponse(
        status_code=201, content={"message": "User registered successfully."}
    )

@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, str(user.hashed_password)):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Create access and refresh tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_access_token(
        data={"sub": user.email}, expires_delta=refresh_token_expires
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@app.post("/refresh", response_model=Token)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_access_token(request.refresh_token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    # Issue new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": new_access_token,
        "refresh_token": request.refresh_token,
        "token_type": "bearer",
    }


@app.get("/user_info")
def get_user_info(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
    }

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(predictRequest: PredictRequest, response: Response):
    try:
        logger.info(predictRequest)
        predict_results, invalid_inputs = predictor.predict_single(
            predictRequest.model_dump()
        )
        if predict_results:
            return predict_results[0]
        return invalid_inputs[0]
    except Exception as e:
        logfactory.exception(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(e)}


@app.post("/predict-csv")
async def predict_csv(file: UploadFile, response: Response):
    if not file.filename.endswith(".csv"):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Invalid file format. Only CSV files are allowed."}
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))

        list_customer = df.to_dict(orient="records")
        predict_results, invalid_inputs = predictor.predict(list_customer)
        df = pd.DataFrame(predict_results)
        df = pd.concat([df, pd.DataFrame(invalid_inputs)])

        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(
            io.StringIO(output.getvalue()),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=predicted_customers.csv"
            },
        )
    except Exception as e:
        logger.exception(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(e)}


@app.get("/counter")
async def get_counter():
    return {
        "anomaliesCount": predictor.get_anomalies_count(),
        "predictionCount": predictor.get_predict_count(),
    }


@app.get("/model-health")
async def model_health():
    return {"alg": "DecisionTreeClassifier"}
 