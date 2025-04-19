from fastapi import UploadFile, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image
import google.generativeai as genai

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="AIzaSyAKFNYPNWvZ1lefBXWYXzSbIBGjzqPD1DM")
model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-01-21")

@app.post("/analyze-meal")
async def analyze_meal(file: UploadFile = None, text: str = None):
    try:
        generation_config = {
            "max_output_tokens": 500,
            "temperature": 0.2,
        }

        if file:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            image_bytes = io.BytesIO()
            image.save(image_bytes, format="PNG")
            image_bytes = image_bytes.getvalue()

            response = model.generate_content(
                [
                    "Analyze the nutritional components of this meal and return a JSON with calorie, protein, carbs, fats.",
                    {"mime_type": "image/png", "data": image_bytes}
                ],
                generation_config=generation_config
            )
        elif text:
            prompt = (
                "Analyze this meal and return a JSON with the following format:\n"
                "{\n"
                "  'calories': number,\n"
                "  'protein': number,\n"
                "  'carbs': number,\n"
                "  'fats': number\n"
                "}\n\n"
                f"Meal: {text}"
            )
            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
        else:
            return {"error": "No input provided"}

        return {"nutrition": response.text}
    except Exception as e:
        return {"error": str(e)}
