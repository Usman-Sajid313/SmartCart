from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)


with open("/Users/abdulhadi/Desktop/fraud-detector-api/model/fraud_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.get_json()

   
    features = [
        input_data["account_age_days"],
        input_data["transactions_last_24h"],
        input_data["avg_transaction_value"],
        input_data["email_verified"],
        input_data["failed_logins"],
        input_data["shipping_billing_mismatch"]
    ]

    
    columns = [
        "account_age_days", "transactions_last_24h", "avg_transaction_value",
        "email_verified", "failed_logins", "shipping_billing_mismatch"
    ]
    
    
    features_df = pd.DataFrame([features], columns=columns)

    
    proba = model.predict_proba(features_df)[0][1]
    is_fraud = proba > 0.5

    return jsonify({
        "isFraud": bool(is_fraud),
        "riskScore": round(proba, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)


