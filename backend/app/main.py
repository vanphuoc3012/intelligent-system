from typing import Annotated
from fastapi import FastAPI, Body
import numpy as np
from app.model.request import PredictRequest
from app.predictor import trained_model
import uvicorn
import logging

app = FastAPI()

LOG = logging.getLogger(__name__)
LOG.info("API is starting up")
LOG.info(uvicorn.Config.asgi_version)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post('/predict')
def predict(predictRequest: PredictRequest):
    try: 
        # trained_model.predict()
        LOG.info(predictRequest)
        
        return {'message': 'ok'}
    except Exception as e:
        return {'error': str(e)}, 400
    
if __name__ == 'main':
    uvicorn.run(app, host='0.0.0.0', port=8000)