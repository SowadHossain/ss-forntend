from rest_framework import serializers
from .models import Question, Answer

class AnswerSerializer(serializers.ModelSerializer):
    answered_by_name = serializers.CharField(source='answered_by.full_name', read_only=True)

    class Meta:
        model = Answer
        fields = ['id', 'question', 'answer', 'answered_by', 'answered_by_name', 'created_at']
        read_only_fields = ['answered_by', 'answered_by_name', 'created_at']
        

class QuestionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    answer = AnswerSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'user', 'user_name', 'product', 'product_name', 'question', 'created_at', 'answered', 'answer']
        read_only_fields = ['user', 'user_name', 'product_name', 'created_at', 'answered', 'answer']
