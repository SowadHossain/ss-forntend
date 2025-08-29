from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import SellerApplication
from .serializers import SellerApplicationSerializer


class SellerApplicationViewSet(viewsets.ModelViewSet):
    queryset = SellerApplication.objects.all()
    serializer_class = SellerApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', None) == 'ADMIN':
            return SellerApplication.objects.all()
        return SellerApplication.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        app = self.get_object()
        app.status = 'APPROVED'
        app.reviewed_at = timezone.now()
        app.review_notes = request.data.get('review_notes', '')
        app.save()
        return Response({'detail': 'Application approved.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        app = self.get_object()
        app.status = 'REJECTED'
        app.reviewed_at = timezone.now()
        app.review_notes = request.data.get('review_notes', '')
        app.save()
        return Response({'detail': 'Application rejected.'}, status=status.HTTP_200_OK)
