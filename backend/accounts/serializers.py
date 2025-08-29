from rest_framework import serializers
from .models import Product, Category, Tag
import base64, uuid
from django.core.files.base import ContentFile


# --- Tag Serializer ---
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


# --- Category Serializer ---
class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'subcategories']

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data


# --- Custom Base64 Image Field ---
class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith("data:image"):
            # case: "data:image/png;base64,...."
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name=f"{uuid.uuid4().hex}.{ext}")
        elif isinstance(data, str):
            # case: raw base64 without header
            data = ContentFile(base64.b64decode(data), name=f"{uuid.uuid4().hex}.png")
        return super().to_internal_value(data)


# --- Product Serializer ---
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), source='tags', write_only=True
    )

    seller = serializers.StringRelatedField(read_only=True)
    image = Base64ImageField(required=False, allow_null=True)  # ✅ clean base64 support

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
        read_only_fields = ['rating', 'reviews', 'seller', 'created_at']
