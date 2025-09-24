from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from accounts.models import CustomUser
from products.models import Product


class Review(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]  # 1 to 5 stars

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.PositiveIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    approved = models.BooleanField(default=True)  # Set to False if moderation is enabled
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} review on {self.product}"


@receiver(post_save, sender=Review)
def update_product_rating_on_save(sender, instance, created, **kwargs):
    """Update product rating and review count when a review is saved"""
    update_product_rating_stats(instance.product)


@receiver(post_delete, sender=Review)
def update_product_rating_on_delete(sender, instance, **kwargs):
    """Update product rating and review count when a review is deleted"""
    update_product_rating_stats(instance.product)


def update_product_rating_stats(product):
    """Update product's rating and review count based on approved reviews"""
    approved_reviews = Review.objects.filter(product=product, approved=True)
    
    if approved_reviews.exists():
        # Calculate average rating
        avg_rating = approved_reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        product.rating = round(float(avg_rating), 2) if avg_rating else 0.0
        product.reviews = approved_reviews.count()
    else:
        product.rating = 0.0
        product.reviews = 0
    
    product.save(update_fields=['rating', 'reviews'])
