from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'price_at_purchase']
        read_only_fields = ['price_at_purchase', 'product_name']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'payment_status',
            'shipping_address', 'notes',
            'cancel_requested', 'replace_requested', 'refund_requested',
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['status', 'payment_status', 'created_at', 'updated_at', 'user']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        validated_data.pop('user', None)
        order = Order.objects.create(user=self.context['request'].user, **validated_data)

        for item_data in items_data:
            product = item_data.get('product')
            quantity = item_data.get('quantity', 1)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_at_purchase=product.price
            )
            product.stock_quantity -= quantity
            product.save()

        return order
