from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AdminProfile, CustomerProfile, Address

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class AddressSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    full_name = serializers.CharField()
    phone = serializers.CharField()
    street_address = serializers.CharField()
    city = serializers.CharField()
    state = serializers.CharField()
    pincode = serializers.CharField()
    country = serializers.CharField()

    class Meta:
        model = Address
        fields = ['id', 'address_type', 'is_default', 'full_name', 'phone', 
                  'street_address', 'city', 'state', 'pincode', 'country']

class ProfileSerializer(serializers.ModelSerializer):
    # We expose the DECRYPTED values
    google_id = serializers.CharField(required=False, allow_null=True)
    full_name = serializers.CharField()
    avatar_url = serializers.CharField(required=False, allow_null=True)
    phone = serializers.CharField(required=False, allow_null=True)
    # email sourced from plain_email decrypted field on EncryptedProfile
    email = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    is_verified = serializers.BooleanField()
    profile_completed = serializers.BooleanField()
    customer_id = serializers.SerializerMethodField()
    
    country_code = serializers.SerializerMethodField()
    preferred_currency = serializers.SerializerMethodField()
    cart_data = serializers.ListField(child=serializers.DictField(), required=False)
    addresses = AddressSerializer(many=True, read_only=True, source='user.addresses')

    def get_user_type(self, obj):
        return getattr(obj, 'user_type', 'customer')

    def get_country_code(self, obj):
        return getattr(obj, 'country_code', None)

    def get_preferred_currency(self, obj):
        return getattr(obj, 'preferred_currency', None)

    def get_email(self, obj):
        # plain_email is a property/field that returns the decrypted email
        return getattr(obj, 'plain_email', None) or getattr(obj, 'email', None) or ''

    def get_customer_id(self, obj):
        # customer_id may be stored on the related user or profile
        cid = getattr(obj, 'customer_id', None)
        if not cid and hasattr(obj, 'user'):
            cid = getattr(obj.user, 'customer_id', None)
        return cid or ''

    class Meta:
        # Use a base model or None to avoid instance type mismatch during initialization
        model = CustomerProfile
        fields = ['google_id', 'full_name', 'email', 'avatar_url', 'phone',
                  'user_type', 'is_verified', 'profile_completed', 'customer_id',
                  'country_code', 'preferred_currency', 'addresses', 'cart_data']
    
    def to_representation(self, instance):
        # Allow serializing any profile type that matches the fields
        return super().to_representation(instance)

class AdminProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()
    email = serializers.SerializerMethodField()
    user_type = serializers.CharField()
    
    def get_email(self, obj):
        return getattr(obj, 'plain_email', None) or ''

    class Meta:
        model = AdminProfile
        fields = ['full_name', 'email', 'user_type', 'is_verified', 'profile_completed']

class AuthResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    user = UserSerializer()
    profile = serializers.SerializerMethodField()
    
    def get_profile(self, obj):
        # Data passed to AuthResponseSerializer is a dict from generate_tokens
        return obj.get('profile')
