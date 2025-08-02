from django.core.management.base import BaseCommand
from accounts.models import CustomUser, SellerProfile
from products.models import Product, Category, Tag
from random import randint, uniform, choice


class Command(BaseCommand):
    help = "Create dummy users (admin, sellers, buyers), seller profiles, and products"

    def handle(self, *args, **kwargs):
        self.stdout.write("⏳ Cleaning up old data...")

        # Only delete non-admin users
        CustomUser.objects.exclude(role='ADMIN').delete()
        SellerProfile.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Tag.objects.all().delete()

        self.stdout.write("⏳ Creating users...")

        # Admin (create if not exists)
        admin, created = CustomUser.objects.get_or_create(
            email="admin@shobshopping.com",
            defaults={
                'name': "Site Admin",
                'role': "ADMIN",
                'is_superuser': True,
                'is_staff': True
            }
        )
        if created:
            admin.set_password("admin123")
            admin.save()
            self.stdout.write("✅ Admin created: admin@shobshopping.com / admin123")
        else:
            self.stdout.write("⚠️ Admin already exists: admin@shobshopping.com")

        # Sellers
        sellers = []
        for i in range(3):
            email = f"seller{i+1}@shop.com"
            seller, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'name': f"Seller {i+1}",
                    'role': "SELLER",
                    'is_staff': False
                }
            )
            if created:
                seller.set_password("seller123")
                seller.save()
                self.stdout.write(f"✅ Seller created: {email}")
            else:
                self.stdout.write(f"⚠️ Seller already exists: {email}")

            SellerProfile.objects.update_or_create(
                user=seller,
                defaults={
                    'store_name': f"Store {i+1}",
                    'store_description': "High quality products at great prices.",
                    'location': "Dhaka, Bangladesh",
                    'website': f"https://store{i+1}.shobshopping.com"
                }
            )
            sellers.append(seller)

        # Buyers
        for i in range(5):
            email = f"buyer{i+1}@mail.com"
            buyer, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'name': f"Buyer {i+1}",
                    'role': "BUYER"
                }
            )
            if created:
                buyer.set_password("buyer123")
                buyer.save()
                self.stdout.write(f"✅ Buyer created: {email}")
            else:
                self.stdout.write(f"⚠️ Buyer already exists: {email}")

        # Create Categories
        category_names = ["Electronics", "Books", "Clothing", "Home & Kitchen"]
        categories = []
        for name in category_names:
            category, _ = Category.objects.get_or_create(name=name)
            categories.append(category)

        # Create Tags
        tag_names = ["Affordable", "Popular", "New Arrival", "Top Rated"]
        tags = []
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            tags.append(tag)

        # Dummy product attributes
        BADGES = ['TOP_SELLER', 'RECOMMENDED', 'HOT']
        LABELS = ['FREE_SHIPPING', 'LIMITED_STOCK', 'CASHBACK']

        self.stdout.write("📦 Creating products...")

        for seller in sellers:
            for i in range(10):
                product = Product.objects.create(
                    seller=seller,
                    name=f"{seller.name}'s Product {i+1}",
                    description="A quality product with excellent value.",
                    category=choice(categories),
                    price=round(uniform(100, 800), 2),
                    original_price=round(uniform(850, 1200), 2),
                    stock_quantity=randint(5, 50),
                    badge=choice(BADGES),
                    label=choice(LABELS),
                    status='ACTIVE',
                    moderation_status='APPROVED',
                    image='products/placeholder.jpg',
                    rating=round(uniform(3.5, 5.0), 2),
                    reviews=randint(10, 150),
                    recommended=choice([True, False])
                )

                # Assign 1–3 tags
                product.tags.set([choice(tags) for _ in range(randint(1, 3))])

        self.stdout.write(self.style.SUCCESS("🎉 Dummy users, seller profiles, and products created successfully."))
