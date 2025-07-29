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
