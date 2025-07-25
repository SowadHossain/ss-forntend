from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, TagViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('products', ProductViewSet, basename='products')
router.register('categories', CategoryViewSet, basename='categories')
router.register('tags', TagViewSet, basename='tags')

urlpatterns = [
    path('', include(router.urls)),
]
