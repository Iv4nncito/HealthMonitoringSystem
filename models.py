from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPBasicAuth
import os
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///health_monitoring.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
bcrypt = Bcrypt(app)
auth = HTTPBasicAuth()
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    measurements = db.relationship('Measurement', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Measurement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_taken = db.Column(db.DateTime, nullable=False)
    temperature = db.Column(db.Float, nullable=True)
    heart_rate = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409
    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/add_measurement', methods=['POST'])
@auth.login_required
def add_measurement():
    temperature = request.json.get('temperature')
    heart_rate = request.json.get('heart_rate')
    user_id = auth.current_telnet().id
    measurement = Measurement(date_taken=datetime.now(), temperature=temperature, heart_rate=heart_rate, user_id=user_id)
    
    db.session.add(measurement)
    db.session.commit()
    
    return jsonify({'message': 'Measurement added successfully'}), 201

@app.route('/get_measurements')
@auth.login_required
def get_measurements():
    user_id = auth.current_user().id
    measurements = Measurement.query.filter_by(user_id=user_id).all()
    
    output = []
    for measurement in measurements:
        measurement_data = {}
        measurement_data['id'] = measurement.id
        measurement_data['date_taken'] = measurement.date_taken
        measurementData['temperature'] = measurement.temperature
        measurementData['heart_rate'] = measurement.heart_rate
        output.append(measurement_data)
    
    return jsonify({'measurements': output}), 200

@app.route('/get_average_measurements')
@auth.login_required
def get_average_measurements():
    user_id = auth.current_user().id
    start_date = request.args.get('start', type = lambda s: datetime.strptime(s, '%Y-%m-%d'))
    end_date = request.args.get('end', type = lambda s: datetime.strptime(s, '%Y-%m-%d'))
    
    measurements = Measurement.query.filter(
        Measurement.user_id == user_id,
        Measurement.date_taken >= start_date,
        Measurement.date_taken <= end_date
    ).all()
    
    total_temperature, total_heart_rate, count = 0, 0, 0
    
    for measurement in measurements:
        if measurement.temperature is not None:
            total_temperature += measurement.temperature
        if measurement.heart_rate is not None:
            total_heart_rate += measurement.heart_rate
        count += 1
    
    avg_temperature = total_temperature / count if count else 0
    avg_heart_rate = total_heart_rate / count if count else 0
    
    return jsonify({
        'average_temperature': avg_temperature, 
        'average_heart_rate': avg_heart_rate
    }), 200

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)