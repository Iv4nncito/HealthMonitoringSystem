from flask import Flask
import os
from dotenv import load_dotenv
from routes import configure_routes

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "a_random_secret_key")
configure_routes(app)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)