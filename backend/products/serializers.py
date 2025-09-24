from rest_framework import serializers
from .models import Product, Category, Tag, ProductMedia
from reviews.models import Review


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
    subcategories_count = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'parent_name', 'subcategories', 'subcategories_count', 'products_count']

    def get_subcategories(self, obj):
        # Only include subcategories if specifically requested to avoid infinite recursion
        request = self.context.get('request')
        include_subcategories = request and request.query_params.get('include_subcategories', 'false').lower() == 'true'
        
        if include_subcategories:
            return CategorySerializer(obj.subcategories.all(), many=True, context=self.context).data
        return []

    def get_subcategories_count(self, obj):
        return obj.subcategories.count()

    def get_products_count(self, obj):
        return obj.product_set.count()


class ProductMediaSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductMedia
        fields = ['id', 'media_type', 'file_path', 'url', 'order', 'media_url']

    def validate(self, data):
        """Validate that either file_path or url is provided based on media_type"""
        media_type = data.get('media_type')
        file_path = data.get('file_path')
        url = data.get('url')

        if media_type == 'IMAGE':
            if not file_path:
                raise serializers.ValidationError("file_path is required for IMAGE media type")
            if url:
                raise serializers.ValidationError("url should not be provided for IMAGE media type")
        elif media_type == 'VIDEO':
            if not url:
                raise serializers.ValidationError("url is required for VIDEO media type")
            if file_path:
                raise serializers.ValidationError("file_path should not be provided for VIDEO media type")
        else:
            raise serializers.ValidationError("media_type must be either 'IMAGE' or 'VIDEO'")

        return data

    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.media_type == 'IMAGE' and obj.file_path:
            if request:
                return request.build_absolute_uri(f'/media/{obj.file_path}')
            return f'/media/{obj.file_path}'
        elif obj.media_type == 'VIDEO' and obj.url:
            return obj.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), source='tags', write_only=True, required=False
    )

    seller = serializers.StringRelatedField(read_only=True)  # shows seller email/name

    # Keep original image field for backward compatibility
    image = Base64ImageField(required=False, allow_null=True)
    image_base64 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    # New fields for multiple media
    media = ProductMediaSerializer(many=True, read_only=True)
    images = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False, allow_empty=True
    )
    video_links = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False, allow_empty=True
    )

    # Calculated fields for reviews
    average_rating = serializers.SerializerMethodField(read_only=True)
    review_count = serializers.SerializerMethodField(read_only=True)
    latest_reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description',
            'price', 'original_price', 'stock_quantity',
            'badge', 'label',
            'recommended', 'image', 'image_base64', 'image_url',
            'status', 'moderation_status',
            'rating', 'reviews',  # Static fields (updated by signals)
            'average_rating', 'review_count', 'latest_reviews',  # Calculated review fields
            'category', 'category_id',
            'tags', 'tag_ids',
            'seller',
            'created_at',
            'media', 'images', 'video_links',  # New fields
        ]
        read_only_fields = [
            'rating',  # Updated by signals
            'reviews',  # Updated by signals
            'average_rating',
            'review_count', 
            'latest_reviews',
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
        
        # Extract media data before creating product
        images_data = validated_data.pop('images', [])
        video_links_data = validated_data.pop('video_links', [])
        
        # Handle original image field for backward compatibility
        if request:
            self._handle_image_input(request, validated_data)
        
        # Create the product
        product = super().create(validated_data)
        
        # Validate product was created successfully
        if not product or not product.pk:
            raise serializers.ValidationError("Failed to create product")
        
        # Process multiple images and videos only after successful product creation
        try:
            self._process_base64_images(product, images_data)
            self._process_video_links(product, video_links_data)
        except Exception as e:
            import logging
            logging.error(f"Error processing media for product {product.id}: {e}")
            # Don't fail the product creation if media processing fails
        
        return product

    def update(self, instance, validated_data):
        request = self.context.get('request')
        
        # Validate instance exists
        if not instance or not instance.pk:
            raise serializers.ValidationError("Invalid product instance")
        
        # Extract media data before updating product
        images_data = validated_data.pop('images', None)
        video_links_data = validated_data.pop('video_links', None)
        
        # Handle original image field for backward compatibility
        if request:
            self._handle_image_input(request, validated_data)
        
        # Update the product
        product = super().update(instance, validated_data)
        
        # If new media is provided, replace existing media
        if images_data is not None or video_links_data is not None:
            try:
                # Delete existing media
                ProductMedia.objects.filter(product=product).delete()
                
                # Add new media
                if images_data:
                    self._process_base64_images(product, images_data)
                if video_links_data:
                    self._process_video_links(product, video_links_data)
            except Exception as e:
                import logging
                logging.error(f"Error updating media for product {product.id}: {e}")
                # Don't fail the product update if media processing fails
        
        return product

    def get_image_url(self, obj):
        request = self.context.get('request')
        if not getattr(obj, 'image', None):
            return None
        try:
            url = obj.image.url
        except Exception:
            return None
        return request.build_absolute_uri(url) if request else url

    def _process_base64_images(self, product, images_data):
        """Process array of base64 images and create ProductMedia instances"""
        import base64
        import uuid
        import os
        import logging
        from django.conf import settings
        from django.core.files.base import ContentFile
        from PIL import Image
        from io import BytesIO

        if not images_data:
            return

        # Validate product exists and is not None
        if not product or not hasattr(product, 'id'):
            logging.error("Invalid product instance provided for media processing")
            return

        # Ensure directory exists
        try:
            os.makedirs(os.path.join(settings.MEDIA_ROOT, 'product'), exist_ok=True)
        except Exception as e:
            logging.error(f"Failed to create media directory: {e}")
            return

        successful_images = 0
        for index, base64_image in enumerate(images_data):
            try:
                # Validate base64 string
                if not base64_image or not isinstance(base64_image, str):
                    logging.warning(f"Invalid base64 image data at index {index}")
                    continue

                # Strip data URI prefix if present
                if ',' in base64_image:
                    base64_image = base64_image.split(',', 1)[1]
                
                decoded_file = base64.b64decode(base64_image)
                
                # Convert to PNG using Pillow
                with Image.open(BytesIO(decoded_file)) as img:
                    if img.mode not in ("RGB", "RGBA"):
                        img = img.convert("RGB")
                    output = BytesIO()
                    img.save(output, format='PNG')
                    output.seek(0)
                    png_bytes = output.read()

                filename = f"{uuid.uuid4().hex}.png"
                file_path = f"product/{filename}"
                
                # Save the file
                full_path = os.path.join(settings.MEDIA_ROOT, file_path)
                with open(full_path, 'wb') as f:
                    f.write(png_bytes)

                # Create ProductMedia instance with explicit validation
                try:
                    ProductMedia.objects.create(
                        product=product,
                        media_type='IMAGE',
                        file_path=file_path,
                        order=index
                    )
                    successful_images += 1
                except Exception as db_error:
                    # Clean up the file if database operation fails
                    try:
                        os.remove(full_path)
                    except:
                        pass
                    logging.error(f"Failed to create ProductMedia for image {index}: {db_error}")
                    continue

            except Exception as e:
                logging.error(f"Error processing image {index}: {e}")
                continue

        logging.info(f"Successfully processed {successful_images}/{len(images_data)} images for product {product.id}")

    def _process_video_links(self, product, video_links_data):
        """Process array of video URLs and create ProductMedia instances"""
        import logging
        
        if not video_links_data:
            return

        # Validate product exists and is not None
        if not product or not hasattr(product, 'id'):
            logging.error("Invalid product instance provided for video processing")
            return

        successful_videos = 0
        for index, video_url in enumerate(video_links_data):
            try:
                # Validate URL format
                if not video_url or not isinstance(video_url, str):
                    logging.warning(f"Invalid video URL at index {index}")
                    continue

                # Basic URL validation
                if not video_url.startswith(('http://', 'https://')):
                    logging.warning(f"Invalid video URL format at index {index}: {video_url}")
                    continue

                # Additional URL validation using Django's URLField validator
                from django.core.validators import URLValidator
                from django.core.exceptions import ValidationError
                
                url_validator = URLValidator()
                try:
                    url_validator(video_url)
                except ValidationError:
                    logging.warning(f"Invalid video URL format at index {index}: {video_url}")
                    continue

                ProductMedia.objects.create(
                    product=product,
                    media_type='VIDEO',
                    url=video_url,
                    order=index
                )
                successful_videos += 1
            except Exception as e:
                logging.error(f"Error processing video link {index} ({video_url}): {e}")
                continue

        logging.info(f"Successfully processed {successful_videos}/{len(video_links_data)} videos for product {product.id}")

    def get_average_rating(self, obj):
        """Calculate the average rating from all approved reviews for this product"""
        from django.db.models import Avg
        
        approved_reviews = Review.objects.filter(product=obj, approved=True)
        if approved_reviews.exists():
            avg_rating = approved_reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
            return round(float(avg_rating), 2) if avg_rating else 0.0
        return 0.0

    def get_review_count(self, obj):
        """Get the total count of approved reviews for this product"""
        return Review.objects.filter(product=obj, approved=True).count()

    def get_latest_reviews(self, obj):
        """Get the latest 3 approved reviews for this product"""
        from reviews.serializers import ReviewSerializer
        
        latest_reviews = Review.objects.filter(
            product=obj, 
            approved=True
        ).select_related('user').order_by('-created_at')[:3]
        
        # Use a simple serializer to avoid circular imports
        reviews_data = []
        for review in latest_reviews:
            reviews_data.append({
                'id': review.id,
                'user': str(review.user),
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at,
            })
        
        return reviews_data
