from django.contrib import admin
from .models import Banner, Coupon

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
  list_display = ('title', 'order', 'is_active', 'is_currently_active', 'start_date', 'end_date')
  list_filter = ('is_active',)
  search_fields = ('title',)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
  list_display = ('code', 'discount_type', 'discount_value', 'times_used', 'max_uses', 'is_active', 'is_currently_valid')
  list_filter = ('is_active', 'discount_type')
  search_fields = ('code',)