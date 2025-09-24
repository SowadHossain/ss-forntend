from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product, Category, ProductMedia
from products.serializers import ProductSerializer, ProductMediaSerializer
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request

User = get_user_model()

class Command(BaseCommand):
    help = 'Test comprehensive validation for ProductMedia functionality'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 Testing ProductMedia validation...'))
        
        # Get or create a seller user
        seller, created = User.objects.get_or_create(
            email='validation_test_seller@example.com',
            defaults={
                'role': 'SELLER',
                'is_active': True,
            }
        )
        if created:
            seller.set_password('testpassword')
            seller.save()
        
        # Get or create a category
        category, created = Category.objects.get_or_create(
            name='Validation Test Category'
        )
        
        # Create mock request
        factory = APIRequestFactory()
        request = factory.post('/api/products/')
        request = Request(request)
        
        context = {'request': request}
        
        # Test 1: Valid product creation with media
        self.stdout.write('\n📝 Test 1: Valid product with media')
        valid_data = {
            'name': 'Valid Test Product',
            'description': 'Testing validation',
            'price': '49.99',
            'stock_quantity': 25,
            'category_id': category.id,
            'images': [
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            ],
            'video_links': [
                'https://www.youtube.com/watch?v=test123'
            ]
        }
        
        serializer = ProductSerializer(data=valid_data, context=context)
        if serializer.is_valid():
            serializer.validated_data['seller'] = seller
            product = serializer.save()
            media_count = ProductMedia.objects.filter(product=product).count()
            self.stdout.write(self.style.SUCCESS(f'  ✅ Product created with {media_count} media items'))
        else:
            self.stdout.write(self.style.ERROR(f'  ❌ Validation failed: {serializer.errors}'))
        
        # Test 2: Invalid base64 image
        self.stdout.write('\n📝 Test 2: Invalid base64 image')
        invalid_image_data = {
            'name': 'Invalid Image Test',
            'price': '29.99',
            'stock_quantity': 10,
            'category_id': category.id,
            'images': [
                'invalid_base64_string',
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',  # valid
            ]
        }
        
        serializer = ProductSerializer(data=invalid_image_data, context=context)
        if serializer.is_valid():
            serializer.validated_data['seller'] = seller
            product = serializer.save()
            media_count = ProductMedia.objects.filter(product=product, media_type='IMAGE').count()
            self.stdout.write(self.style.SUCCESS(f'  ✅ Product created, {media_count} valid images processed (invalid ones skipped)'))
        else:
            self.stdout.write(self.style.ERROR(f'  ❌ Unexpected validation failure: {serializer.errors}'))
        
        # Test 3: Invalid video URLs
        self.stdout.write('\n📝 Test 3: Invalid video URLs')
        invalid_video_data = {
            'name': 'Invalid Video Test',
            'price': '39.99',
            'stock_quantity': 15,
            'category_id': category.id,
            'video_links': [
                'not_a_url',
                'ftp://invalid.protocol',
                'https://valid.youtube.com/watch?v=test'  # valid
            ]
        }
        
        serializer = ProductSerializer(data=invalid_video_data, context=context)
        if serializer.is_valid():
            serializer.validated_data['seller'] = seller
            product = serializer.save()
            media_count = ProductMedia.objects.filter(product=product, media_type='VIDEO').count()
            self.stdout.write(self.style.SUCCESS(f'  ✅ Product created, {media_count} valid videos processed (invalid ones skipped)'))
        else:
            self.stdout.write(self.style.ERROR(f'  ❌ Unexpected validation failure: {serializer.errors}'))
        
        # Test 4: ProductMedia direct validation
        self.stdout.write('\n📝 Test 4: ProductMedia direct validation')
        
        # Test invalid media type
        invalid_media_data = {
            'product': product.id,
            'media_type': 'INVALID',
            'file_path': 'test.png'
        }
        
        media_serializer = ProductMediaSerializer(data=invalid_media_data)
        if not media_serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f'  ✅ Correctly rejected invalid media_type: {media_serializer.errors}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ Should have rejected invalid media_type'))
        
        # Test IMAGE without file_path
        invalid_image_media = {
            'product': product.id,
            'media_type': 'IMAGE',
            'url': 'https://example.com'
        }
        
        media_serializer = ProductMediaSerializer(data=invalid_image_media)
        if not media_serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f'  ✅ Correctly rejected IMAGE without file_path: {media_serializer.errors}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ Should have rejected IMAGE without file_path'))
        
        # Test VIDEO without url
        invalid_video_media = {
            'product': product.id,
            'media_type': 'VIDEO',
            'file_path': 'test.mp4'
        }
        
        media_serializer = ProductMediaSerializer(data=invalid_video_media)
        if not media_serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f'  ✅ Correctly rejected VIDEO without url: {media_serializer.errors}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ Should have rejected VIDEO without url'))
        
        # Test 5: Empty arrays (should work fine)
        self.stdout.write('\n📝 Test 5: Empty media arrays')
        empty_media_data = {
            'name': 'Empty Media Test',
            'price': '19.99',
            'stock_quantity': 5,
            'category_id': category.id,
            'images': [],
            'video_links': []
        }
        
        serializer = ProductSerializer(data=empty_media_data, context=context)
        if serializer.is_valid():
            serializer.validated_data['seller'] = seller
            product = serializer.save()
            media_count = ProductMedia.objects.filter(product=product).count()
            self.stdout.write(self.style.SUCCESS(f'  ✅ Product created with {media_count} media items (expected 0)'))
        else:
            self.stdout.write(self.style.ERROR(f'  ❌ Validation failed: {serializer.errors}'))
        
        # Summary
        self.stdout.write('\n' + '='*50)
        total_products = Product.objects.filter(seller=seller).count()
        total_media = ProductMedia.objects.filter(product__seller=seller).count()
        self.stdout.write(self.style.SUCCESS(f'✅ Validation tests completed!'))
        self.stdout.write(f'📊 Created {total_products} test products with {total_media} media items')
        self.stdout.write('🧹 You may want to clean up test data later.')
