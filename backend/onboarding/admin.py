from django.contrib import admin
from .models import SellerApplication
from django.utils.html import format_html


@admin.register(SellerApplication)
class SellerApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'business_name', 'status', 'submitted_at', 'reviewed_at')
    list_filter = ('status', 'submitted_at')
    readonly_fields = ('user', 'submitted_at', 'reviewed_at', 'review_notes')
    search_fields = ('user__email', 'business_name', 'nid_number')

    fieldsets = (
        (None, {
            'fields': (
                'user',
                'business_name',
                'nid_number',
                'photo_preview',
                'nid_front_preview',
                'nid_back_preview',
                'tax_token_preview',
                'trade_license_preview',
                'status',
                'review_notes',
                'submitted_at',
                'reviewed_at',
            )
        }),
    )

    def photo_preview(self, obj):
        return self._img(obj.photo)
    photo_preview.short_description = "Photo"

    def nid_front_preview(self, obj):
        return self._img(obj.nid_front)
    nid_front_preview.short_description = "NID Front"

    def nid_back_preview(self, obj):
        return self._img(obj.nid_back)
    nid_back_preview.short_description = "NID Back"

    def tax_token_preview(self, obj):
        return self._img(obj.tax_token)
    tax_token_preview.short_description = "Tax Token"

    def trade_license_preview(self, obj):
        return self._img(obj.trade_license)
    trade_license_preview.short_description = "Trade License"

    def _img(self, image_field):
        if image_field and hasattr(image_field, 'url'):
            return format_html(f'<img src="{image_field.url}" style="max-height: 200px; max-width: 100%;" />')
        return "No file uploaded"

    actions = ['approve_applications', 'reject_applications']

    def approve_applications(self, request, queryset):
        updated = queryset.update(status='APPROVED')
        self.message_user(request, f"{updated} application(s) approved.")
    approve_applications.short_description = "✅ Approve selected applications"

    def reject_applications(self, request, queryset):
        updated = queryset.update(status='REJECTED')
        self.message_user(request, f"{updated} application(s) rejected.")
    reject_applications.short_description = "❌ Reject selected applications"
