from django.utils import timezone
from datetime import timedelta
from .models import OTPStore
import logging
import hashlib

logger = logging.getLogger('accounts')

# OTP Configuration
OTP_EXPIRY_MINUTES = 5
OTP_CLEANUP_THRESHOLD_MINUTES = 10 
OTP_MAX_ATTEMPTS = 5

def clean_expired_otps():
    try:
        threshold_time = timezone.now()
        expired_otps = OTPStore.objects.filter(otp_expires_at__lt=threshold_time)
        count = expired_otps.count()
        if count > 0:
            expired_otps.delete()
            logger.info(f"Cleaned up {count} expired OTP entries")
        return count
    except Exception as e:
        logger.error(f"Error cleaning expired OTPs: {e}")
        return 0

def clean_otp_for_user(user):
    try:
        OTPStore.objects.filter(user=user).delete()
    except Exception as e:
        logger.error(f"Error cleaning OTP for user: {e}")

def set_otp(user, otp_code, otp_type='login'):
    try:
        otp_hash = hashlib.sha256(str(otp_code).encode()).hexdigest()
        expires_at = timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        OTPStore.objects.update_or_create(
            user=user,
            defaults={
                'otp_hash': otp_hash,
                'otp_expires_at': expires_at,
                'otp_type': otp_type,
                'attempts': 0
            }
        )
        return True
    except Exception as e:
        logger.error(f"Error setting OTP: {e}")
        return False

def verify_otp(user, otp_input):
    try:
        otp_store = OTPStore.objects.filter(user=user).first()
        if not otp_store:
            return False, "No OTP found. Please request a new code."
        if otp_store.attempts >= OTP_MAX_ATTEMPTS:
            return False, "Too many failed attempts."
        if timezone.now() > otp_store.otp_expires_at:
            otp_store.delete()
            return False, "OTP expired."
        input_hash = hashlib.sha256(str(otp_input).encode()).hexdigest()
        if input_hash == otp_store.otp_hash:
            return True, None
        otp_store.attempts += 1
        otp_store.save()
        return False, "Invalid OTP."
    except Exception as e:
        logger.error(f"Error verifying OTP: {e}")
        return False, "Error validating OTP"

def get_otp_remaining_time(user):
    try:
        otp_store = OTPStore.objects.filter(user=user).first()
        if not otp_store or not otp_store.otp_expires_at:
            return 0
        time_remaining = (otp_store.otp_expires_at - timezone.now()).total_seconds()
        return max(0, int(time_remaining))
    except:
        return 0
