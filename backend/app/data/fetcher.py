import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class MarketDataFetcher:
    def __init__(self):
        self.symbols = {
            'gold': 'GC=F',      # Gold Futures
            'silver': 'SI=F',    # Silver Futures
            'usd_inr': 'INR=X',  # USD/INR
            'oil': 'CL=F',       # Crude Oil
            'nifty': '^NSEI',    # Nifty 50
            'vix': '^VIX'        # Volatility Index
        }
        
        # Reduced retail markup (was too high)
        self.retail_markup = {
            'gold': 1.03,    # 3% markup (GST + small margin)
            'silver': 1.05   # 5% markup
        }
        
        # Gold purity factors (apply AFTER prediction, not during training)
        self.purity_factors = {
            '24K': 1.0,      # 99.9% pure
            '22K': 0.916,    # 91.6% pure (most common in India)
            '18K': 0.750     # 75% pure
        }
    
    def get_historical_data(self, metal, days=365, for_training=True):
        """
        Fetch historical price data
        If for_training=True, returns pure 24K prices
        If for_training=False, can apply purity
        """
        try:
            symbol = self.symbols.get(metal)
            if not symbol:
                raise ValueError(f"Unknown metal: {metal}")
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            # Fetch data
            ticker = yf.Ticker(symbol)
            df = ticker.history(start=start_date, end=end_date)
            
            if df.empty:
                raise ValueError(f"No data available for {metal}")
            
            # Convert to INR
            usd_inr = self.get_usd_inr_rate()
            df['Close'] = df['Close'] * usd_inr
            
            # Convert from Troy Ounce to grams (1 Troy Oz = 31.1035 grams)
            df['Close'] = df['Close'] / 31.1035
            
            # Apply retail markup (for both training and prediction)
            df['Close'] = df['Close'] * self.retail_markup[metal]
            
            # NOTE: Purity is NOT applied here during training
            # It will be applied after predictions are made
            
            logger.info(f"Fetched {len(df)} records for {metal} (24K base)")
            return df
            
        except Exception as e:
            logger.error(f"Error fetching data for {metal}: {str(e)}")
            return None
    
    def get_current_price(self, metal, purity='24K'):
        """Get current retail price for specific purity"""
        try:
            df = self.get_historical_data(metal, days=5, for_training=False)
            if df is None or df.empty:
                return None
            
            # Get latest 24K price per gram
            price_24k_per_gram = float(df['Close'].iloc[-1])
            
            # Apply purity factor
            if metal == 'gold' and purity in self.purity_factors:
                price_per_gram = price_24k_per_gram * self.purity_factors[purity]
            else:
                price_per_gram = price_24k_per_gram
            
            return {
                'price_per_gram': round(price_per_gram, 2),
                'price_24k': round(price_24k_per_gram, 2),
                'purity': purity,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting current price: {str(e)}")
            return None
    
    def get_usd_inr_rate(self):
        """Get current USD to INR exchange rate"""
        try:
            ticker = yf.Ticker(self.symbols['usd_inr'])
            data = ticker.history(period='1d')
            if not data.empty:
                return float(data['Close'].iloc[-1])
            return 83.0  # Fallback rate
        except:
            return 83.0
    
    def apply_purity(self, price_24k, metal, purity):
        """Apply purity factor to 24K price"""
        if metal == 'gold' and purity in self.purity_factors:
            return price_24k * self.purity_factors[purity]
        return price_24k