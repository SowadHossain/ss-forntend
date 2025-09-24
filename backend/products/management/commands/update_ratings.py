from django.core.management.base import BaseCommand
from django.db.models import Avg
from products.models import Product
from reviews.models import Review

class Command(BaseCommand):
    help = 'Update all products with correct rating and review count from existing reviews'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔄 Updating product ratings from reviews...'))
        
        products = Product.objects.all()
        updated_count = 0
        
        for product in products:
            approved_reviews = Review.objects.filter(product=product, approved=True)
            
            old_rating = product.rating
            old_review_count = product.reviews
            
            if approved_reviews.exists():
                # Calculate average rating
                avg_rating = approved_reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
                product.rating = round(float(avg_rating), 2) if avg_rating else 0.0
                product.reviews = approved_reviews.count()
            else:
                product.rating = 0.0
                product.reviews = 0
            
            # Only save if something changed
            if product.rating != old_rating or product.reviews != old_review_count:
                product.save(update_fields=['rating', 'reviews'])
                updated_count += 1
                self.stdout.write(
                    f'  📊 {product.name}: Rating {old_rating} → {product.rating}, '
                    f'Reviews {old_review_count} → {product.reviews}'
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Updated {updated_count} products out of {products.count()} total products'
            )
        )
