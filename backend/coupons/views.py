from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Coupon, CouponUsage
from .serializers import CouponSerializer, CouponUsageSerializer
from django.utils.timezone import now

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAdminUser()]
        return []

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Coupon code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code'}, status=status.HTTP_404_NOT_FOUND)

        if coupon.expiry_date < now().date():
            return Response({'error': 'Coupon has expired'}, status=status.HTTP_400_BAD_REQUEST)

        usage_count = CouponUsage.objects.filter(coupon=coupon).count()
        if usage_count >= coupon.usage_limit:
            return Response({'error': 'Coupon usage limit reached'}, status=status.HTTP_400_BAD_REQUEST)

        already_used = CouponUsage.objects.filter(coupon=coupon, user=request.user).exists()
        if already_used:
            return Response({'error': 'You have already used this coupon'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark as used
        CouponUsage.objects.create(user=request.user, coupon=coupon)
        return Response({'message': 'Coupon applied', 'discount_percent': coupon.discount_percent})
