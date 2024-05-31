from flask import Flask
import os
from dotenv import load_dotenv
from routes import configure_api_routes

load_dotenv()

health_monitoring_app = Flask(__name__)
health_monitoring_app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "default_secret_key")
configure_api_routes(health_monitoring_app)

if __name__ == "__main__":
    server_port = int(os.getenv("SERVER_PORT", 5000))
    health_monitoring_app.run(host="0.0.0.0", port=server_port)