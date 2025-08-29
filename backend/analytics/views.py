# analytics/views.py
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from orders.models import Order
from products.models import Product
from accounts.models import CustomUser

@staff_member_required
def admin_dashboard(request):
    total_orders = Order.objects.count()
    total_users = CustomUser.objects.count()
    total_products = Product.objects.count()
    pending_products = Product.objects.filter(moderation_status='IN_REVIEW').count()

    context = {
        'total_orders': total_orders,
        'total_users': total_users,
        'total_products': total_products,
        'pending_products': pending_products,
    }
    return render(request, 'admin/analytics_dashboard.html', context)
