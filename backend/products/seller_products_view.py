from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from products.serializers import ProductSerializer

class SellerProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        products = Product.objects.filter(seller=user).order_by('-created_at')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
