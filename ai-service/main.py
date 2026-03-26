"""
SneakAI — AI Recommendation Microservice v2
FastAPI application serving sneaker recommendations via REST API.
"""

import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from recommender import SneakerRecommender
from outfit_analyzer import outfit_analyzer

app = FastAPI(
    title="SneakAI Recommendation Service",
    description="AI-powered sneaker recommendation engine using content-based filtering with cosine similarity",
    version="2.0.0",
)

# CORS — allow frontend and backend + LAN addresses
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender
recommender = SneakerRecommender()


class RecommendationRequest(BaseModel):
    brands: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    styles: Optional[List[str]] = []
    budget: Optional[float] = 300.0
    top_n: Optional[int] = 5


class SneakerResponse(BaseModel):
    id: str
    name: str
    brand: str
    price: float
    color: str
    style: str
    category: str
    rating: float
    features: List[str]
    similarity_score: float

    model_config = ConfigDict(extra="allow")


@app.get("/")
async def root():
    return {
        "service": "SneakAI Recommendation Engine",
        "version": "2.0.0",
        "status": "running",
        "sneakers_loaded": len(recommender.sneakers),
        "features_dimension": recommender.feature_matrix.shape[1],
        "endpoints": {
            "recommend": "POST /api/recommend",
            "health": "GET /api/health",
            "sneakers": "GET /api/sneakers",
        },
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "model": "content-based-filtering-v2",
        "sneakers_loaded": len(recommender.sneakers),
        "feature_dimensions": recommender.feature_matrix.shape[1],
    }


@app.get("/api/sneakers")
async def get_sneakers():
    return {"sneakers": recommender.sneakers, "total": len(recommender.sneakers)}


@app.post("/api/recommend")
async def get_recommendations(request: RecommendationRequest):
    """
    Get AI-powered sneaker recommendations based on user preferences.

    - **brands**: Preferred brands (e.g., ["Nike", "Adidas"])
    - **colors**: Preferred colors (e.g., ["Black", "White"])
    - **styles**: Preferred styles: street, sport, casual, luxury
    - **budget**: Maximum price
    - **top_n**: Number of recommendations (default 5)
    """
    try:
        preferences = {
            "brands": request.brands or [],
            "colors": request.colors or [],
            "styles": request.styles or [],
            "budget": request.budget or 10000,
        }

        results = recommender.recommend(preferences, top_n=request.top_n or 5)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-outfit")
async def analyze_outfit(file: UploadFile = File(...)):
    """
    Analyze an uploaded outfit image, extract colors/style, and return matched sneakers.
    """
    try:
        contents = await file.read()
        colors_rgb, colors_hex = outfit_analyzer.extract_colors(contents, num_colors=3)
        predicted_style = outfit_analyzer.classify_style(colors_rgb)
        
        # In a real app we would map RGB to exact color names, but for now we just use style
        preferences = {
            "styles": [predicted_style],
            "budget": 50000,
        }
        
        results = recommender.recommend(preferences, top_n=4)
        
        return {
            "detected_colors": colors_hex,
            "predicted_style": predicted_style,
            "recommendations": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    print("")
    print("╔══════════════════════════════════════════╗")
    print("║     🧠 SneakAI Recommendation Engine     ║")
    print("╠══════════════════════════════════════════╣")
    print(f"║  Local:    http://localhost:{port}          ║")
    print("╠══════════════════════════════════════════╣")
    print(f"║  Frontend: http://localhost:3000          ║")
    print(f"║  Backend:  http://localhost:5000          ║")
    print("╚══════════════════════════════════════════╝")
    print("")

    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
