# orders/tests.py

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from accounts.models import CustomUser
from products.models import Product
from .models import Order


class OrderTests(APITestCase):
    def setUp(self):
        # Create a test buyer user
        self.buyer = CustomUser.objects.create_user(
            email="buyer@example.com", password="testpass", role="BUYER"
        )

        # Authenticate as that user
        self.client.force_authenticate(user=self.buyer)

        # Create a sample product (seller can be buyer for simplicity here)
        self.product = Product.objects.create(
            name="Test Product",
            price=100.00,
            stock_quantity=10,
            seller=self.buyer,
        )

    def test_place_order(self):
        url = reverse("orders-list")
        payload = {
            "items": [
                {
                    "product_id": self.product.id,
                    "quantity": 2
                }
            ]
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "PENDING")
        self.assertEqual(len(response.data["items"]), 1)

    def test_get_order_list(self):
        Order.objects.create(user=self.buyer)
        url = reverse("orders-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_cancel_replace_refund_flags(self):
        order = Order.objects.create(user=self.buyer)
        url = reverse("orders-detail", kwargs={"pk": order.id})
        payload = {
            "cancel_requested": True,
            "replace_requested": True,
            "refund_requested": True
        }
        response = self.client.patch(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertTrue(order.cancel_requested)
        self.assertTrue(order.replace_requested)
        self.assertTrue(order.refund_requested)
