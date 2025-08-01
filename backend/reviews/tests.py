from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import CustomUser
from products.models import Product
from reviews.models import Review

class ReviewTests(APITestCase):
    def setUp(self):
        self.seller = CustomUser.objects.create_user(
            email='seller@example.com',
            password='sellerpass'
        )
        self.user = CustomUser.objects.create_user(
            email='buyer@example.com',
            password='testpass'
        )
        self.product = Product.objects.create(
            name='Test Product',
            price=100.0,
            stock_quantity=10,
            seller=self.seller
        )
        self.client.force_authenticate(user=self.user)

    def test_create_review(self):
        url = reverse('review-list')
        data = {
            'product': self.product.id,
            'rating': 4,
            'comment': 'Nice product'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_duplicate_review_not_allowed(self):
        Review.objects.create(user=self.user, product=self.product, rating=4, comment='Great!')
        url = reverse('review-list')
        data = {
            'product': self.product.id,
            'rating': 5,
            'comment': 'Changed my mind'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_review(self):
        review = Review.objects.create(user=self.user, product=self.product, rating=3, comment='Okay')
        url = reverse('review-detail', args=[review.id])
        data = {
            'product': self.product.id,  # ✅ Must include product for validation
            'rating': 5,
            'comment': 'Updated comment'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        review.refresh_from_db()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Updated comment')

    def test_delete_review(self):
        review = Review.objects.create(user=self.user, product=self.product, rating=2, comment='Bad')
        url = reverse('review-detail', args=[review.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Review.objects.count(), 0)
