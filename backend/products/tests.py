from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from products.models import Product, Category, Tag
from rest_framework_simplejwt.tokens import RefreshToken


class ProductTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Users
        self.buyer = CustomUser.objects.create_user(email="buyer@test.com", password="buyer123", name="Buyer", role="BUYER")
        self.seller = CustomUser.objects.create_user(email="seller@test.com", password="seller123", name="Seller", role="SELLER")
        self.admin = CustomUser.objects.create_superuser(email="admin@test.com", password="admin123", name="Admin")

        # Tokens
        self.buyer_token = str(RefreshToken.for_user(self.buyer).access_token)
        self.seller_token = str(RefreshToken.for_user(self.seller).access_token)
        self.admin_token = str(RefreshToken.for_user(self.admin).access_token)

        # Category & Tag
        self.category = Category.objects.create(name="Electronics")
        self.tag = Tag.objects.create(name="wireless")

    def test_seller_can_create_product(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.seller_token}")
        response = self.client.post("/api/products/", {
            "name": "Wireless Mouse",
            "description": "A nice wireless mouse",
            "price": "1500.00",
            "original_price": "2000.00",
            "stock_quantity": 10,
            "category_id": self.category.id,
            "tag_ids": [self.tag.id],
            "status": "ACTIVE"
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product = Product.objects.get(name="Wireless Mouse")
        self.assertEqual(product.moderation_status, "IN_REVIEW")
        self.assertEqual(product.seller, self.seller)

    def test_buyer_can_see_only_approved_products(self):
        Product.objects.create(
            name="Approved Product",
            price=500,
            stock_quantity=5,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="APPROVED"
        )
        Product.objects.create(
            name="Unapproved Product",
            price=1000,
            stock_quantity=3,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="IN_REVIEW"
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.buyer_token}")
        response = self.client.get("/api/products/")
        product_names = [p["name"] for p in response.data]
        self.assertIn("Approved Product", product_names)
        self.assertNotIn("Unapproved Product", product_names)

    def test_seller_update_resets_moderation_status(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.seller_token}")
        product = Product.objects.create(
            name="Seller Product",
            price=1000,
            stock_quantity=5,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="APPROVED"
        )
        response = self.client.patch(f"/api/products/{product.id}/", {
            "description": "Updated description"
        }, format="json")
        product.refresh_from_db()
        self.assertEqual(product.moderation_status, "IN_REVIEW")

    def test_admin_can_approve_product(self):
        product = Product.objects.create(
            name="Product To Approve",
            price=999,
            stock_quantity=4,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="IN_REVIEW"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client.patch(f"/api/products/{product.id}/", {
            "moderation_status": "APPROVED"
        }, format="json")
        product.refresh_from_db()
        self.assertEqual(product.moderation_status, "APPROVED")

    def test_search_and_filter(self):
        Product.objects.create(
            name="Gaming Headset",
            description="High-quality surround sound",
            price=4500,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="APPROVED"
        )
        Product.objects.create(
            name="Gaming Mouse",
            description="Ergonomic RGB mouse",
            price=2000,
            seller=self.seller,
            category=self.category,
            status="ACTIVE",
            moderation_status="APPROVED"
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.buyer_token}")
        response = self.client.get("/api/products/?search=mouse")
        product_names = [p["name"] for p in response.data]
        self.assertIn("Gaming Mouse", product_names)
        self.assertNotIn("Gaming Headset", product_names)
