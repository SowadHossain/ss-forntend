from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from accounts.models import SellerProfile, CustomUser
from products.models import Product
from django.db.models import Avg, Sum, Count

class PublicSellerInfoView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, seller_id):
        try:
            seller = CustomUser.objects.get(id=seller_id, role='SELLER')
            profile = seller.seller_profile
        except (CustomUser.DoesNotExist, SellerProfile.DoesNotExist):
            return Response({'detail': 'Seller not found.'}, status=404)

        # Calculate rating and sales
        products = Product.objects.filter(seller=seller)
        avg_rating = products.aggregate(avg=Avg('rating'))['avg'] or 0.0
        total_sales = products.aggregate(sales=Sum('reviews'))['sales'] or 0

        data = {
            'seller_name': profile.store_name,
            'rating': round(avg_rating, 2),
            'sales': total_sales,
            'image': request.build_absolute_uri(profile.logo.url) if profile.logo else None,
        }
        return Response(data)
