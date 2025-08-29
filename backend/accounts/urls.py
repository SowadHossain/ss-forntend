from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, SellerProfileView
from .public_seller_info import PublicSellerInfoView
from .public_all_sellers_info import PublicAllSellersInfoView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('seller/profile/', SellerProfileView.as_view(), name='seller_profile'),
    path('seller/public/<int:seller_id>/', PublicSellerInfoView.as_view(), name='public_seller_info'),
    path('seller/public/all/', PublicAllSellersInfoView.as_view(), name='public_all_sellers_info'),
]
