import random
import joblib
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import logging
import os
import threading

# logger = logfactory.get_logger()
logger = logging.getLogger(__name__)

feature_column_mapping = {
    "Age": "age",
    "Income": "income",
    "ZIP Code": "zipcode",
    "Family": "family",
    "CCAvg": "ccAvg",
    "Education": "education",
    "Mortgage": "mortgage",
    "Securities Account": "securitiesAccount",
    "CD Account": "cdAccount",
    "Online": "online",
    "CreditCard": "creditCard",
    "Experience": "experience",
    "id": "ID",
}

columns_feature_mapping = {
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

class Predicter(object):
    
    _required_columns = {"Income", "Education", "Family", "CCAvg", "CD Account",}

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
        missing_inputs = []
        for k in Predicter._required_columns:
            if k in customer.keys() or feature_column_mapping[k] in customer.keys():
                continue
            missing_inputs.append(k)
        if len(missing_inputs) > 0:
            logger.error(f"Missing inputs: {missing_inputs}")
            logger.error(f"Customer: {customer}")
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
        
        filtered_rename_dict = {k: v for k, v in columns_feature_mapping.items() if k in df.columns}
        logger.info(f'Found columns can be rename: {filtered_rename_dict}')
        
        if filtered_rename_dict:
            only_require_columns = df.rename(columns=filtered_rename_dict)[self._desired_columns_order]
        else:
            only_require_columns = df[self._desired_columns_order]

        predict = self._model.predict(only_require_columns)
        df["predictResult"] = predict

        invalid_df = pd.DataFrame(invalid_customers)
        invalid_df["predictResult"] = "Not enough information"
        return df.to_dict(orient="records"), invalid_df.to_dict(orient="records")