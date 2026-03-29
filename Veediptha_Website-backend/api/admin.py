from django.contrib import admin
from .models import (
    Product, Category, Story, Hero, Page, Coupon, 
    WebsiteTheme, WebsiteBranding, WebsiteTypography, WebsiteFooter,
    Navigation, Policy, Order, Stock, 
    Promotion, SupportTicket
)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('is_active',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    search_fields = ('name', 'slug')

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'is_active')

@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active')

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'status', 'is_active')

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'is_active')

@admin.register(WebsiteTheme)
class WebsiteThemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(WebsiteBranding)
class WebsiteBrandingAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(WebsiteTypography)
class WebsiteTypographyAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(WebsiteFooter)
class WebsiteFooterAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')

@admin.register(Navigation)
class NavigationAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user_id', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'currency')

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'current_quantity', 'low_stock_threshold')

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active')

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'issue_type', 'status', 'created_at')
    list_filter = ('status', 'issue_type')
