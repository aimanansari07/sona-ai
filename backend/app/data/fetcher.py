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
    
    def get_historical_data(self, metal, days=365):
        """Fetch historical price data"""
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
            
            # Convert to INR if needed
            if metal in ['gold', 'silver']:
                usd_inr = self.get_usd_inr_rate()
                df['Close'] = df['Close'] * usd_inr
                # Convert from Troy Ounce to 10 grams
                df['Close'] = df['Close'] * (10 / 31.1035)
            
            logger.info(f"Fetched {len(df)} records for {metal}")
            return df
            
        except Exception as e:
            logger.error(f"Error fetching data for {metal}: {str(e)}")
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
    
    def get_multi_asset_data(self, days=90):
        """Fetch data for all correlated assets"""
        data = {}
        for name, symbol in self.symbols.items():
            try:
                ticker = yf.Ticker(symbol)
                df = ticker.history(period=f"{days}d")
                if not df.empty:
                    data[name] = df['Close']
            except Exception as e:
                logger.warning(f"Could not fetch {name}: {str(e)}")
        
        return pd.DataFrame(data)