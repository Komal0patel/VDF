from django.urls import path
from .views import (
    SignupInitView, SignupVerifyView, SignupCompleteView,
    EmailLoginView, GoogleLoginView, CompleteProfileView,
    TokenRefreshView, LogoutView, UserDetailView, CartSyncView, UserDeleteView,
    PasswordResetRequestView, PasswordResetConfirmView,
    ChangePasswordVerifyView, ChangePasswordFinalizeView,
    UnlockRequestView, UnlockConfirmView,
    ReactivateAccountView,
    AdminListView, AdminCreateView, AdminUpdateView, AdminDeleteView,
    AddressListView, AddressDetailView
)

urlpatterns = [
    # Signup Flow
    path('signup/init/', SignupInitView.as_view(), name='signup-init'),
    path('signup/verify/', SignupVerifyView.as_view(), name='signup-verify'),
    path('signup/complete/', SignupCompleteView.as_view(), name='signup-complete'),
    
    # Login Flow
    path('login/', EmailLoginView.as_view(), name='login'),
    path('login/google/', GoogleLoginView.as_view(), name='google-login'),
    path('complete-profile/', CompleteProfileView.as_view(), name='complete-profile'),
    
    # Token Management
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('reactivate/', ReactivateAccountView.as_view(), name='reactivate'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # User / Profile
    path('me/', UserDetailView.as_view(), name='user-detail'),
    path('me/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('me/cart/', CartSyncView.as_view(), name='cart-sync'),
    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/<str:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('me/change-password/verify/', ChangePasswordVerifyView.as_view(), name='change-password-verify'),
    path('me/change-password/finalize/', ChangePasswordFinalizeView.as_view(), name='change-password-finalize'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('unlock/request/', UnlockRequestView.as_view(), name='unlock-request'),
    path('unlock/confirm/', UnlockConfirmView.as_view(), name='unlock-confirm'),
    
    # Admin Management (RBAC)
    path('admins/', AdminListView.as_view(), name='admin-list'),
    path('admins/create/', AdminCreateView.as_view(), name='admin-create'),
    path('admins/update/<str:pk>/', AdminUpdateView.as_view(), name='admin-update'),
    path('admins/delete/<str:pk>/', AdminDeleteView.as_view(), name='admin-delete'),
]
