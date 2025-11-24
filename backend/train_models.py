"""
Script to train ML models for gold and silver predictions
Run this once initially, then schedule daily via cron
"""

from app.models.predictor import PricePredictor
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def main():
    logger.info("🚀 Starting model training...")
    
    predictor = PricePredictor()
    
    for metal in ['gold', 'silver']:
        for day in [1, 2, 3]:
            try:
                logger.info(f"Training {metal} model for day {day}...")
                predictor.train_model(metal, day)
            except Exception as e:
                logger.error(f"Error training {metal} day {day}: {str(e)}")
    
    logger.info("✅ Model training complete!")

if __name__ == "__main__":
    main()