from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from products.models import Product, Category
from cart.models import CartItem, WishlistItem
from rest_framework_simplejwt.tokens import RefreshToken


class CartAndWishlistTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # User
        self.user = CustomUser.objects.create_user(
            email="user@test.com",
            password="user123",
            name="Test User",
            role="BUYER"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        # Category + Product
        self.category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(
            name="Test Product",
            price=1000,
            stock_quantity=5,
            seller=CustomUser.objects.create_user(
                email="seller@test.com", password="seller123", role="SELLER", name="Seller"
            ),
            category=self.category,
            status="ACTIVE",
            moderation_status="APPROVED"
        )

    def test_add_to_cart(self):
        response = self.client.post("/api/cart/", {
            "product_id": self.product.id,
            "quantity": 2
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CartItem.objects.filter(user=self.user, product=self.product).exists())

    def test_update_cart_quantity(self):
        cart_item = CartItem.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.patch(f"/api/cart/{cart_item.id}/", {"quantity": 4})
        cart_item.refresh_from_db()
        self.assertEqual(cart_item.quantity, 4)

    def test_remove_from_cart(self):
        cart_item = CartItem.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.delete(f"/api/cart/{cart_item.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CartItem.objects.filter(id=cart_item.id).exists())

    def test_add_to_wishlist(self):
        response = self.client.post("/api/wishlist/", {
            "product_id": self.product.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(WishlistItem.objects.filter(user=self.user, product=self.product).exists())

    def test_move_wishlist_to_cart(self):
        WishlistItem.objects.create(user=self.user, product=self.product)
        wishlist_item = WishlistItem.objects.get(user=self.user, product=self.product)

        response = self.client.post(f"/api/wishlist/{wishlist_item.id}/move_to_cart/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(CartItem.objects.filter(user=self.user, product=self.product).exists())
        self.assertFalse(WishlistItem.objects.filter(id=wishlist_item.id).exists())
