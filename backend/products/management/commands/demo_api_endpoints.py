from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product, Category, ProductMedia

User = get_user_model()

class Command(BaseCommand):
    help = 'Demonstrate the different API endpoints for product media'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔗 Product Media API Endpoints Demo'))
        
        # Get or create test data
        seller, created = User.objects.get_or_create(
            email='api_test_seller@example.com',
            defaults={
                'role': 'SELLER',
                'is_active': True,
            }
        )
        if created:
            seller.set_password('testpassword')
            seller.save()
        
        category, created = Category.objects.get_or_create(
            name='API Test Category'
        )
        
        self.stdout.write('\n📋 Available API Endpoints:')
        self.stdout.write('='*60)
        
        # 1. Create new product with media
        self.stdout.write('\n1️⃣ CREATE NEW Product with Media:')
        self.stdout.write('   POST /api/products/')
        self.stdout.write('   Body: {')
        self.stdout.write('     "name": "New Product",')
        self.stdout.write('     "price": "29.99",')
        self.stdout.write('     "category_id": 1,')
        self.stdout.write('     "images": ["base64_string1", "base64_string2"],')
        self.stdout.write('     "video_links": ["https://youtube.com/..."]')
        self.stdout.write('   }')
        
        # 2. Add media to existing product
        self.stdout.write('\n2️⃣ ADD Media to Existing Product:')
        self.stdout.write('   POST /api/products/{product_id}/add_media/')
        self.stdout.write('   Body: {')
        self.stdout.write('     "images": ["base64_string3"],')
        self.stdout.write('     "video_links": ["https://vimeo.com/..."]')
        self.stdout.write('   }')
        self.stdout.write('   ✅ Keeps existing media + adds new media')
        
        # 3. Update product media (replace all)
        self.stdout.write('\n3️⃣ UPDATE Product Media (Replace All):')
        self.stdout.write('   PATCH /api/products/{product_id}/')
        self.stdout.write('   Body: {')
        self.stdout.write('     "images": ["new_base64_string"],')
        self.stdout.write('     "video_links": ["https://new-video.com/..."]')
        self.stdout.write('   }')
        self.stdout.write('   ⚠️  Replaces ALL existing media')
        
        # 4. Get product media
        self.stdout.write('\n4️⃣ GET Product Media:')
        self.stdout.write('   GET /api/products/{product_id}/media/')
        self.stdout.write('   Returns: All images and videos for the product')
        
        # 5. Clear all media
        self.stdout.write('\n5️⃣ CLEAR All Product Media:')
        self.stdout.write('   DELETE /api/products/{product_id}/clear_media/')
        self.stdout.write('   Deletes: All media files and database records')
        
        # Key differences
        self.stdout.write('\n🔑 KEY DIFFERENCES:')
        self.stdout.write('='*60)
        self.stdout.write('📝 CREATE (POST /api/products/):')
        self.stdout.write('   - Creates NEW product with name, price, etc.')
        self.stdout.write('   - Product ID doesn\'t exist yet')
        self.stdout.write('   - Uses product name because it\'s a new product')
        self.stdout.write('')
        self.stdout.write('➕ ADD MEDIA (POST /api/products/{id}/add_media/):')
        self.stdout.write('   - Adds media to EXISTING product')
        self.stdout.write('   - Uses product ID (unique identifier)')
        self.stdout.write('   - Keeps existing media + adds new ones')
        self.stdout.write('')
        self.stdout.write('🔄 UPDATE (PATCH /api/products/{id}/):')
        self.stdout.write('   - Updates EXISTING product')
        self.stdout.write('   - Uses product ID (unique identifier)')
        self.stdout.write('   - Replaces ALL existing media')
        
        # Example with actual product
        self.stdout.write('\n💡 PRACTICAL EXAMPLE:')
        self.stdout.write('='*60)
        
        # Create a test product
        product = Product.objects.create(
            seller=seller,
            name='Demo Product',
            price=19.99,
            category=category,
            stock_quantity=50
        )
        
        self.stdout.write(f'✅ Created test product with ID: {product.id}')
        self.stdout.write('')
        self.stdout.write('Now you can:')
        self.stdout.write(f'   GET  /api/products/{product.id}/media/')
        self.stdout.write(f'   POST /api/products/{product.id}/add_media/')
        self.stdout.write(f'   PATCH /api/products/{product.id}/')
        self.stdout.write(f'   DELETE /api/products/{product.id}/clear_media/')
        
        self.stdout.write('\n✅ Demo completed!')
