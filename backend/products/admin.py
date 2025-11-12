# backend/products/admin.py
from django.utils.html import format_html

import io
import json
from django.contrib import admin, messages
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import signing

from .forms import BulkImportForm, CommitForm
from .utils_import import read_csv, build_preview, commit_rows, CSV_HEADERS
from accounts.models import CustomUser
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
    readonly_fields = ('created_at', 'product_image')

    autocomplete_fields = ('category', 'tags', 'seller')
    actions = ['approve_products', 'reject_products', 'activate_products', 'deactivate_products']
    inlines = [ProductMediaInline]

    # small perf win on changelist
    list_select_related = ('seller', 'category')
    
    change_list_template = "admin/products/product/change_list.html"

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

    # -----------------------------
    # Bulk Import: URLs + Views
    # -----------------------------
    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path('bulk-import/', self.admin_site.admin_view(self.bulk_import_view),
                 name='products_product_bulk_import'),
            path('bulk-import/template/', self.admin_site.admin_view(self.bulk_import_template),
                 name='products_product_bulk_import_template'),
        ]
        return custom + urls

    def bulk_import_template(self, request):
        """Downloadable CSV template."""
        buf = io.StringIO()
        buf.write(",".join(CSV_HEADERS) + "\n")
        # sample row
        sample = [
            "Sample Product",
            "Optional description",
            "Electronics",
            "new,featured",
            "99.99",
            "129.99",
            "10",
            "RECOMMENDED",
            "FREE_SHIPPING",
            "DRAFT",
            "IN_REVIEW",
            "true",
            "https://example.com/image.jpg",
            "",
            "IMAGE|https://example.com/extra1.jpg;VIDEO|https://example.com/v1.mp4",
            "IMAGE|extra2.jpg"
        ]
        buf.write(",".join(sample) + "\n")
        resp = HttpResponse(buf.getvalue(), content_type='text/csv')
        resp['Content-Disposition'] = 'attachment; filename="products_import_template.csv"'
        return resp

    def bulk_import_view(self, request):
        """
        Step 1 (GET/POST preview): choose seller + upload CSV/ZIP → PREVIEW (no DB writes)
        Step 2 (POST commit): include selected rows and optional 'allow update' flags → commit
        """
        context = {
            **self.admin_site.each_context(request),
            "title": "Bulk Import Products",
            "opts": self.model._meta,
            "csv_template_url": reverse('admin:products_product_bulk_import_template'),
            "help_text": (
                "1) Choose a Seller. 2) Upload CSV (optionally a ZIP of images). "
                "3) Preview. 4) Commit.\n"
                "Images: either use 'image_url' to fetch from the web, or 'image_filename' that exists inside the ZIP. "
                "For extra media, use 'media_urls' (format: TYPE|value;TYPE|value) or 'media_filenames' with a ZIP. "
                "A failed image will fail the row. Categories will be auto-created if not found. "
                "Duplicates are detected by (Seller + Product Name); updates are OFF by default and must be explicitly checked per row."
            ),
        }

        # Initial GET → upload form
        if request.method == "GET":
            form = BulkImportForm()
            context["headers"] = ", ".join(CSV_HEADERS)
            return render(request, "admin/products/bulk_import.html", {"form": form, **context})

        # POST: Preview
        if request.method == "POST" and "preview" in request.POST:
            form = BulkImportForm(request.POST, request.FILES)
            if not form.is_valid():
                context["headers"] = ", ".join(CSV_HEADERS)
                return render(request, "admin/products/bulk_import.html", {"form": form, **context})

            seller = form.cleaned_data["seller"]
            csv_file = form.cleaned_data["csv_file"]
            images_zip = form.cleaned_data.get("images_zip")
            auto_create_categories = form.cleaned_data["auto_create_categories"]

            try:
                rows = read_csv(csv_file)
            except Exception as e:
                messages.error(request, f"CSV error: {e}")
                context["headers"] = ", ".join(CSV_HEADERS)
                return render(request, "admin/products/bulk_import.html", {"form": form, **context})

            previews = build_preview(rows, seller, auto_create_categories, images_zip)
            total = len(previews)
            invalid = sum(1 for p in previews if not p.is_valid)
            duplicates = sum(1 for p in previews if p.will_update)
            new_count = total - duplicates

            # Sign payload so we don't trust client JSON
            payload_obj = {
                "seller_id": seller.id,
                "auto_create_categories": auto_create_categories,
                "previews": [
                    {
                        "index": p.index,
                        "data": p.data,
                        "is_valid": p.is_valid,
                        "errors": p.errors,
                        "will_update": p.will_update,
                        "reason": p.reason,
                    } for p in previews
                ],
            }
            payload = signing.dumps(payload_obj)

            commit_form = CommitForm(initial={"payload": payload})
            commit_form.set_row_count(total)

            return render(
                request,
                "admin/products/bulk_import_preview.html",
                {
                    "form": form,  # so we can show re-upload for ZIP if needed
                    "commit_form": commit_form,
                    "previews": previews,
                    "total": total,
                    "invalid": invalid,
                    "duplicates": duplicates,
                    "new_count": new_count,
                    **context,
                },
            )

        # POST: Commit
        if request.method == "POST" and "commit" in request.POST:
            commit_form = CommitForm(request.POST)
            if not commit_form.is_valid():
                messages.error(request, "Invalid commit form.")
                return redirect("admin:products_product_bulk_import")

            try:
                payload_obj = signing.loads(commit_form.cleaned_data["payload"])
            except signing.BadSignature:
                messages.error(request, "Invalid or expired preview payload.")
                return redirect("admin:products_product_bulk_import")

            seller = CustomUser.objects.get(id=payload_obj["seller_id"])
            auto_create_categories = payload_obj["auto_create_categories"]

            # Rehydrate previews
            from .utils_import import RowPreview  # local import to avoid circular
            previews = []
            for raw in payload_obj["previews"]:
                previews.append(
                    RowPreview(
                        index=raw["index"],
                        data=raw["data"],
                        is_valid=raw["is_valid"],
                        errors=raw["errors"],
                        will_update=raw["will_update"],
                        reason=raw["reason"],
                    )
                )

            include_idx = [int(i) for i in commit_form.cleaned_data.get("include_rows", [])]
            allow_update_idx = [int(i) for i in commit_form.cleaned_data.get("allow_update_rows", [])]

            if not include_idx:
                messages.warning(request, "No rows selected.")
                return redirect("admin:products_product_bulk_import")

            # If filenames were used, user must re-upload the ZIP on this step
            images_zip = request.FILES.get("images_zip")

            result = commit_rows(
                previews=previews,
                include_idx=include_idx,
                allow_update_idx=allow_update_idx,
                seller=seller,
                auto_create_categories=auto_create_categories,
                images_zip_file=images_zip,
            )

            messages.success(
                request,
                f"Commit complete. Created: {result['created']}, Updated: {result['updated']}, Failed: {result['failed']}."
            )
            return render(request, "admin/products/bulk_import_result.html", {"result": result, **context})

        # Fallback
        return redirect("admin:products_product_bulk_import")


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
