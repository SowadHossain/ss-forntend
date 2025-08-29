from django.contrib import admin
from django.urls import path
from django.template.response import TemplateResponse
from orders.models import Order, OrderItem
from products.models import Product
from accounts.models import CustomUser
from django.db.models import Sum, Count
from django.utils.timezone import now, timedelta


class AnalyticsAdminView(admin.ModelAdmin):
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_site.admin_view(self.analytics_view), name='analytics-dashboard'),
        ]
        return custom_urls + urls

    def analytics_view(self, request):
        today = now().date()
        week_ago = today - timedelta(days=7)

        total_orders = Order.objects.count()
        total_revenue = OrderItem.objects.aggregate(total=Sum('price_at_purchase'))['total'] or 0

        top_products = (
            Product.objects
            .filter(orderitem__isnull=False)
            .annotate(order_count=Count('orderitem'))
            .order_by('-order_count')[:5]
        )

        buyers_count = CustomUser.objects.filter(role='BUYER').count()
        sellers_count = CustomUser.objects.filter(role='SELLER').count()

        recent_orders = Order.objects.filter(created_at__gte=week_ago).order_by('-created_at')

        context = dict(
            self.admin_site.each_context(request),
            total_orders=total_orders,
            total_revenue=total_revenue,
            top_products=top_products,
            buyers_count=buyers_count,
            sellers_count=sellers_count,
            recent_orders=recent_orders,
        )
        return TemplateResponse(request, "admin/analytics_dashboard.html", context)


# admin.site.register(CustomUser, AnalyticsAdminView)  # Hook view to a dummy model
