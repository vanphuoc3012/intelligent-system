from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    age: int
    experience: float
    income: float
    zipcode: int
    family: int
    ccAvg: float = Field(title="Average monthly spending with the credit card (in thousands)")
    education: int = Field(title="Education level (1: bachelor's degree, 2: master's degree, 3: advanced/professional degree)")
    mortgage: float = Field(title="Value of home mortgage, if any (in thousands)")
    securitiesAccount: bool = Field(title="Does the customer have a securities account with the bank?")
    cdAccount: bool = Field(title="Does the customer have a certificate of deposit account (CD) with the bank?")
    online: bool = Field(title="Does the customer use the internet banking facilities?")
    creditCard: bool = Field(title="Does the customer use a credit card issued by the bank?")