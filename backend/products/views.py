from rest_framework import viewsets, permissions, filters
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
        user = self.request.user

        if not user.is_authenticated:
            return Product.objects.filter(
                moderation_status='APPROVED',
                status='ACTIVE'
            ).order_by('-created_at')

        if user.role == 'ADMIN':
            return Product.objects.all().order_by('-created_at')

        if user.role == 'SELLER':
            return Product.objects.filter(seller=user).order_by('-created_at')

        return Product.objects.filter(
            moderation_status='APPROVED',
            status='ACTIVE'
        ).order_by('-created_at')

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


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdmin]
