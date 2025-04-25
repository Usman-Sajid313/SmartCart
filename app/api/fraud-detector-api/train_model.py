import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle


df = pd.read_csv("data/fraud.csv")


X = df.drop("is_fraud", axis=1)
y = df["is_fraud"]


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = RandomForestClassifier()
model.fit(X_train, y_train)


with open("model/fraud_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved to model/fraud_model.pkl")
