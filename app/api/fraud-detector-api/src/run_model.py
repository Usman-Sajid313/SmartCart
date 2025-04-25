import sys, json, pickle
import numpy as np


with open("/Users/abdulhadi/Desktop/fraud-detector-api/model/fraud_model.pkl", "rb") as f:
    model = pickle.load(f)


input_data = json.loads(sys.argv[1])

features = [
    input_data["account_age_days"],
    input_data["transactions_last_24h"],
    input_data["avg_transaction_value"],
    input_data["email_verified"],
    input_data["failed_logins"],
    input_data["shipping_billing_mismatch"]
]

import pandas as pd


columns = [
    "account_age_days", "transactions_last_24h", "avg_transaction_value",
    "ip_risk_score", "email_verified", "failed_logins", "shipping_billing_mismatch"
]
features_df = pd.DataFrame([features], columns=columns)


proba = model.predict_proba(features_df)[0][1]
is_fraud = proba > 0.5

print(json.dumps({
    "isFraud": bool(is_fraud),  
    "riskScore": round(proba, 2)
}))
