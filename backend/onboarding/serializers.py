from rest_framework import serializers
from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = '__all__'
        read_only_fields = ['status', 'submitted_at', 'reviewed_at', 'review_notes', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        return SellerApplication.objects.create(user=user, **validated_data)
