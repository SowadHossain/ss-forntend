from django.db import models
from orders.models import Order

class PaymentTransaction(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=30)
    method = models.CharField(max_length=50)
    paid_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.transaction_id
