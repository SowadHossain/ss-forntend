# reviews/serializers.py

from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'product', 'product_name',
            'rating', 'comment', 'approved', 'created_at'
        ]
        read_only_fields = ['user', 'user_name', 'product_name', 'approved', 'created_at']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request else None

        # Pull product from data OR instance (for update)
        product = data.get('product')
        if not product and self.instance:
            product = self.instance.product

        if not product:
            raise serializers.ValidationError("Product is required.")

        # Allow one review per user-product, excluding self during update
        qs = Review.objects.filter(user=user, product=product)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("You have already reviewed this product.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('product', None)
        validated_data.pop('user', None)
        return super().update(instance, validated_data)
