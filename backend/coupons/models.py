from django.db import models
from accounts.models import CustomUser

class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percent = models.PositiveIntegerField()  # e.g., 10 = 10%
    usage_limit = models.PositiveIntegerField()
    expiry_date = models.DateField()

    def __str__(self):
        return self.code


class CouponUsage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)
