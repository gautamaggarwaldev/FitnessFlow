# # ai/nutrition_ai/main.py
# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# import google.generativeai as genai
# import base64

# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change this in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure Gemini
# genai.configure(api_key="AIzaSyAKFNYPNWvZ1lefBXWYXzSbIBGjzqPD1DM")

# model = genai.GenerativeModel('gemini-2.0-flash-thinking-exp-01-21')

# # 🧠 Analyze meal image or text
# @app.post("/analyze-meal")
# async def analyze_meal(file: UploadFile = File(None), text: str = Form(None)):
#     if file:
#         contents = await file.read()
#         b64_image = base64.b64encode(contents).decode("utf-8")
#         image_data = {
#             "mime_type": file.content_type,
#             "data": b64_image
#         }
#         prompt = "Give detailed nutritional info in JSON format for the given food image."
#         response = model.generate_content([prompt, image_data])
#     elif text:
#         prompt = f"Give detailed nutritional info in JSON format for this meal: {text}"
#         response = model.generate_content(prompt)
#     else:
#         return {"error": "No input provided"}

#     return {"nutrition": response.text}from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, Form
from mealresult import analyze_meal

app = FastAPI()

# CORS for React Vite (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change to your frontend port
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-meal")
async def analyze(file: UploadFile = None, text: str = Form(None)):
    return await analyze_meal(file=file, text=text)
