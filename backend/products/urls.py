from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, TagViewSet, PublicApprovedProductsView
from .seller_products_view import SellerProductsView
from django.urls import path, include

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
    path('seller/products/', SellerProductsView.as_view(), name='seller_products'),
    path('products/public/', PublicApprovedProductsView.as_view(), name='public_approved_products'),
]
