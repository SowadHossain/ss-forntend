from django.db import models
from accounts.models import CustomUser
from products.models import Product

class Question(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='questions')
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Answer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='answer')
    responder = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
