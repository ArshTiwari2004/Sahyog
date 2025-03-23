import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import google.cloud.aiplatform as vertex_ai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google AI services
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
vertex_ai.init(project=os.getenv("GCP_PROJECT_ID"), location=os.getenv("GCP_LOCATION"))

# Initialize FastAPI app
app = FastAPI(title="Sahyog AI Service", description="AI services for disaster management")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class DisasterPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    data_sources: list

class ImageAnalysisRequest(BaseModel):
    image_url: str
    analysis_type: str

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Sahyog AI Service"}

@app.post("/predict/disaster")
async def predict_disaster(request: DisasterPredictionRequest):
    """Predict potential disasters based on geo-location and data sources"""
    try:
        # This is a placeholder for your actual model inference
        # You would use Vertex AI here with your trained models
        prediction = {"risk_level": "moderate", "disaster_type": "flood", "confidence": 0.78}
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image")
async def analyze_image(request: ImageAnalysisRequest):
    """Analyze disaster images using Gemini API"""
    try:
        # This is a placeholder for your actual Gemini API call
        # You would process the image and get analysis results
        analysis_result = {
            "damage_level": "severe",
            "affected_structures": 12,
            "recommended_resources": ["medical supplies", "shelter kits", "food packages"]
        }
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)