from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product
from products.serializers import CategorySerializer

User = get_user_model()

class Command(BaseCommand):
    help = 'Demonstrate Category API endpoints and permissions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('📂 Category Management API Demo'))
        
        # Create test categories
        parent_cat, created = Category.objects.get_or_create(name='Electronics')
        if created:
            self.stdout.write('✅ Created parent category: Electronics')
        
        subcat1, created = Category.objects.get_or_create(
            name='Smartphones', 
            defaults={'parent': parent_cat}
        )
        if created:
            self.stdout.write('✅ Created subcategory: Smartphones')
        
        subcat2, created = Category.objects.get_or_create(
            name='Laptops', 
            defaults={'parent': parent_cat}
        )
        if created:
            self.stdout.write('✅ Created subcategory: Laptops')
        
        # Create another parent category
        parent_cat2, created = Category.objects.get_or_create(name='Clothing')
        if created:
            self.stdout.write('✅ Created parent category: Clothing')
        
        self.stdout.write('\n📋 Available Category API Endpoints:')
        self.stdout.write('='*60)
        
        # Public endpoints (anyone can access)
        self.stdout.write('\n🔓 PUBLIC ENDPOINTS (No authentication required):')
        self.stdout.write('   GET  /api/categories/                    # List all categories')
        self.stdout.write('   GET  /api/categories/{id}/               # Get specific category')
        self.stdout.write('   GET  /api/categories/{id}/subcategories/ # Get subcategories')
        self.stdout.write('   GET  /api/categories/tree/               # Get category tree')
        self.stdout.write('   GET  /api/categories/?include_subcategories=true  # Include subcategories in list')
        
        # Admin only endpoints
        self.stdout.write('\n🔒 SUPER ADMIN ONLY ENDPOINTS:')
        self.stdout.write('   POST   /api/categories/     # Create new category')
        self.stdout.write('   PUT    /api/categories/{id}/ # Update category')
        self.stdout.write('   PATCH  /api/categories/{id}/ # Partial update')
        self.stdout.write('   DELETE /api/categories/{id}/ # Delete category')
        
        self.stdout.write('\n📝 Request Examples:')
        self.stdout.write('-'*40)
        
        # Create category example
        self.stdout.write('\n1️⃣ CREATE Category (Super Admin only):')
        self.stdout.write('   POST /api/categories/')
        self.stdout.write('   Authorization: Bearer <super_admin_token>')
        self.stdout.write('   {')
        self.stdout.write('     "name": "New Category",')
        self.stdout.write('     "parent": null          // For parent category')
        self.stdout.write('   }')
        
        # Create subcategory example
        self.stdout.write('\n2️⃣ CREATE Subcategory (Super Admin only):')
        self.stdout.write('   POST /api/categories/')
        self.stdout.write('   {')
        self.stdout.write(f'     "name": "New Subcategory",')
        self.stdout.write(f'     "parent": {parent_cat.id}        // Parent category ID')
        self.stdout.write('   }')
        
        # Test serializer output
        self.stdout.write('\n📊 Current Category Structure:')
        self.stdout.write('-'*40)
        
        class MockRequest:
            def __init__(self):
                self.query_params = {'include_subcategories': 'true'}
        
        context = {'request': MockRequest()}
        
        parent_categories = Category.objects.filter(parent=None)
        for cat in parent_categories:
            serializer = CategorySerializer(cat, context=context)
            data = serializer.data
            
            self.stdout.write(f'\n📁 {data["name"]} (ID: {data["id"]})')
            self.stdout.write(f'   📊 Products: {data["products_count"]}')
            self.stdout.write(f'   📁 Subcategories: {data["subcategories_count"]}')
            
            for subcat in data['subcategories']:
                self.stdout.write(f'   └── {subcat["name"]} (ID: {subcat["id"]}) - Products: {subcat["products_count"]}')
        
        self.stdout.write('\n🔑 Permission Requirements:')
        self.stdout.write('='*60)
        self.stdout.write('👁️  READ (categories, subcategories): Anyone')
        self.stdout.write('✏️  CREATE/UPDATE/DELETE: Super Admin only')
        self.stdout.write('   - Must be authenticated')
        self.stdout.write('   - Must have role = "ADMIN"')
        self.stdout.write('   - Must have is_superuser = True')
        
        self.stdout.write('\n🚫 Delete Protection:')
        self.stdout.write('   - Cannot delete category with subcategories')
        self.stdout.write('   - Cannot delete category with products')
        self.stdout.write('   - Must delete subcategories/move products first')
        
        self.stdout.write('\n✅ Demo completed!')
