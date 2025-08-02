# qna/tests.py

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import CustomUser
from products.models import Product
from qna.models import Question, Answer

class QnATests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_user(
            email='admin@example.com',
            password='adminpass',
            is_staff=True
        )
        self.buyer = CustomUser.objects.create_user(
            email='buyer@example.com',
            password='buyerpass'
        )
        self.seller = CustomUser.objects.create_user(
            email='seller@example.com',
            password='sellerpass'
        )
        self.product = Product.objects.create(
            name='Test Product',
            price=100.0,
            stock_quantity=5,
            seller=self.seller
        )
        self.question_url = reverse('question-list')  # ✅ corrected
        self.answer_url = reverse('answer-list')      # ✅ confirmed valid

    def test_create_question(self):
        self.client.force_authenticate(user=self.buyer)
        data = {
            'product': self.product.id,
            'question': 'Does it come with warranty?'  # ✅ matches model field name
        }
        response = self.client.post(self.question_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Question.objects.count(), 1)

    def test_create_answer_by_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        question = Question.objects.create(
            user=self.buyer,
            product=self.product,
            question='Is this returnable?'  # ✅ matches model field name
        )
        data = {
            'question': question.id,
            'answer': 'Yes, within 7 days.'  # ✅ matches model field name
        }
        response = self.client.post(self.answer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Answer.objects.count(), 1)
        self.assertEqual(Answer.objects.first().answer, 'Yes, within 7 days.')

    def test_only_admin_can_answer(self):
        self.client.force_authenticate(user=self.buyer)
        question = Question.objects.create(
            user=self.buyer,
            product=self.product,
            question='What is the return policy?'  # ✅
        )
        data = {
            'question': question.id,
            'answer': '7 days return window.'
        }
        response = self.client.post(self.answer_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fetch_qna_for_product(self):
        question = Question.objects.create(
            user=self.buyer,
            product=self.product,
            question='Does it support fast charging?'
        )
        Answer.objects.create(
            question=question,
            answer='Yes it does!',
            answered_by=self.admin_user
        )
        url = reverse('product-qna', args=[self.product.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['question'], 'Does it support fast charging?')
