from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerApplicationViewSet

router = DefaultRouter()
router.register(r'seller-applications', SellerApplicationViewSet, basename='seller-application')

urlpatterns = [
    path('', include(router.urls)),
]
