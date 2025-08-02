from django.contrib import admin
from django.urls import path, include
from backend.swagger import schema_view
from rest_framework.permissions import AllowAny

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('products.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('orders.urls')),
    path('api/support/', include('tickets.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/qna/', include('qna.urls')),
    path('api/', include('coupons.urls')),

    # ✅ Swagger & Redoc docs
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
