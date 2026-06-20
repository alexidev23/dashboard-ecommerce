from rest_framework import serializers
from .models import Banner, Coupon

class BannerSerializer(serializers.ModelSerializer):
  is_currently_active = serializers.BooleanField(read_only=True)

  class Meta:
    model = Banner
    fields = [
      'id', 'title', 'image', 'link_url', 'order',
      'is_active', 'is_currently_active', 'start_date', 'end_date', 'created_at'
    ]
    read_only_fields = ['created_at']


class CouponSerializer(serializers.ModelSerializer):
  is_currently_valid = serializers.BooleanField(read_only=True)

  class Meta:
    model = Coupon
    fields = [
      'id', 'code', 'description', 'discount_type', 'discount_value',
      'max_uses', 'times_used', 'is_active', 'is_currently_valid',
      'start_date', 'end_date', 'created_at'
    ]
    read_only_fields = ['times_used', 'created_at']