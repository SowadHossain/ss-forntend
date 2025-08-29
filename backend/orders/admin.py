from django.contrib import admin
from .models import Order, OrderItem
from django.utils.html import format_html


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_email', 'status', 'payment_status', 'cancel_requested',
        'replace_requested', 'refund_requested', 'created_at', 'updated_at'
    )
    list_filter = ('status', 'payment_status', 'cancel_requested', 'replace_requested', 'refund_requested')
    search_fields = ('user__email', 'shipping_address', 'notes')
    readonly_fields = ('created_at', 'updated_at', 'user_email', 'special_requests')
    fieldsets = (
        (None, {
            'fields': (
                'user_email', 'status', 'payment_status',
                'shipping_address', 'notes', 'special_requests',
                'created_at', 'updated_at'
            )
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User Email"

    def special_requests(self, obj):
        flags = []
        if obj.cancel_requested:
            flags.append("❌ Cancel")
        if obj.replace_requested:
            flags.append("♻ Replace")
        if obj.refund_requested:
            flags.append("💸 Refund")
        return ", ".join(flags) if flags else "—"
    special_requests.short_description = "Special Requests"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'quantity', 'price_at_purchase')
    list_filter = ('order__status',)
    search_fields = ('order__id', 'product__name')
    autocomplete_fields = ('product', 'order')

    def product_name(self, obj):
        return obj.product.name if obj.product else "Deleted Product"
    product_name.short_description = "Product"