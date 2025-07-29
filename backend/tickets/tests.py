from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser
from orders.models import Order
from tickets.models import Ticket, TicketMessage



class SupportTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.buyer = CustomUser.objects.create_user(email='buyer@test.com', password='pass1234', role='BUYER')
        self.admin = CustomUser.objects.create_user(email='admin@test.com', password='admin1234', role='ADMIN', is_staff=True)

        self.order = Order.objects.create(user=self.buyer)
        self.ticket = Ticket.objects.create(
            user=self.buyer,
            order=self.order,
            subject="Need to change address",
            type="CHANGE"
        )
        self.message = TicketMessage.objects.create(
            ticket=self.ticket,
            sender=self.buyer,
            message="Please change delivery address to XYZ."
        )

    def test_buyer_can_create_ticket(self):
        self.client.force_authenticate(user=self.buyer)
        url = reverse('ticket-list')
        payload = {
            "order": self.order.id,
            "subject": "Item not received",
            "type": "ISSUE",
            "messages": [
                {"message": "Still not delivered after 7 days."}
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_respond_to_ticket(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('ticketmessage-list')
        payload = {
            "ticket": self.ticket.id,
            "message": "We are looking into this."
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_ticket_list_authenticated_buyer(self):
        self.client.force_authenticate(user=self.buyer)
        url = reverse('ticket-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
