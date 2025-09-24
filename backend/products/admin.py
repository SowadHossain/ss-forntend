from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Category, Tag, ProductMedia


class ProductMediaInline(admin.TabularInline):
    model = ProductMedia
    extra = 0
    fields = ('media_type', 'file_path', 'url', 'order', 'media_preview')
    readonly_fields = ('media_preview',)

    def media_preview(self, obj):
        if obj.media_type == 'IMAGE' and obj.file_path:
            return format_html('<img src="/media/{}" width="100" height="100" />', obj.file_path)
        elif obj.media_type == 'VIDEO' and obj.url:
            return format_html('<a href="{}" target="_blank">🎥 Video Link</a>', obj.url)
        return "(No media)"
    media_preview.short_description = 'Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'seller', 'price', 'stock_quantity',
        'status', 'moderation_status_colored', 'created_at'
    )
    list_filter = ('status', 'moderation_status', 'badge', 'label', 'category')
    search_fields = ('name', 'seller__email')
    readonly_fields = ('created_at', 'seller', 'product_image')
    autocomplete_fields = ('category', 'tags')
    actions = ['approve_products', 'reject_products', 'activate_products', 'deactivate_products']
    inlines = [ProductMediaInline]

    fieldsets = (
        (None, {
            'fields': (
                'name', 'description', 'seller', 'category', 'tags',
                'price', 'original_price', 'stock_quantity',
                'badge', 'label',
                'status', 'moderation_status',
                'image', 'product_image',
                'recommended', 'rating', 'reviews',
                'created_at',
            )
        }),
    )

    def product_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" />', obj.image.url)
        return "(No image)"
    product_image.short_description = 'Image Preview'

    def moderation_status_colored(self, obj):
        color = {
            'APPROVED': 'green',
            'IN_REVIEW': 'orange',
            'REJECTED': 'red',
        }.get(obj.moderation_status, 'gray')
        return format_html('<strong style="color: {};">{}</strong>', color, obj.moderation_status)
    moderation_status_colored.short_description = 'Moderation'

    def approve_products(self, request, queryset):
        updated = queryset.update(moderation_status='APPROVED')
        self.message_user(request, f"{updated} product(s) approved.")
    approve_products.short_description = "✅ Approve selected products"

    def reject_products(self, request, queryset):
        updated = queryset.update(moderation_status='REJECTED')
        self.message_user(request, f"{updated} product(s) rejected.")
    reject_products.short_description = "❌ Reject selected products"

    def activate_products(self, request, queryset):
        updated = queryset.update(status='ACTIVE')
        self.message_user(request, f"{updated} product(s) activated.")
    activate_products.short_description = "📢 Activate selected products"

    def deactivate_products(self, request, queryset):
        updated = queryset.update(status='INACTIVE')
        self.message_user(request, f"{updated} product(s) deactivated.")
    deactivate_products.short_description = "🚫 Deactivate selected products"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(ProductMedia)
class ProductMediaAdmin(admin.ModelAdmin):
    list_display = ('product', 'media_type', 'file_path', 'url', 'order', 'created_at')
    list_filter = ('media_type', 'created_at')
    search_fields = ('product__name',)
    ordering = ['product', 'order', 'created_at']
