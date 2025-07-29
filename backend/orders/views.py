from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Order
from .serializers import OrderSerializer
from accounts.permissions import IsBuyer, IsAdmin


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_cancel(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user:
            return Response({'detail': 'Unauthorized'}, status=403)
        order.cancel_requested = True
        order.save()
        return Response({'detail': 'Cancel request submitted.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_replace(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user:
            return Response({'detail': 'Unauthorized'}, status=403)
        order.replace_requested = True
        order.save()
        return Response({'detail': 'Replace request submitted.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_refund(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user:
            return Response({'detail': 'Unauthorized'}, status=403)
        order.refund_requested = True
        order.save()
        return Response({'detail': 'Refund request submitted.'})
