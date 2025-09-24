from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product, Category
from reviews.models import Review
from reviews.serializers import ReviewSerializer

User = get_user_model()

class Command(BaseCommand):
    help = 'Test if review serializer returns user names instead of IDs'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 Testing Review Serializer User Field...'))
        
        # Get or create test data
        user, created = User.objects.get_or_create(
            email='review_test_user@example.com',
            defaults={
                'name': 'Test User',
                'role': 'BUYER',
                'is_active': True,
            }
        )
        if created:
            user.set_password('testpassword')
            user.save()
        
        category, created = Category.objects.get_or_create(name='Test Category')
        
        seller, created = User.objects.get_or_create(
            email='test_seller_review@example.com',
            defaults={
                'name': 'Seller Test',
                'role': 'SELLER',
                'is_active': True,
            }
        )
        
        product, created = Product.objects.get_or_create(
            name='Test Product for Review',
            defaults={
                'seller': seller,
                'price': 29.99,
                'category': category,
                'stock_quantity': 10
            }
        )
        
        # Create a test review
        review, created = Review.objects.get_or_create(
            user=user,
            product=product,
            defaults={
                'rating': 5,
                'comment': 'Great product!',
                'approved': True
            }
        )
        
        # Test the serializer
        class MockRequest:
            def __init__(self, user):
                self.user = user
        
        context = {'request': MockRequest(user)}
        serializer = ReviewSerializer(review, context=context)
        
        self.stdout.write('\n📝 Review Serializer Output:')
        self.stdout.write('-' * 40)
        
        data = serializer.data
        for field, value in data.items():
            self.stdout.write(f'{field}: {value}')
        
        self.stdout.write('\n✅ Key Tests:')
        self.stdout.write(f'   User field type: {type(data["user"]).__name__}')
        self.stdout.write(f'   User field value: "{data["user"]}"')
        self.stdout.write(f'   Expected: "{user.name}"')
        
        if data["user"] == user.name:
            self.stdout.write(self.style.SUCCESS('   ✅ SUCCESS: User field returns name instead of ID!'))
        else:
            self.stdout.write(self.style.ERROR('   ❌ FAILED: User field still returns ID'))
        
        if isinstance(data["user"], str) and not data["user"].isdigit():
            self.stdout.write(self.style.SUCCESS('   ✅ SUCCESS: User field is a string (name), not number (ID)!'))
        else:
            self.stdout.write(self.style.ERROR('   ❌ FAILED: User field appears to be an ID'))
        
        self.stdout.write('\n🎉 Test completed!')
