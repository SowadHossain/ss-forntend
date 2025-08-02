from rest_framework import serializers
from .models import Ticket, TicketMessage
from accounts.models import CustomUser
from orders.models import Order


class TicketMessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'sender', 'message', 'attachment', 'sent_at']
        read_only_fields = ['sender', 'sent_at']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class TicketSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    assigned_to = serializers.StringRelatedField(read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)

    # Allows client to POST 'order_id', stores to the FK 'order'
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
        source='order',
        write_only=True,
        required=False
    )

    class Meta:
        model = Ticket
        fields = [
            'id', 'user', 'order', 'order_id', 'subject', 'type', 'status',
            'assigned_to', 'created_at', 'resolved_at', 'messages'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'assigned_to', 'created_at', 'resolved_at', 'messages'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
