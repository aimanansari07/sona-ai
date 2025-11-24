from fastapi import APIRouter, HTTPException, Query
from app.models.predictor import PricePredictor
from app.utils.city_spreads import get_city_spread, CITIES
from typing import Optional
import logging

router = APIRouter()
predictor = PricePredictor()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/predict")
async def get_predictions(
    metal: str = Query("gold", regex="^(gold|silver)$"),
    state: str = Query("Maharashtra"),
    city: str = Query("Mumbai")
):
    """
    Get price predictions for a specific metal and location
    """
    try:
        # Validate city
        if state not in CITIES or city not in CITIES[state]:
            raise HTTPException(status_code=400, detail="Invalid state or city")
        
        # Get base predictions (Mumbai/MCX reference)
        base_predictions = predictor.predict(metal)
        
        # Get city spread
        city_spread = get_city_spread(city)
        
        # Apply localization
        current_price = base_predictions['current_price'] * (1 + city_spread / 100)
        forecast = []
        
        for day_pred in base_predictions['forecast']:
            localized_price = day_pred['price'] * (1 + city_spread / 100)
            forecast.append({
                'day': day_pred['day'],
                'price': round(localized_price, 2),
                'trend': day_pred['trend'],
                'confidence': day_pred['confidence']
            })
        
        week_average = sum([f['price'] for f in forecast]) / len(forecast)
        week_trend = ((forecast[-1]['price'] - current_price) / current_price) * 100
        
        return {
            'metal': metal,
            'location': {'state': state, 'city': city},
            'currentPrice': round(current_price, 2),
            'forecast': forecast,
            'weekAverage': round(week_average, 2),
            'weekTrend': round(week_trend, 2),
            'spread': city_spread,
            'timestamp': base_predictions['timestamp']
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh-models")
async def refresh_models():
    """
    Retrain ML models with latest data
    """
    try:
        predictor.retrain_models()
        return {"message": "Models retrained successfully"}
    except Exception as e:
        logger.error(f"Retraining error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cities")
async def get_cities():
    """
    Get list of supported cities
    """
    return CITIES