"""
Rate Limiting Utilities

Simple rate limiting for authentication endpoints to prevent brute force attacks.
"""

from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger('accounts')

# Rate Limit Configuration
LOGIN_ATTEMPTS_LIMIT = 5  # Max attempts
LOGIN_ATTEMPTS_WINDOW = 15  # Minutes
OTP_REQUEST_LIMIT = 3  # Max OTP requests
OTP_REQUEST_WINDOW = 10  # Minutes


def get_rate_limit_key(identifier, action):
    """
    Generate cache key for rate limiting.
    
    Args:
        identifier: Email or IP address
        action: Type of action (e.g., 'login', 'otp_request')
    
    Returns:
        str: Cache key
    """
    return f"rate_limit:{action}:{identifier}"


def check_rate_limit(identifier, action, limit, window_minutes):
    """
    Check if rate limit has been exceeded.
    
    Args:
        identifier: Email or IP address
        action: Type of action
        limit: Maximum number of attempts
        window_minutes: Time window in minutes
    
    Returns:
        tuple: (is_allowed: bool, attempts_left: int, retry_after_seconds: int)
    """
    key = get_rate_limit_key(identifier, action)
    
    # Get current attempt count
    attempts = cache.get(key, 0)
    
    if attempts >= limit:
        # Get TTL to know when limit resets
        try:
            ttl = cache.ttl(key)
        except AttributeError:
             # Fallback for backends that don't support ttl() (like LocMemCache)
             ttl = window_minutes * 60
        
        if ttl is None:
            ttl = window_minutes * 60 # Default fallback
        
        logger.warning(f"Rate limit exceeded for {identifier} on {action}")
        return False, 0, ttl
    
    attempts_left = limit - attempts
    return True, attempts_left, 0


def record_attempt(identifier, action, window_minutes):
    """
    Record an attempt for rate limiting.
    
    Args:
        identifier: Email or IP address
        action: Type of action
        window_minutes: Time window in minutes
    """
    key = get_rate_limit_key(identifier, action)
    
    # Increment attempt count
    attempts = cache.get(key, 0)
    attempts += 1
    
    # Set with expiration
    cache.set(key, attempts, window_minutes * 60)
    
    logger.debug(f"Recorded attempt {attempts} for {identifier} on {action}")


def reset_rate_limit(identifier, action):
    """
    Reset rate limit for an identifier (e.g., after successful login).
    
    Args:
        identifier: Email or IP address
        action: Type of action
    """
    key = get_rate_limit_key(identifier, action)
    cache.delete(key)
    logger.debug(f"Reset rate limit for {identifier} on {action}")
