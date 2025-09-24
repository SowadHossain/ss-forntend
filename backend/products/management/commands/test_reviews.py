from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product
from reviews.models import Review
from products.serializers import ProductSerializer

User = get_user_model()

class Command(BaseCommand):
    help = 'Test the reviews integration with products'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 Testing reviews integration...'))
        
        # Get or create test users
        buyer1, created = User.objects.get_or_create(
            email='buyer1@example.com',
            defaults={'role': 'BUYER', 'is_active': True}
        )
        buyer2, created = User.objects.get_or_create(
            email='buyer2@example.com',
            defaults={'role': 'BUYER', 'is_active': True}
        )
        buyer3, created = User.objects.get_or_create(
            email='buyer3@example.com',
            defaults={'role': 'BUYER', 'is_active': True}
        )
        
        # Get a test product
        product = Product.objects.first()
        if not product:
            self.stdout.write(self.style.ERROR('❌ No products found. Create a product first.'))
            return
        
        self.stdout.write(f'📦 Testing with product: {product.name}')
        self.stdout.write(f'   Current rating: {product.rating}, Reviews: {product.reviews}')
        
        # Delete existing reviews for this product to start clean
        Review.objects.filter(product=product).delete()
        
        # Create test reviews
        reviews_data = [
            {'user': buyer1, 'rating': 5, 'comment': 'Excellent product! Highly recommended.'},
            {'user': buyer2, 'rating': 4, 'comment': 'Good quality, fast delivery.'},
            {'user': buyer3, 'rating': 3, 'comment': 'Average product, could be better.'},
        ]
        
        for review_data in reviews_data:
            review, created = Review.objects.get_or_create(
                user=review_data['user'],
                product=product,
                defaults={
                    'rating': review_data['rating'],
                    'comment': review_data['comment'],
                    'approved': True
                }
            )
            if created:
                self.stdout.write(f'  ⭐ Created review: {review.rating} stars by {review.user.email}')
        
        # Refresh product from database
        product.refresh_from_db()
        self.stdout.write(f'📊 After adding reviews:')
        self.stdout.write(f'   Rating: {product.rating}, Reviews: {product.reviews}')
        
        # Test the serializer output
        class MockRequest:
            def build_absolute_uri(self, url):
                return f'http://localhost:8000{url}'
        
        context = {'request': MockRequest()}
        serializer = ProductSerializer(product, context=context)
        
        self.stdout.write(f'\n📋 Serializer Output:')
        self.stdout.write(f'   rating (static): {serializer.data.get("rating")}')
        self.stdout.write(f'   reviews (static): {serializer.data.get("reviews")}')
        self.stdout.write(f'   average_rating (calculated): {serializer.data.get("average_rating")}')
        self.stdout.write(f'   review_count (calculated): {serializer.data.get("review_count")}')
        
        latest_reviews = serializer.data.get("latest_reviews", [])
        self.stdout.write(f'   latest_reviews count: {len(latest_reviews)}')
        for i, review in enumerate(latest_reviews):
            self.stdout.write(f'     {i+1}. {review["rating"]} stars - "{review["comment"][:30]}..."')
        
        # Test adding another review
        self.stdout.write(f'\n🔄 Testing review update...')
        buyer4, created = User.objects.get_or_create(
            email='buyer4@example.com',
            defaults={'role': 'BUYER', 'is_active': True}
        )
        
        new_review = Review.objects.create(
            user=buyer4,
            product=product,
            rating=1,
            comment='Poor quality, not satisfied.',
            approved=True
        )
        self.stdout.write(f'  ⭐ Added 1-star review by {buyer4.email}')
        
        # Refresh and check again
        product.refresh_from_db()
        serializer = ProductSerializer(product, context=context)
        
        self.stdout.write(f'📊 After adding 1-star review:')
        self.stdout.write(f'   rating (static): {serializer.data.get("rating")}')
        self.stdout.write(f'   reviews (static): {serializer.data.get("reviews")}')
        self.stdout.write(f'   average_rating (calculated): {serializer.data.get("average_rating")}')
        self.stdout.write(f'   review_count (calculated): {serializer.data.get("review_count")}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Reviews integration test completed!'))
