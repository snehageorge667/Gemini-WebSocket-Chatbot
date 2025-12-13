import requests
import json

API_KEY = "AIzaSyCweTQIjZyOZhA0uRAguQChaPK5vGD0ftM"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

data = {
    "contents": [
        {
            "parts": [
                {"text": "Hello Gemini, how are you?"}
            ]
        }
    ]
}

response = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(data))

print(response.status_code)
print(json.dumps(response.json(), indent=2))
