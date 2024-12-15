import pandas as pd
from scipy import stats

def main():
    df = pd.read_excel('Bank_Personal_Loan_Modelling.xlsx', sheet_name='Data')
    df.drop('ID', axis=1, inplace=True)
    df[df['ZIP Code']<20000]
    df.drop(df[df['ZIP Code']<20000].index, inplace=True)
    df.reset_index(drop=True, inplace =True)
    df['Experience'] = df['Experience'].apply(abs)
    outlier_indexes = df[stats.zscore(df['Mortgage'])>3].index
    df.drop(outlier_indexes, inplace=True)
    df.reset_index(drop=True, inplace=True)