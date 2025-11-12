## backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import CustomUser, SellerProfile


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'role', 'is_active', 'is_staff', 'date_joined', 'status_badge')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'name', 'phone')
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined')
    actions = ['suspend_users', 'unsuspend_users']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone', 'address')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'role', 'is_active', 'is_staff')}
        ),
    )

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">Active</span>')
        else:
            return format_html('<span style="color: red;">Suspended</span>')
    status_badge.short_description = 'Status'

    def suspend_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} user(s) suspended.")

    def unsuspend_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} user(s) unsuspended.")

    suspend_users.short_description = "🚫 Suspend selected users"
    unsuspend_users.short_description = "✅ Unsuspend selected users"


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'location', 'created_at')
    search_fields = ('store_name', 'user__email', 'location')

