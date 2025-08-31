from rest_framework import serializers
from .models import Product, Category, Tag


# Accept base64 strings for images as well as regular uploaded files
class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        # If the incoming "image" is a base64 string, decode and convert to PNG
        if isinstance(data, str):
            import base64
            import uuid
            import os
            from io import BytesIO
            from PIL import Image
            from django.conf import settings
            from django.core.files.base import ContentFile

            # Strip data URI scheme if provided
            if ',' in data:
                data = data.split(',', 1)[1]
            try:
                decoded_file = base64.b64decode(data)
            except Exception:
                raise serializers.ValidationError('Invalid image base64 data.')

            # Convert to PNG using Pillow
            try:
                with Image.open(BytesIO(decoded_file)) as img:
                    # Ensure in RGB (avoid palette/alpha mode issues)
                    if img.mode not in ("RGB", "RGBA"):
                        img = img.convert("RGB")
                    output = BytesIO()
                    img.save(output, format='PNG')
                    output.seek(0)
                    png_bytes = output.read()
            except Exception:
                raise serializers.ValidationError('Unable to process image.')

            # Ensure MEDIA_ROOT/product exists
            try:
                os.makedirs(os.path.join(settings.MEDIA_ROOT, 'product'), exist_ok=True)
            except Exception:
                pass

            filename = f"{uuid.uuid4().hex}.png"
            data = ContentFile(png_bytes, name=filename)

        return super().to_internal_value(data)


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

    # Allow either standard file upload or base64 string directly via "image"
    image = Base64ImageField(required=False, allow_null=True)
    # Also support a separate convenience field "image_base64"
    image_base64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description',
            'price', 'original_price', 'stock_quantity',
            'badge', 'label',
            'recommended', 'image', 'image_base64', 'image_url',
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

    def _handle_image_input(self, request, validated_data):
        """Accept multipart file or base64 string and attach to validated_data['image'].
        Ensures MEDIA_ROOT/product/ exists; ImageField will store under upload_to.
        """
        import base64
        import uuid
        import os
        from django.conf import settings
        from django.core.files.base import ContentFile
        import logging

        # Prefer multipart file
        uploaded_file = None
        if hasattr(request, 'FILES'):
            uploaded_file = request.FILES.get('image') or request.FILES.get('file')
        if uploaded_file:
            validated_data['image'] = uploaded_file
            return

        # Fallback: explicit serializer field or raw request.data
        base64_image = validated_data.pop('image_base64', None) or request.data.get('image_base64')
        if not base64_image:
            return

        # Ensure directory exists
        try:
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'product'), exist_ok=True)
        except Exception:
            # Don't block save if dir creation fails; storage may still handle it
            pass

        # Strip data URI prefix if present
        if ',' in base64_image:
            base64_image = base64_image.split(',', 1)[1]
        try:
            decoded_img = base64.b64decode(base64_image)
            filename = f"{uuid.uuid4().hex}.png"
            validated_data['image'] = ContentFile(decoded_img, name=filename)
        except Exception as e:
            logging.error(f"Image upload error: {e}")

    def create(self, validated_data):
        request = self.context.get('request')
        if request:
            self._handle_image_input(request, validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request:
            self._handle_image_input(request, validated_data)
        return super().update(instance, validated_data)

    def get_image_url(self, obj):
        request = self.context.get('request')
        if not getattr(obj, 'image', None):
            return None
        try:
            url = obj.image.url
        except Exception:
            return None
        return request.build_absolute_uri(url) if request else url
