import requests
import logging

logger = logging.getLogger(__name__)

# Simple cache in memory
_exchange_rate_cache = {
    'rate': 80.0,
    'last_updated': None
}

def get_usd_inr_rate():
    import datetime
    now = datetime.datetime.now()
    
    # Refresh every 12 hours
    if _exchange_rate_cache['last_updated'] and (now - _exchange_rate_cache['last_updated']).total_seconds() < 43200:
        return _exchange_rate_cache['rate']
    
    try:
        # Use a free API
        response = requests.get('https://api.exchangerate-api.com/v4/latest/USD', timeout=5)
        data = response.json()
        rate = data.get('rates', {}).get('INR', 80.0)
        _exchange_rate_cache['rate'] = float(rate)
        _exchange_rate_cache['last_updated'] = now
        logger.info(f"Updated USD/INR rate to {rate}")
        return float(rate)
    except Exception as e:
        logger.warning(f"Failed to fetch exchange rate: {e}")
        return _exchange_rate_cache['rate']
