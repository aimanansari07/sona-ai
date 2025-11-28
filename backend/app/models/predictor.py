import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from app.data.fetcher import MarketDataFetcher
from xgboost import XGBRegressor
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

class PricePredictor:
    def __init__(self):
        self.models_dir = "models"
        self.fetcher = MarketDataFetcher()
        self.models = {}
        self.scalers = {}
        self.load_or_train_models()
    
    def load_or_train_models(self):
        """Load existing models or train new ones"""
        for metal in ['gold', 'silver']:
            for day in [1, 2, 3]:
                model_path = f"{self.models_dir}/{metal}_day{day}.pkl"
                scaler_path = f"{self.models_dir}/{metal}_day{day}_scaler.pkl"
                
                if os.path.exists(model_path) and os.path.exists(scaler_path):
                    self.models[f"{metal}_day{day}"] = joblib.load(model_path)
                    self.scalers[f"{metal}_day{day}"] = joblib.load(scaler_path)
                    logger.info(f"Loaded model: {metal}_day{day}")
                else:
                    logger.warning(f"Model not found: {metal}_day{day}. Training new model...")
                    self.train_model(metal, day)
    
    def train_model(self, metal, forecast_day):
        """
        Train XGBoost model on PURE 24K prices only
        Purity will be applied AFTER prediction
        """
        logger.info(f"Training {metal} model for day {forecast_day} (24K base)")
        
        # Fetch historical 24K data (no purity adjustment)
        df = self.fetcher.get_historical_data(metal, days=365, for_training=True)
        
        if df is None or len(df) < 100:
            raise ValueError(f"Insufficient data for {metal}")
        
        # Feature engineering
        df = self.create_features(df)
        
        # Prepare target (shift by forecast_day)
        df[f'target_{forecast_day}'] = df['Close'].shift(-forecast_day)
        df = df.dropna()
        
        # Split features and target
        feature_cols = [col for col in df.columns if col not in ['target_1', 'target_2', 'target_3', 'Date']]
        X = df[feature_cols]
        y = df[f'target_{forecast_day}']
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train XGBoost model
        model = XGBRegressor(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        model.fit(X_scaled, y)
        
        # Save model and scaler
        os.makedirs(self.models_dir, exist_ok=True)
        joblib.dump(model, f"{self.models_dir}/{metal}_day{forecast_day}.pkl")
        joblib.dump(scaler, f"{self.models_dir}/{metal}_day{forecast_day}_scaler.pkl")
        
        self.models[f"{metal}_day{forecast_day}"] = model
        self.scalers[f"{metal}_day{forecast_day}"] = scaler
        
        logger.info(f"✅ Model trained: {metal}_day{forecast_day} (24K base)")
    
    def create_features(self, df):
        """Create technical indicators and features"""
        df = df.copy()
        
        # Moving averages
        df['MA_7'] = df['Close'].rolling(window=7).mean()
        df['MA_14'] = df['Close'].rolling(window=14).mean()
        df['MA_30'] = df['Close'].rolling(window=30).mean()
        
        # Volatility
        df['Volatility_7'] = df['Close'].rolling(window=7).std()
        df['Volatility_14'] = df['Close'].rolling(window=14).std()
        
        # Price momentum
        df['Returns_1'] = df['Close'].pct_change(1)
        df['Returns_7'] = df['Close'].pct_change(7)
        
        # RSI
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # Bollinger Bands
        df['BB_middle'] = df['Close'].rolling(window=20).mean()
        df['BB_std'] = df['Close'].rolling(window=20).std()
        df['BB_upper'] = df['BB_middle'] + (2 * df['BB_std'])
        df['BB_lower'] = df['BB_middle'] - (2 * df['BB_std'])
        
        return df.dropna()
    
    def predict(self, metal, purity='24K'):
        """
        Generate predictions for next 7 days
        1. Predict 24K prices
        2. Apply purity factor after prediction
        """
        logger.info(f"Generating predictions for {metal} (will apply {purity} after)")
        
        # Fetch latest 24K data
        df = self.fetcher.get_historical_data(metal, days=90, for_training=True)
        
        if df is None or df.empty:
            raise ValueError(f"Could not fetch data for {metal}")
        
        df = self.create_features(df)
        
        # Get current 24K price
        current_price_24k = float(df['Close'].iloc[-1])
        
        # Apply purity to current price
        current_price = self.fetcher.apply_purity(current_price_24k, metal, purity)
        
        logger.info(f"Current {metal} price - 24K: ₹{current_price_24k:.2f}, {purity}: ₹{current_price:.2f} per gram")
        
        # Prepare features for prediction
        feature_cols = [col for col in df.columns if col not in ['target_1', 'target_2', 'target_3', 'Date']]
        latest_features = df[feature_cols].iloc[-1:].values
        
        forecast = []
        
        # Predict days 1-3 with dedicated models (on 24K prices)
        for day in range(1, 4):
            model_key = f"{metal}_day{day}"
            
            if model_key not in self.scalers or model_key not in self.models:
                logger.warning(f"Model not found for {model_key}, training now...")
                self.train_model(metal, day)
            
            scaler = self.scalers[model_key]
            model = self.models[model_key]
            
            X_scaled = scaler.transform(latest_features)
            predicted_price_24k = float(model.predict(X_scaled)[0])
            
            # Apply purity to predicted price
            predicted_price = self.fetcher.apply_purity(predicted_price_24k, metal, purity)
            
            trend = ((predicted_price - current_price) / current_price) * 100
            confidence = 95 - (day * 5)  # Decreasing confidence
            
            forecast.append({
                'day': day,
                'price': round(predicted_price, 2),
                'trend': round(trend, 2),
                'confidence': confidence
            })
        
        # For days 4-7, use trend extrapolation
        last_pred_price = forecast[-1]['price']
        avg_daily_change = (last_pred_price - current_price) / 3
        
        for day in range(4, 8):
            predicted_price = last_pred_price + (avg_daily_change * (day - 3))
            trend = ((predicted_price - current_price) / current_price) * 100
            confidence = max(50, 85 - (day * 5))
            
            forecast.append({
                'day': day,
                'price': round(predicted_price, 2),
                'trend': round(trend, 2),
                'confidence': confidence
            })
        
        logger.info(f"Generated {len(forecast)} day forecast for {metal} ({purity})")
        
        return {
            'current_price': round(current_price, 2),
            'forecast': forecast,
            'timestamp': datetime.now().isoformat()
        }
    
    def retrain_models(self):
        """Retrain all models with latest data (24K only)"""
        logger.info("Starting model retraining (24K base prices)...")
        
        for metal in ['gold', 'silver']:
            for day in [1, 2, 3]:
                try:
                    self.train_model(metal, day)
                except Exception as e:
                    logger.error(f"Error training {metal} day {day}: {str(e)}")
        
        logger.info("✅ All models retrained")