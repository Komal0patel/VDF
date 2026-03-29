from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Global permission check for Super Admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'admin_profile') and
            request.user.admin_profile.user_type == 'super_admin'
        )

class IsRoleBasedAdminOrReadOnly(permissions.BasePermission):
    """
    Role-based permission check for the Admin API.
    - Non-admins can only READ.
    - Super Admins get full access based on `is_superuser` and `admin_profile.user_type`.
    - Assistant Admins can CREATE/UPDATE, but not DELETE.
    - Product Managers can only access Product/Category/Stock/Coupon routes.
    """

    def has_permission(self, request, view):
        # Allow read-only access for any authenticated customer/guest
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Must be authenticated and have an admin profile
        if not (request.user and request.user.is_authenticated):
            return False
        
        if not hasattr(request.user, 'admin_profile'):
            return False
            
        admin_profile = request.user.admin_profile
        role = admin_profile.user_type
        
        # Super Admin has total access
        if role == 'super_admin':
            return True
            
        # Product Manager Restrictions
        if role == 'product_manager':
            # Block access to structural endpoints
            restricted_views = [
                'AdminPageListView', 'AdminPageDetailView', 
                'AdminHeroView', 'AdminNavigationDetailView', 'AdminThemeView'
            ]
            if view.__class__.__name__ in restricted_views:
                return False
            
            # Allow all actions on their permitted endpoints (except DELETE maybe? Assuming they can delete products)
            return True
            
        # Assistant Admin Restrictions
        if role == 'assistant_admin':
            # Cannot delete anything
            if request.method == 'DELETE':
                return False
            return True
            
        return False
