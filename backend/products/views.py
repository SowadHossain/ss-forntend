from rest_framework import viewsets, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Product, Category, Tag, ProductMedia
from .serializers import ProductSerializer, CategorySerializer, TagSerializer, ProductMediaSerializer
from accounts.permissions import IsSeller, IsAdmin, IsSuperAdmin


class PublicApprovedProductsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        products = Product.objects.filter(moderation_status='APPROVED', status='ACTIVE').order_by('-created_at')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Product, Category, Tag
from .serializers import ProductSerializer, CategorySerializer, TagSerializer
from accounts.permissions import IsSeller, IsAdmin


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        'category',
        'badge',
        'label',
        'status',
        'moderation_status',
        'recommended',
        'tags'
    ]
    search_fields = ['name', 'description']

    def get_queryset(self):
        return Product.objects.filter(moderation_status='APPROVED', status='ACTIVE').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user, moderation_status='IN_REVIEW')

    def perform_update(self, serializer):
        product = self.get_object()
        user = self.request.user

        if user.role == 'SELLER' and product.seller == user:
            # Sellers cannot approve; reset moderation on update
            serializer.save(moderation_status='IN_REVIEW')
        elif user.role == 'ADMIN':
            # Admin can approve or reject
            serializer.save()
        else:
            self.permission_denied(self.request, message="Unauthorized update attempt.")

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def media(self, request, pk=None):
        """Get all media (images and videos) for a specific product"""
        try:
            product = self.get_object()
            media_objects = ProductMedia.objects.filter(product=product).order_by('order', 'created_at')
            serializer = ProductMediaSerializer(media_objects, many=True, context={'request': request})
            return Response({
                'product_id': product.id,
                'product_name': product.name,
                'media_count': media_objects.count(),
                'media': serializer.data
            })
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_media(self, request, pk=None):
        """Add media (images and videos) to an existing product"""
        try:
            product = self.get_object()
            
            # Check if user owns this product (if seller) or is admin
            user = request.user
            if user.role == 'SELLER' and product.seller != user:
                return Response({'error': 'You can only add media to your own products'}, status=403)
            elif user.role not in ['SELLER', 'ADMIN']:
                return Response({'error': 'Permission denied'}, status=403)
            
            # Extract media data
            images_data = request.data.get('images', [])
            video_links_data = request.data.get('video_links', [])
            
            if not images_data and not video_links_data:
                return Response({'error': 'No images or video links provided'}, status=400)
            
            # Use the serializer's media processing methods
            serializer = ProductSerializer(context={'request': request})
            
            try:
                if images_data:
                    serializer._process_base64_images(product, images_data)
                if video_links_data:
                    serializer._process_video_links(product, video_links_data)
                
                # Return updated media
                media_objects = ProductMedia.objects.filter(product=product).order_by('order', 'created_at')
                media_serializer = ProductMediaSerializer(media_objects, many=True, context={'request': request})
                
                return Response({
                    'success': True,
                    'message': 'Media added successfully',
                    'product_id': product.id,
                    'media_count': media_objects.count(),
                    'media': media_serializer.data
                })
                
            except Exception as e:
                import logging
                logging.error(f"Error adding media to product {product.id}: {e}")
                return Response({'error': 'Failed to process media'}, status=500)
                
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

    @action(detail=True, methods=['delete'], permission_classes=[permissions.IsAuthenticated])
    def clear_media(self, request, pk=None):
        """Clear all media for a product"""
        try:
            product = self.get_object()
            
            # Check permissions
            user = request.user
            if user.role == 'SELLER' and product.seller != user:
                return Response({'error': 'You can only modify your own products'}, status=403)
            elif user.role not in ['SELLER', 'ADMIN']:
                return Response({'error': 'Permission denied'}, status=403)
            
            # Delete all media and associated files
            media_objects = ProductMedia.objects.filter(product=product)
            deleted_count = 0
            
            for media in media_objects:
                if media.media_type == 'IMAGE' and media.file_path:
                    # Delete the actual file
                    import os
                    from django.conf import settings
                    file_path = os.path.join(settings.MEDIA_ROOT, media.file_path)
                    try:
                        if os.path.exists(file_path):
                            os.remove(file_path)
                    except Exception:
                        pass
                deleted_count += 1
            
            media_objects.delete()
            
            return Response({
                'success': True,
                'message': f'Deleted {deleted_count} media items',
                'product_id': product.id
            })
            
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        """
        Allow anyone to view categories, but only super admins can modify them
        """
        if self.action in ['list', 'retrieve', 'subcategories']:
            # Anyone can view categories and subcategories
            permission_classes = [permissions.AllowAny]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only super admins can create, edit, or delete categories
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def subcategories(self, request, pk=None):
        """Get all subcategories for a specific category"""
        try:
            category = self.get_object()
            subcategories = category.subcategories.all()
            serializer = CategorySerializer(subcategories, many=True)
            return Response({
                'parent_category': {
                    'id': category.id,
                    'name': category.name
                },
                'subcategories_count': subcategories.count(),
                'subcategories': serializer.data
            })
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def tree(self, request):
        """Get all categories in a tree structure (parents with their subcategories)"""
        # Get only parent categories (those without a parent)
        parent_categories = Category.objects.filter(parent=None)
        result = []
        
        for parent in parent_categories:
            subcategories = parent.subcategories.all()
            result.append({
                'id': parent.id,
                'name': parent.name,
                'subcategories_count': subcategories.count(),
                'subcategories': CategorySerializer(subcategories, many=True).data
            })
        
        return Response({
            'total_parent_categories': len(result),
            'categories': result
        })
    
    def destroy(self, request, *args, **kwargs):
        """Custom delete method with additional checks"""
        category = self.get_object()
        
        # Check if category has subcategories
        if category.subcategories.exists():
            return Response({
                'error': 'Cannot delete category with subcategories. Delete subcategories first.'
            }, status=400)
        
        # Check if category has products
        if category.product_set.exists():
            return Response({
                'error': f'Cannot delete category. It has {category.product_set.count()} products assigned to it.'
            }, status=400)
        
        return super().destroy(request, *args, **kwargs)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
