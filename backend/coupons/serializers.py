from rest_framework import serializers
from .models import Coupon, CouponUsage

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_percent', 'usage_limit', 'expiry_date']

class CouponUsageSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    coupon_code = serializers.CharField(source='coupon.code', read_only=True)

    class Meta:
        model = CouponUsage
        fields = ['id', 'user', 'user_email', 'coupon', 'coupon_code', 'used_at']
        read_only_fields = ['used_at', 'user_email', 'coupon_code']
