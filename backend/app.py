import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use Free Tier model to avoid quota/payment issues
model = genai.GenerativeModel("models/gemini-flash-lite-latest")

@app.route("/")
def home():
    return "WebSocket Chatbot Running!"

@socketio.on("user_message")
def handle_user_message(data):
    user_text = data.get("message", "")
    if not user_text.strip():
        emit("bot_message", {"reply": "Please type something."})
        return

    try:
        response = model.generate_content(user_text)
        bot_reply = response.text if response else "Sorry, I could not generate a reply."
        emit("bot_message", {"reply": bot_reply})
    except Exception as e:
        emit("bot_message", {"reply": f"Backend error: {e}"})

if __name__ == "__main__":
    print("Backend running on WebSocket (Free Tier model)...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
