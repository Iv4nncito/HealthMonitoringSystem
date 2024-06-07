from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Setting up basic configuration for logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

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
    next_id = max(patients.keys()) + 1 if patients else 1
    logging.info(f"Next patient ID: {next_id}")
    return next_id

@app.route("/")
def home():
    logging.info("Home route accessed")
    return jsonify({"message": "Welcome to the Health Monitoring System API"})

@app.route("/patients", methods=["GET"])
def get_patients():
    logging.info("Fetching all patients")
    return jsonify(patients)

@app.route("/patients/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    logging.info(f"Fetching patient with ID {patient_id}")
    patient = patients.get(patient_id)
    if patient:
        return jsonify(patient)
    logging.warning(f"Patient with ID {patient_id} not found")
    return jsonify({"message": "Patient not found"}), 404

@app.route("/patients", methods=["POST"])
def add_patient():
    if not request.is_json:
        logging.error("Failed to add patient - request must be JSON")
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    new_id = get_next_patient_id()
    patients[new_id] = data
    logging.info(f"Added patient with ID {new_id}")
    return jsonify({"message": DEFAULT_SUCCESS_MESSAGE, "patient_id": new_id}), 201

@app.route("/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    if patient_id not in patients:
        logging.warning(f"Patient with ID {patient_id} not found for update")
        return jsonify({"message": "Patient not found"}), 404
    
    if not request.is_json:
        logging.error("Failed to update patient - request must be JSON")
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    patients[patient_id].update(data)
    logging.info(f"Updated patient with ID {patient_id}")
    return jsonify({"message": DEFAULT_SUCCESS_MESSAGE})

@app.route("/patients/<int:patient_id>", methods=["DELETE"])
def delete_patient(patient_id):
    if patient_id not in patients:
        logging.warning(f"Patient with ID {patient_plan_id} not found for deletion")
        return jsonify({"message": "Patient not found"}), 404
    
    del patients[patient_id]
    logging.info(f"Deleted patient with ID {patient_id}")
    return jsonify({"message": DEFAULT_SUCCESS_SUCCESS_MESSAGE})

if __name__ == "__main__":
    app.run(debug=True)