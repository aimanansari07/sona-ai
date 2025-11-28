from fastapi import APIRouter, HTTPException, Query
from app.models.predictor import PricePredictor
from app.utils.city_spreads import get_city_spread, CITIES
from typing import Optional
import logging

router = APIRouter()
predictor = PricePredictor()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gold purity options
GOLD_PURITIES = ['18K', '22K', '24K']
GOLD_UNITS = [1, 5, 10, 100]  # grams
SILVER_UNITS = [1, 100, 1000]  # 1g, 100g (standard bar), 1kg

@router.get("/predict")
async def get_predictions(
    metal: str = Query("gold", regex="^(gold|silver)$"),
    state: str = Query("Maharashtra"),
    city: str = Query("Mumbai"),
    purity: str = Query("22K", regex="^(18K|22K|24K)$"),  # For gold only
    unit: int = Query(10)  # grams
):
    """
    Get price predictions for a specific metal, purity, and location
    """
    try:
        # Validate inputs
        if state not in CITIES or city not in CITIES[state]:
            raise HTTPException(status_code=400, detail="Invalid state or city")
        
        if metal == 'gold' and purity not in GOLD_PURITIES:
            raise HTTPException(status_code=400, detail="Invalid purity for gold")
        
        if metal == 'gold' and unit not in GOLD_UNITS:
            raise HTTPException(status_code=400, detail="Invalid unit for gold")
        
        if metal == 'silver' and unit not in SILVER_UNITS:
            raise HTTPException(status_code=400, detail="Invalid unit for silver")
        
        # Get base predictions with purity
        base_predictions = predictor.predict(metal, purity=purity if metal == 'gold' else '24K')
        
        # Get city spread
        city_spread = get_city_spread(city)
        
        # Apply localization
        current_price_per_gram = base_predictions['current_price']
        current_price_total = current_price_per_gram * unit
        current_price_localized = current_price_total * (1 + city_spread / 100)
        
        forecast = []
        for day_pred in base_predictions['forecast']:
            price_per_gram = day_pred['price']
            price_total = price_per_gram * unit
            localized_price = price_total * (1 + city_spread / 100)
            
            forecast.append({
                'day': day_pred['day'],
                'price': round(localized_price, 2),
                'price_per_gram': round(price_per_gram, 2),
                'trend': day_pred['trend'],
                'confidence': day_pred['confidence']
            })
        
        week_average = sum([f['price'] for f in forecast]) / len(forecast)
        week_trend = ((forecast[-1]['price'] - current_price_localized) / current_price_localized) * 100
        
        return {
            'metal': metal,
            'purity': purity if metal == 'gold' else 'Pure',
            'unit': unit,
            'unit_label': f"{unit} gram{'s' if unit != 1 else ''}",
            'location': {'state': state, 'city': city},
            'currentPrice': round(current_price_localized, 2),
            'currentPricePerGram': round(current_price_per_gram * (1 + city_spread / 100), 2),
            'forecast': forecast,
            'weekAverage': round(week_average, 2),
            'weekTrend': round(week_trend, 2),
            'spread': city_spread,
            'timestamp': base_predictions['timestamp']
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/purities")
async def get_purities():
    """Get available gold purities"""
    return {
        'gold': GOLD_PURITIES,
        'silver': ['Pure']
    }

@router.get("/units")
async def get_units(metal: str = Query("gold")):
    """Get available units for metal"""
    if metal == 'gold':
        return {'units': GOLD_UNITS, 'label': 'grams'}
    else:
        return {'units': SILVER_UNITS, 'label': 'grams'}