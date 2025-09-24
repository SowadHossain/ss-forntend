from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product, Category, ProductMedia
from products.serializers import ProductSerializer

User = get_user_model()

class Command(BaseCommand):
    help = 'Test the new multi-media functionality'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing ProductMedia functionality...'))
        
        # Get or create a seller user
        seller, created = User.objects.get_or_create(
            email='test_seller@example.com',
            defaults={
                'role': 'SELLER',
                'is_active': True,
            }
        )
        if created:
            seller.set_password('testpassword')
            seller.save()
            self.stdout.write(f'Created test seller: {seller.email}')
        
        # Get or create a category
        category, created = Category.objects.get_or_create(
            name='Test Category'
        )
        if created:
            self.stdout.write(f'Created test category: {category.name}')
        
        # Test data with multiple images and videos
        test_data = {
            'name': 'Test Product with Media',
            'description': 'Testing multiple images and videos',
            'price': '99.99',
            'stock_quantity': 50,
            'category_id': category.id,
            'tag_ids': [],  # Empty list for tags
            'images': [
                # Small base64 PNG images for testing
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4Wj0XwAAAABJRU5ErkJggg==',
            ],
            'video_links': [
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'https://vimeo.com/123456789'
            ]
        }
        
        # Create a mock request context
        class MockRequest:
            def __init__(self):
                self.data = {}
                
            def build_absolute_uri(self, url):
                return f'http://localhost:8000{url}'
        
        # Test the serializer
        context = {'request': MockRequest()}
        serializer = ProductSerializer(data=test_data, context=context)
        
        if serializer.is_valid():
            # Set the seller
            serializer.validated_data['seller'] = seller
            product = serializer.save()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Product created: {product.name}'))
            
            # Check media objects
            media_objects = ProductMedia.objects.filter(product=product)
            self.stdout.write(f'📸 Created {media_objects.filter(media_type="IMAGE").count()} images')
            self.stdout.write(f'🎥 Created {media_objects.filter(media_type="VIDEO").count()} videos')
            
            # Display media info
            for media in media_objects:
                if media.media_type == 'IMAGE':
                    self.stdout.write(f'   Image: {media.file_path}')
                else:
                    self.stdout.write(f'   Video: {media.url}')
            
            # Test serializer output
            output_serializer = ProductSerializer(product, context=context)
            self.stdout.write('\n📋 Serializer Output (media field):')
            for media_item in output_serializer.data.get('media', []):
                self.stdout.write(f'   {media_item}')
                
        else:
            self.stdout.write(self.style.ERROR(f'❌ Serializer errors: {serializer.errors}'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Test completed!'))
