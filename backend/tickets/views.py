from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.timezone import now
from .models import Ticket, TicketMessage
from .serializers import TicketSerializer, TicketMessageSerializer


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 🛡 Short-circuit Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Ticket.objects.none()

        user = self.request.user
        if hasattr(user, 'role') and user.role == 'ADMIN':
            return Ticket.objects.all().order_by('-created_at')
        return Ticket.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, ticket=ticket)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TicketMessageViewSet(viewsets.ModelViewSet):
    serializer_class = TicketMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return TicketMessage.objects.none()

        user = self.request.user
        if hasattr(user, 'role') and user.role == 'ADMIN':
            return TicketMessage.objects.all()
        return TicketMessage.objects.filter(sender=user)
