from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DEFAULT_SUCCESS_MESSAGE = os.getenv("DEFAULT_SUCCESS_MESSAGE", "Operation successful")
DEFAULT_FAIL_MESSAGE = os.getenv("DEFAULT_FAIL_MESSAGE", "Operation failed")
DATABASE_URL = os.getenv("DATABASE_URL")

patients = {
    1: {"name": "John Doe", "age": 30, "condition": "Good"},
    2: {"name": "Jane Doe", "age": 25, "condition": "Fair"}
}

def get_next_patient_id():
    """Function to get the next patient ID."""
    return max(patients.keys()) + 1 if patients else 1

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Health Monitoring System API"})

@app.route("/patients", methods=["GET"])
def get_patients():
    return jsonify(patients)

@app.route("/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    patient = patients.get(patient_id)
    if patient:
        return jsonify(patient)
    return jsonify({"message": "Patient not found"}), 404

@app.route("/patients", methods=["POST"])
def add_patient():
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    new_id = get_next_patient_id()
    patients[new_id] = data
    return jsonify({"message": DEFAULT_SUCCESS_MESSAGE, "patient_id": new_id}), 201

@app.route("/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    if patient_id not in patients:
        return jsonify({"message": "Patient not found"}), 404
    
    if not request.is_json:
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    patients[patient_id].update(data)
    return jsonify({"message": DEFAULT_SUCCESS_MESSAGE})

@app.route("/patients/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    if patient_id not in patients:
        return jsonify({"message": "Patient not found"}), 404
    
    del patients[patientid]
    return jsonify({"message": DEFAULT_SUCCESS_MESSAGE})

if __name__ == "__main__":
    app.run(debug=True)