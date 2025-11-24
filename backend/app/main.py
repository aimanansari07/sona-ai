from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predictions

app = FastAPI(
    title="Sona-AI API",
    description="AI-Powered Gold & Silver Price Prediction API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(predictions.router, prefix="/api", tags=["predictions"])

@app.get("/")
async def root():
    return {
        "message": "Sona-AI API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "sona-ai-api"}