import os
import google.generativeai as genai

# Make sure your ENV var is set
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("Set GEMINI_API_KEY before running this script")

genai.configure(api_key=API_KEY)

print("Listing models that support generateContent:\n")
for m in genai.list_models():
    if "generateContent" in getattr(m, "supported_generation_methods", []):
        print(m.name)
