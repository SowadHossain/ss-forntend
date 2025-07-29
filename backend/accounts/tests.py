from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser, SellerProfile
from rest_framework_simplejwt.tokens import RefreshToken


class AccountsRouteTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a buyer
        self.buyer = CustomUser.objects.create_user(
            email="buyer@test.com",
            password="buyerpass123",
            name="Buyer User",
            role="BUYER"
        )

        # Create a seller and auto-create profile
        self.seller = CustomUser.objects.create_user(
            email="seller@test.com",
            password="sellerpass123",
            name="Seller User",
            role="SELLER"
        )
        SellerProfile.objects.create(user=self.seller, store_name="Test Store", location="Dhaka")

        # Generate JWT tokens
        self.buyer_token = str(RefreshToken.for_user(self.buyer).access_token)
        self.seller_token = str(RefreshToken.for_user(self.seller).access_token)

    def test_register_buyer(self):
        response = self.client.post("/api/auth/register/", {
            "email": "newbuyer@test.com",
            "password": "newbuyer123",
            "name": "New Buyer",
            "phone": "01700000000",
            "address": "Dhaka",
            "role": "BUYER"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(email="newbuyer@test.com").exists())

    def test_register_seller_creates_seller_profile(self):
        response = self.client.post("/api/auth/register/", {
            "email": "new_seller@test.com",
            "password": "newpass123",
            "name": "New Seller",
            "phone": "01800000000",
            "address": "CTG",
            "role": "SELLER"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = CustomUser.objects.get(email="new_seller@test.com")
        self.assertTrue(SellerProfile.objects.filter(user=user).exists())

    def test_login_returns_tokens(self):
        response = self.client.post("/api/auth/login/", {
            "email": "buyer@test.com",
            "password": "buyerpass123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_profile_get(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.buyer_token}")
        response = self.client.get("/api/auth/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "buyer@test.com")

    def test_profile_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.buyer_token}")
        response = self.client.put("/api/auth/profile/", {"name": "Updated Buyer"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.buyer.refresh_from_db()
        self.assertEqual(self.buyer.name, "Updated Buyer")

    def test_seller_profile_get(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.seller_token}")
        response = self.client.get("/api/auth/seller/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["store_name"], "Test Store")

    def test_seller_profile_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.seller_token}")
        response = self.client.put("/api/auth/seller/profile/", {
            "store_description": "Best store in Dhaka",
            "location": "Uttara"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.seller.seller_profile.refresh_from_db()
        self.assertEqual(self.seller.seller_profile.location, "Uttara")
        self.assertEqual(self.seller.seller_profile.store_description, "Best store in Dhaka")
