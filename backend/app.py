from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# -------------------------
# CONFIGURE GEMINI API
# -------------------------
API_KEY = "AIzaSyD9R3Hbl_sVHe4AiAZKe8lf2G9hIn8LPso"  
genai.configure(api_key=API_KEY)

# -------------------------
# USE MODEL WITH AVAILABLE QUOTA
# -------------------------
MODEL_NAME = "models/gemini-flash-lite-latest"  # Switch to available model
model = None

try:
    model = genai.GenerativeModel(MODEL_NAME)
    print(f"✅ Using model: {MODEL_NAME}")
except Exception as e:
    print("❌ Failed to load Gemini model:", e)

# -------------------------
# CHAT ENDPOINT
# -------------------------
@app.route("/chat", methods=["POST"])
def chat():
    if not model:
        return jsonify({
            "response": "Gemini model not loaded. Check backend logs.",
            "error": "Model initialization failed."
        }), 500

    try:
        data = request.get_json()
        user_input = data.get("message", "").strip()

        if not user_input:
            return jsonify({"response": "Please provide a valid message."}), 400

        # -------------------------
        # Send message to Gemini
        # -------------------------
        response = model.generate_content(user_input)

        # -------------------------
        # Check if response is valid
        # -------------------------
        if not response or not hasattr(response, "text"):
            return jsonify({"response": "No response from Gemini model."}), 500

        return jsonify({"response": response.text})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "response": "Error connecting to Gemini API. Check backend logs for details.",
            "error": str(e)
        }), 500

# -------------------------
# MAIN
# -------------------------
if __name__ == "__main__":
    print("Starting Flask server on http://127.0.0.1:5000 ...")
    app.run(debug=True)
