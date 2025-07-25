from django.db import models
from accounts.models import CustomUser


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories'
    )

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    BADGE_CHOICES = [
        ('TOP_SELLER', 'Top Seller'),
        ('RECOMMENDED', 'Recommended'),
        ('HOT', 'Hot'),
    ]

    LABEL_CHOICES = [
        ('FREE_SHIPPING', 'Free Shipping'),
        ('LIMITED_STOCK', 'Limited Stock'),
        ('CASHBACK', 'Cashback'),
    ]

    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'SELLER'})
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)

    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, null=True, blank=True)
    label = models.CharField(max_length=20, choices=LABEL_CHOICES, null=True, blank=True)

    image = models.ImageField(upload_to='products/', null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    reviews = models.PositiveIntegerField(default=0)

    recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
