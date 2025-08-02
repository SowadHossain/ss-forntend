from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils.timezone import now, timedelta
from accounts.models import CustomUser
from coupons.models import Coupon, CouponUsage

class CouponTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)

        self.valid_coupon = Coupon.objects.create(
            code='SAVE10',
            discount_percent=10,
            usage_limit=5,
            expiry_date=now().date() + timedelta(days=10)
        )

        self.expired_coupon = Coupon.objects.create(
            code='OLD10',
            discount_percent=10,
            usage_limit=5,
            expiry_date=now().date() - timedelta(days=1)
        )

        self.url = reverse("coupons-apply")

    def test_valid_coupon_applies(self):
        response = self.client.post(self.url, {'code': 'SAVE10'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['discount_percent'], 10)

    def test_invalid_coupon_code(self):
        response = self.client.post(self.url, {'code': 'INVALID'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_expired_coupon_rejected(self):
        response = self.client.post(self.url, {'code': 'OLD10'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['error'].lower())

    def test_coupon_usage_limit(self):
        # Use up the limit
        for i in range(self.valid_coupon.usage_limit):
            user = CustomUser.objects.create_user(email=f'user{i}@test.com', password='1234')
            CouponUsage.objects.create(user=user, coupon=self.valid_coupon)

        response = self.client.post(self.url, {'code': 'SAVE10'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('usage limit', response.data['error'].lower())
