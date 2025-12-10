import requests
import json

API_KEY = "AIzaSyAWSdZLDxZUjSB4LsWF_35POU3KF3yetRs"

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

response = requests.get(url, headers={"Content-Type": "application/json"})

print(response.status_code)
print(json.dumps(response.json(), indent=2))
