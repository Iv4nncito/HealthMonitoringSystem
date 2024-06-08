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
    logging.warning(f"Patient with ID {patient_id} not satisfied
    return jsonify({"message": "Patient not found"}), 404

@app.route("/patients", methods=["POST"])
def add_patients():
    if not request.is_json:
        logging.error("Failed to add patients - request must be JSON")
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    if isinstance(data, list):  # Handle batch addition
        patient_ids = []
        for patient_data in data:
            new_id = get_next_patient_id()
            patients[new_id] = patient_data
            patient_ids.append(new_id)
            logging.info(f"Added patient with ID {new_id}")
        return jsonify({"message": DEFAULT_SUCCESS_MESSAGE, "patient_ids": patient_ids}), 201
    else:
        new_id = get_next_patient_id()
        patients[new_id] = data
        logging.info(f"Added patient with ID {new_id}")
        return jsonify({"message": DEFAULT_SUCCESS_MESSAGE, "patient_id": new_id}), 201

@app.route("/patients/bulk_update", methods=["PUT"])
def update_patients():
    if not request.is_json:
        logging.error("Failed to update patients - request must be JSON")
        return jsonify({"message": "Request must be JSON"}), 400
    
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"message": "Request body must be a list of patient updates"}), 400

    update_results = {"updated": [], "not_found": []}
    for update_data in data:
        patient_id = update_data.get("id")
        if patient_id in patients:
            patients[patient_id].update(update_data.get("data", {}))
            logging.info(f"Updated patient with ID {patient_id}")
            update_results["updated"].append(patient_id)
        else:
            logging.warning(f"Patient with ID {patient_id} not found for update")
            update_results["not_found"].append(patient_id)

    return jsonify(update_results)

@app.route("/patients/bulk_delete", methods=["POST"])
def delete_patients():
    if not request.is_json:
        logging.error("Failed to delete patients - request must be JSON")
        return jsonify({"message": "Request must be JSON"}), 400
    
    patient_ids = request.get_json()
    if not isinstance(patient_ids, list):
        return jsonify({"message": "Request body must be a list of patient IDs"}), 400

    delete_results = {"deleted": [], "not_found": []}
    for patient_id in patient_ids:
        if patient_id in patients:
            del patients[patient_id]
            logging.info(f"Deleted patient with ID {patient_id}")
            delete_results["deleted"].append(patient_id)
        else:
            logging.warning(f"Patient with ID {patient_id} not found for deletion")
            delete_results["not_found"].append(patient_id)

    return jsonify(delete_results)

if __name__ == "__main__":
    app.run(debug=True)