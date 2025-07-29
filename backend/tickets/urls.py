from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TicketViewSet, TicketMessageViewSet

router = DefaultRouter()
router.register('tickets', TicketViewSet, basename='ticket')  
router.register('messages', TicketMessageViewSet, basename='ticketmessage')  

urlpatterns = [
    path('', include(router.urls)),
]
