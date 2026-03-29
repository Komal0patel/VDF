import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django_mongodb_backend.fields import ObjectIdAutoField
from .managers import UserManager
from .encryption_utils import (
    encrypt_with_user_key, 
    decrypt_with_user_key, 
    generate_lookup_hash
)

class User(AbstractBaseUser, PermissionsMixin):
    id = ObjectIdAutoField(primary_key=True)
    email = models.EmailField(unique=True, db_index=True)
    username = models.CharField(max_length=255, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    @property
    def profile(self):
        """Compatibility property to fetch either Admin or Customer profile."""
        if hasattr(self, 'admin_profile'):
            return self.admin_profile
        if hasattr(self, 'customer_profile'):
            return self.customer_profile
        return None

    class Meta:
        db_table = 'auth_user'

    def __str__(self):
        return self.email

class BaseEncryptedProfile(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    last_signin_at = models.DateTimeField(blank=True, null=True)
    
    # Encrypted fields
    _google_id = models.TextField(db_column='google_id', blank=True, null=True)
    _full_name = models.TextField(db_column='full_name', blank=True, null=True)
    _avatar_url = models.TextField(db_column='avatar_url', blank=True, null=True)
    _raw_data = models.TextField(db_column='raw_data', blank=True, null=True)
    _phone = models.TextField(db_column='phone', blank=True, null=True)
    
    # Deterministic Hashes for Lookups (HMAC)
    phone_hash = models.CharField(max_length=64, db_index=True, null=True, blank=True)
    
    # Plain Text Email (for transparency/debugging)
    plain_email = models.EmailField(max_length=255, null=True, blank=True, db_index=True)

    is_verified = models.BooleanField(default=False)
    profile_completed = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def _get_encryption_params(self):
        return (str(self.user_id), self.created_at)

    @property
    def google_id(self):
        if not self._google_id: return None
        user_id, created = self._get_encryption_params()
        return decrypt_with_user_key(self._google_id, user_id, created)
    
    @google_id.setter
    def google_id(self, value):
        if not value:
            self._google_id = None
            return
        user_id, created = self._get_encryption_params()
        self._google_id = encrypt_with_user_key(str(value), user_id, created)

    @property
    def full_name(self):
        if not self._full_name: return None
        if not str(self._full_name).startswith('v2$'):
            return self._full_name
        user_id, created = self._get_encryption_params()
        return decrypt_with_user_key(self._full_name, user_id, created)
    
    @full_name.setter
    def full_name(self, value):
        self._full_name = value

    @property
    def avatar_url(self):
        if not self._avatar_url: return None
        user_id, created = self._get_encryption_params()
        return decrypt_with_user_key(self._avatar_url, user_id, created)
    
    @avatar_url.setter
    def avatar_url(self, value):
        if not value:
            self._avatar_url = None
            return
        user_id, created = self._get_encryption_params()
        self._avatar_url = encrypt_with_user_key(value, user_id, created)

    @property
    def raw_data(self):
        if not self._raw_data: return None
        user_id, created = self._get_encryption_params()
        return decrypt_with_user_key(self._raw_data, user_id, created)

    @raw_data.setter
    def raw_data(self, value):
        if not value:
            self._raw_data = None
            return
        user_id, created = self._get_encryption_params()
        self._raw_data = encrypt_with_user_key(str(value), user_id, created)

    @property
    def phone(self):
        if not self._phone: return None
        user_id, created = self._get_encryption_params()
        return decrypt_with_user_key(self._phone, user_id, created)
    
    @phone.setter
    def phone(self, value):
        if not value:
            self._phone = None
            self.phone_hash = None
            return
        user_id, created = self._get_encryption_params()
        self._phone = encrypt_with_user_key(str(value), user_id, created)
        self.phone_hash = generate_lookup_hash(str(value))

class AdminProfile(BaseEncryptedProfile):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    
    USER_TYPES = (
        ('super_admin', 'Super Admin'),
        ('assistant_admin', 'Assistant Admin'),
        ('product_manager', 'Product Manager'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='assistant_admin')

    def __str__(self):
        return f"Admin Profile for {self.user.email}"

    def save(self, *args, **kwargs):
        # Sync staff status
        if self.user_type == 'super_admin':
            self.user.is_superuser = True
            self.user.is_staff = True
        else:
            self.user.is_staff = True
            self.user.is_superuser = False
        self.user.save(update_fields=['is_staff', 'is_superuser'])
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'accounts_admin_profile'

class CustomerProfile(BaseEncryptedProfile):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    cart_data = models.JSONField(default=list, blank=True)
    favorites_data = models.JSONField(default=list, blank=True)
    customer_id = models.CharField(max_length=20, unique=True, null=True, blank=True)

    # Consumer specific fields
    country_code = models.CharField(max_length=10, default='US', db_index=True)
    preferred_currency = models.CharField(max_length=10, default='USD')

    @property
    def _customer_id(self):
        return self.customer_id

    def __str__(self):
        return f"Customer Profile for {self.user.email}"

    def save(self, *args, **kwargs):
        # Customers cannot be staff
        if self.user.is_staff or self.user.is_superuser:
            self.user.is_staff = False
            self.user.is_superuser = False
            self.user.save(update_fields=['is_staff', 'is_superuser'])
            
        if not self.customer_id:
            import uuid
            self.customer_id = f"CUST-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'accounts_customer_profile'

class Address(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    
    ADDRESS_TYPES = (
        ('shipping', 'Shipping Address'),
        ('billing', 'Billing Address'),
        ('both', 'Both'),
    )
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='shipping')
    is_default = models.BooleanField(default=False)
    
    # Encrypted fields (renamed to avoid conflict with Django's internal _state)
    enc_full_name = models.TextField(db_column='full_name')
    enc_phone = models.TextField(db_column='phone')
    enc_street_address = models.TextField(db_column='street_address')
    enc_city = models.TextField(db_column='city')
    enc_state = models.TextField(db_column='state')
    enc_pincode = models.TextField(db_column='pincode')
    enc_country = models.TextField(db_column='country', default='USA')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def _get_encryption_params(self):
        try:
            profile = self.user.profile
            if not profile: return (None, None)
            return (str(self.user_id), profile.created_at)
        except (AttributeError, User.DoesNotExist):
            return (None, None)

    @property
    def full_name(self):
        if hasattr(self, '_temp_full_name'): return self._temp_full_name
        if not hasattr(self, 'enc_full_name') or not self.enc_full_name: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_full_name, user_id, seed)

    @full_name.setter
    def full_name(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_full_name = encrypt_with_user_key(value, user_id, seed)
        else:
            self._temp_full_name = value

    @property
    def city(self):
        if hasattr(self, '_temp_city'): return self._temp_city
        if not hasattr(self, 'enc_city') or not self.enc_city: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_city, user_id, seed)

    @city.setter
    def city(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_city = encrypt_with_user_key(value, user_id, seed)
        else:
            self._temp_city = value

    @property
    def state(self):
        if hasattr(self, '_temp_state'): return self._temp_state
        if not hasattr(self, 'enc_state') or not self.enc_state: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_state, user_id, seed)

    @state.setter
    def state(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_state = encrypt_with_user_key(value, user_id, seed)
        else:
            self._temp_state = value

    @property
    def pincode(self):
        if hasattr(self, '_temp_pincode'): return self._temp_pincode
        if not hasattr(self, 'enc_pincode') or not self.enc_pincode: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_pincode, user_id, seed)

    @pincode.setter
    def pincode(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_pincode = encrypt_with_user_key(str(value), user_id, seed)
        else:
            self._temp_pincode = value

    @property
    def country(self):
        if hasattr(self, '_temp_country'): return self._temp_country
        if not hasattr(self, 'enc_country') or not self.enc_country: return "USA"
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_country, user_id, seed)

    @country.setter
    def country(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_country = encrypt_with_user_key(value, user_id, seed)
        else:
            self._temp_country = value

    @property
    def street_address(self):
        if hasattr(self, '_temp_street_address'): return self._temp_street_address
        if not hasattr(self, 'enc_street_address') or not self.enc_street_address: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_street_address, user_id, seed)

    @street_address.setter
    def street_address(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_street_address = encrypt_with_user_key(value, user_id, seed)
        else:
            self._temp_street_address = value

    @property
    def phone(self):
        if hasattr(self, '_temp_phone'): return self._temp_phone
        if not hasattr(self, 'enc_phone') or not self.enc_phone: return ""
        user_id, seed = self._get_encryption_params()
        if not user_id: return "Encrypted"
        return decrypt_with_user_key(self.enc_phone, user_id, seed)

    @phone.setter
    def phone(self, value):
        user_id, seed = self._get_encryption_params()
        if user_id and seed:
            self.enc_phone = encrypt_with_user_key(str(value), user_id, seed)
        else:
            self._temp_phone = value

    def save(self, *args, **kwargs):
        # Handle late encryption if user was just bound
        for attr in ['full_name', 'city', 'state', 'pincode', 'country', 'street_address', 'phone']:
            temp_attr = f'_temp_{attr}'
            if hasattr(self, temp_attr):
                val = getattr(self, temp_attr)
                setattr(self, attr, val) # This will now use the setter with self.user present
                delattr(self, temp_attr)
        super().save(*args, **kwargs)

class OTPStore(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='otp_store')
    otp_hash = models.CharField(max_length=128)
    otp_expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.IntegerField(default=0)
    
    OTP_TYPES = (
        ('login', 'Login'),
        ('signup', 'Signup Verification'),
        ('reset', 'Password Reset'),
        ('unlock', 'Account Unlock'),
    )
    otp_type = models.CharField(max_length=20, choices=OTP_TYPES, default='login')

    def is_valid(self):
        return timezone.now() < self.otp_expires_at

class PendingSignup(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    email = models.EmailField(unique=True, db_index=True)
    otp_hash = models.CharField(max_length=128)
    otp_expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.IntegerField(default=0)

    def is_valid(self):
        return timezone.now() < self.otp_expires_at

class RefreshToken(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refresh_tokens')
    token_hash = models.CharField(max_length=128, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    revoked = models.DateTimeField(null=True, blank=True)
    replaced_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='replaced_token')
    
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    def is_valid(self):
        return not self.revoked and self.expires_at > timezone.now()

class Favorite(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product_id = models.CharField(max_length=64, db_index=True) # Assuming product ID is a string/slug
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product_id')
        db_table = 'accounts_favorite'

class ProductAnalytics(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    product_id = models.CharField(max_length=64, unique=True, db_index=True)
    views = models.IntegerField(default=0)
    current_watching = models.IntegerField(default=0) # Simulated or session-based live count
    cart_adds = models.IntegerField(default=0)
    purchases = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_product_analytics'
