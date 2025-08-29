from rest_framework import serializers
from .models import Product, Category, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'subcategories']

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), source='tags', write_only=True
    )

    seller = serializers.StringRelatedField(read_only=True)  # shows seller email/name

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description',
            'price', 'original_price', 'stock_quantity',
            'badge', 'label',
            'recommended', 'image',
            'status', 'moderation_status',
            'rating', 'reviews',
            'category', 'category_id',
            'tags', 'tag_ids',
            'seller',
            'created_at',
        ]
        read_only_fields = [
            'rating',
            'reviews',
            'seller',
            'created_at',
        ]


    def create(self, validated_data):
        import base64
        import uuid
        from django.core.files.base import ContentFile
        import logging
        request = self.context.get('request')
        base64_image = request.data.get('image_base64')
        if base64_image:
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]
            try:
                decoded_img = base64.b64decode(base64_image)
                filename = f"{uuid.uuid4().hex}.png"
                # No need to manually create directory
                validated_data['image'] = ContentFile(decoded_img, name=filename)
            except Exception as e:
                logging.error(f"Image upload error: {e}")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        import base64
        import uuid
        from django.core.files.base import ContentFile
        import os
        import logging
        request = self.context.get('request')
        base64_image = request.data.get('image_base64')
        if base64_image:
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]
            try:
                decoded_img = base64.b64decode(base64_image)
                filename = f"{uuid.uuid4().hex}.png"
                products_dir = os.path.join('media', 'products')
                abs_products_dir = os.path.join(os.path.dirname(__file__), '../media/products')
                abs_products_dir = os.path.abspath(abs_products_dir)
                if not os.path.exists(abs_products_dir):
                    os.makedirs(abs_products_dir)
                instance.image = ContentFile(decoded_img, name=filename)
            except Exception as e:
                logging.error(f"Image upload error: {e}")
        return super().update(instance, validated_data)
