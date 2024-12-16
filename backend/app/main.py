from fastapi import FastAPI, Body, File, UploadFile, Response, status
from model.request import PredictRequest
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

app = FastAPI()
predictor = Predicter()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post('/predict')
async def predict(predictRequest: PredictRequest, response: Response):
    try: 
        logger.info(predictRequest)
        predict_results, invalid_inputs = predictor.predict_single(predictRequest.model_dump())
        if predict_results:
            return predict_results[0]
        return invalid_inputs[0]
    except Exception as e:
        logfactory.exception(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {'error': str(e)}
    
@app.post('/predict-csv')
async def predict_csv(file: UploadFile, response: Response):
    if not file.filename.endswith('.csv'):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Invalid file format. Only CSV files are allowed."}
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        
        list_customer = df.to_dict(orient='records')
        predict_results, invalid_inputs = predictor.predict(list_customer)
        df = pd.DataFrame(predict_results)
        df = pd.concat([df, pd.DataFrame(invalid_inputs)])
        
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(io.StringIO(output.getvalue()), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=predicted_customers.csv"})
    except Exception as e:
        logger.exception(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {'error': str(e)}
    
@app.get("/counter")
async def get_counter():
    return {
        "anomaliesCount": predictor.get_anomalies_count(),
        "predictionCount": predictor.get_predict_count()
        }
    
@app.get("/model-health")
async def model_health():
    return {"alg": "DecisionTreeClassifier"}