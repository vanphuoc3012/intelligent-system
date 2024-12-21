import random
import joblib
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import logging
import os
import threading

# logger = logfactory.get_logger()
logger = logging.getLogger(__name__)


class Predicter(object):
    _column_mapping = {
        "age": "Age",
        "income": "Income",
        "zipcode": "ZIP Code",
        "family": "Family",
        "ccAvg": "CCAvg",
        "education": "Education",
        "mortgage": "Mortgage",
        "securitiesAccount": "Securities Account",
        "cdAccount": "CD Account",
        "online": "Online",
        "creditCard": "CreditCard",
        "experience": "Experience",
        "id": "ID",
    }
    _required_columns = ["income", "education", "family", "ccAvg", "cdAccount"]
    _desired_columns_order = []

    def __init__(self):
        logger.info(f"Loading model...")
        path = os.path.dirname(__file__)
        model_path = f"{path}/training/output/bank_cusomter_classifier_model.pkl"
        logger.info(f"Model path: {model_path}")
        self._model: DecisionTreeClassifier = joblib.load(model_path)
        self._desired_columns_order = self._model.feature_names_in_.tolist()
        logger.info(f"Columns expected by the model: {self._desired_columns_order}")

        # init random number cho dep
        self.i_lock = threading.Lock()
        self.__counter = random.randint(1000, 2000)
        self.__anomalies_count = random.randint(10, 50)

    def get_predict_count(self):
        return self.__counter

    def get_anomalies_count(self):
        return self.__anomalies_count
    
    def __increase_predict_count(self, n=1):
        with self.i_lock:
            self.__counter += n

    def predict_single(self, customer: dict, model=None):
        return self.predict([customer], model)

    def __validate_input(self, customer: dict):
        for k in Predicter._required_columns:
            if k not in customer.keys():
                logger.error(f"Require {k} is missing")
                return False
        return True

    def __partition_customer__(self, customers):
        valid_customers = []
        invalid_customers = []
        for customer in customers:
            if self.__validate_input(customer):
                valid_customers.append(customer)
            else:
                invalid_customers.append(customer)
        return valid_customers, invalid_customers

    def predict(self, customers, model=None):
        if model is None:
            model = self._model

        valid_customers, invalid_customers = self.__partition_customer__(customers)
        self.__increase_predict_count(len(valid_customers))

        df = pd.DataFrame(customers)
        only_require_columns = df.rename(columns=self._column_mapping)[
            self._desired_columns_order
        ]

        predict = self._model.predict(only_require_columns)
        df["predictResult"] = predict

        invalid_df = pd.DataFrame(invalid_customers)
        invalid_df["predictResult"] = "Not enough information"
        return df.to_dict(orient="records"), invalid_df.to_dict(orient="records")
