# backend/products/utils_import.py
import csv
import io
import json
import re
import zipfile
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any, Tuple
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from django.core.files.base import ContentFile
from django.db import transaction
from django.utils.timezone import now

from accounts.models import CustomUser
from .models import Product, Category, Tag, ProductMedia

CSV_HEADERS = [
    "name",
    "description",
    "category",
    "tags",  # comma separated
    "price",
    "original_price",
    "stock_quantity",
    "badge",              # TOP_SELLER|RECOMMENDED|HOT
    "label",              # FREE_SHIPPING|LIMITED_STOCK|CASHBACK
    "status",             # DRAFT|ACTIVE|INACTIVE
    "moderation_status",  # IN_REVIEW|APPROVED|REJECTED
    "recommended",        # true/false
    "image_url",
    "image_filename",
    "media_urls",         # semicolon list: IMAGE|https://...;VIDEO|https://...
    "media_filenames",    # semicolon list: IMAGE|file.jpg;IMAGE|file2.png;VIDEO|https://...
]

BOOL_TRUE = {"true", "1", "yes", "y", "t"}

@dataclass
class RowPreview:
    index: int
    data: Dict[str, Any]
    is_valid: bool
    errors: List[str] = field(default_factory=list)
    will_update: bool = False  # duplicate
    reason: str = ""           # short reason (created/updated/invalid)
    # derived fields for commit
    category_id: Optional[int] = None  # existing or to create
    tag_names: List[str] = field(default_factory=list)

def _to_bool(val: str) -> bool:
    if val is None:
        return False
    return str(val).strip().lower() in BOOL_TRUE

def _looks_like_url(url: str) -> bool:
    try:
        p = urlparse(url)
        return p.scheme in ("http", "https") and bool(p.netloc)
    except Exception:
        return False

def parse_semicolon_media(s: str) -> List[Tuple[str, str]]:
    """
    Parse "IMAGE|https://...;VIDEO|https://..." into list of (type, value).
    """
    items = []
    if not s:
        return items
    for part in s.split(";"):
        part = part.strip()
        if not part:
            continue
        if "|" not in part:
            # default to IMAGE if missing type
            items.append(("IMAGE", part))
        else:
            t, v = part.split("|", 1)
            items.append((t.strip().upper(), v.strip()))
    return items

def read_csv(file) -> List[Dict[str, Any]]:
    raw = file.read()
    # try utf-8 first, fallback to latin-1
    try:
        text = raw.decode("utf-8-sig")
    except Exception:
        text = raw.decode("latin-1")
    reader = csv.DictReader(io.StringIO(text))
    # normalize headers
    headers = [h.strip() for h in reader.fieldnames or []]
    missing = [h for h in CSV_HEADERS if h not in headers]
    if missing:
        raise ValueError(f"Missing CSV columns: {', '.join(missing)}")
    rows = []
    for row in reader:
        # keep only expected headers
        cleaned = {h: (row.get(h) or "").strip() for h in CSV_HEADERS}
        rows.append(cleaned)
    return rows

def build_preview(rows: List[Dict[str, Any]], seller: CustomUser, auto_create_categories: bool, images_zip_file) -> List[RowPreview]:
    # Build a ZIP members set if provided
    zip_members = set()
    zip_bytes = None
    if images_zip_file:
        zip_bytes = images_zip_file.read()
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
            zip_members = set(m.filename for m in z.infolist() if not m.is_dir())

    previews: List[RowPreview] = []
    for idx, d in enumerate(rows):
        pv = RowPreview(index=idx, data=d, is_valid=True)
        # Requireds
        if not d["name"]:
            pv.is_valid = False; pv.errors.append("Missing name")
        if not d["price"]:
            pv.is_valid = False; pv.errors.append("Missing price")
        if not d["stock_quantity"]:
            pv.is_valid = False; pv.errors.append("Missing stock_quantity")

        # Numbers
        try:
            float(d["price"] or "0")
        except Exception:
            pv.is_valid = False; pv.errors.append("Invalid price")
        if d["original_price"]:
            try: float(d["original_price"])
            except Exception: pv.is_valid = False; pv.errors.append("Invalid original_price")
        try:
            int(d["stock_quantity"] or "0")
        except Exception:
            pv.is_valid = False; pv.errors.append("Invalid stock_quantity")

        # Category
        cat_name = d["category"].strip()
        if cat_name:
            cat = Category.objects.filter(name__iexact=cat_name).first()
            if cat:
                pv.category_id = cat.id
            else:
                if auto_create_categories:
                    # mark as create; create on commit
                    pv.category_id = None
                else:
                    pv.is_valid = False; pv.errors.append(f"Unknown category '{cat_name}' (auto-create disabled)")
        # Tags
        tags = [t.strip() for t in (d["tags"] or "").split(",") if t.strip()]
        pv.tag_names = tags

        # Badges/labels/status choices (only check set is valid if provided)
        BADGE = {"TOP_SELLER","RECOMMENDED","HOT"}
        LABEL = {"FREE_SHIPPING","LIMITED_STOCK","CASHBACK"}
        STATUS = {"DRAFT","ACTIVE","INACTIVE"}
        MOD = {"IN_REVIEW","APPROVED","REJECTED"}

        if d["badge"] and d["badge"] not in BADGE:
            pv.is_valid = False; pv.errors.append(f"Invalid badge '{d['badge']}'")
        if d["label"] and d["label"] not in LABEL:
            pv.is_valid = False; pv.errors.append(f"Invalid label '{d['label']}'")
        if d["status"] and d["status"] not in STATUS:
            pv.is_valid = False; pv.errors.append(f"Invalid status '{d['status']}'")
        if d["moderation_status"] and d["moderation_status"] not in MOD:
            pv.is_valid = False; pv.errors.append(f"Invalid moderation_status '{d['moderation_status']}'")

        # Image checks
        img_url = d["image_url"]
        img_file = d["image_filename"]
        if img_url and not _looks_like_url(img_url):
            pv.is_valid = False; pv.errors.append("image_url is not a valid http(s) URL")
        if img_file and images_zip_file and img_file not in zip_members:
            pv.is_valid = False; pv.errors.append(f"image_filename '{img_file}' not found in ZIP")
        if not img_url and not img_file:
            # allow no image? up to you; let's allow but warn
            pass

        # Extra media checks (filenames must exist if ZIP provided)
        for mt, val in parse_semicolon_media(d["media_filenames"]):
            if images_zip_file and val not in zip_members:
                pv.is_valid = False; pv.errors.append(f"media filename '{val}' missing in ZIP")
            if mt not in {"IMAGE","VIDEO"}:
                pv.is_valid = False; pv.errors.append(f"media type '{mt}' invalid")
        for mt, val in parse_semicolon_media(d["media_urls"]):
            if mt not in {"IMAGE","VIDEO"}:
                pv.is_valid = False; pv.errors.append(f"media type '{mt}' invalid")
            if not _looks_like_url(val):
                pv.is_valid = False; pv.errors.append("media url invalid")

        # Duplicate detection: same (seller, name) => will_update flag
        dup = Product.objects.filter(seller=seller, name__iexact=d["name"]).first()
        pv.will_update = bool(dup)

        pv.reason = ("Invalid" if not pv.is_valid else ("Duplicate (will update if selected)" if pv.will_update else "New (will create)"))
        previews.append(pv)

    return previews

def _download_url(url: str, timeout=10) -> bytes:
    # HEAD first to fail fast, fallback to GET (some CDNs block HEAD)
    try:
        req = Request(url, method="HEAD")
        with urlopen(req, timeout=timeout) as r:
            pass
    except Exception:
        pass
    req = Request(url, method="GET")
    with urlopen(req, timeout=timeout) as r:
        data = r.read()
    return data

def _get_zip_file(zip_bytes, filename: str) -> bytes:
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        with z.open(filename) as f:
            return f.read()

def commit_rows(previews: List[RowPreview], include_idx: List[int], allow_update_idx: List[int], seller: CustomUser, auto_create_categories: bool, images_zip_file) -> Dict[str, Any]:
    """
    Returns a result summary with per-row outcomes.
    Image failures -> fail the row (as requested).
    Updates happen only if row index is in allow_update_idx and duplicate was detected.
    """
    zip_bytes = images_zip_file.read() if images_zip_file else None

    results = {
        "total": len(include_idx),
        "created": 0,
        "updated": 0,
        "failed": 0,
        "rows": [],  # per-row dict: {index, status, message}
    }

    with transaction.atomic():
        for idx in include_idx:
            pv = previews[idx]
            d = pv.data
            row_info = {"index": idx, "status": "", "message": ""}

            if not pv.is_valid:
                results["failed"] += 1
                row_info["status"] = "failed"
                row_info["message"] = "; ".join(pv.errors)
                results["rows"].append(row_info)
                continue

            # Resolve category (create if needed)
            category = None
            cat_name = d["category"].strip()
            if cat_name:
                category = Category.objects.filter(name__iexact=cat_name).first()
                if not category:
                    if auto_create_categories:
                        category = Category.objects.create(name=cat_name)
                    else:
                        results["failed"] += 1
                        row_info["status"] = "failed"
                        row_info["message"] = f"Unknown category '{cat_name}'"
                        results["rows"].append(row_info)
                        continue

            # Prepare base fields
            fields = {
                "name": d["name"],
                "description": d["description"],
                "category": category,
                "price": d["price"] or 0,
                "original_price": d["original_price"] or None,
                "stock_quantity": d["stock_quantity"] or 0,
                "badge": d["badge"] or None,
                "label": d["label"] or None,
                "status": d["status"] or "DRAFT",
                "moderation_status": d["moderation_status"] or "IN_REVIEW",
                "recommended": _to_bool(d["recommended"]),
            }

            # Find existing?
            existing = Product.objects.filter(seller=seller, name__iexact=d["name"]).first()
            is_update = bool(existing) and (idx in allow_update_idx)

            # Create or update
            product = existing if is_update else Product(seller=seller)
            for k, v in fields.items():
                setattr(product, k, v)

            # Handle main image
            img_url = d["image_url"]
            img_file = d["image_filename"]
            if img_url:
                try:
                    data = _download_url(img_url, timeout=12)
                    product.image.save(_safe_filename_from_url(img_url), ContentFile(data), save=False)
                except Exception as e:
                    results["failed"] += 1
                    row_info["status"] = "failed"
                    row_info["message"] = f"Failed to download image_url: {e}"
                    results["rows"].append(row_info)
                    continue
            elif img_file:
                if not zip_bytes:
                    results["failed"] += 1
                    row_info["status"] = "failed"
                    row_info["message"] = "images_zip not provided but image_filename given"
                    results["rows"].append(row_info)
                    continue
                try:
                    data = _get_zip_file(zip_bytes, img_file)
                    product.image.save(img_file.split("/")[-1], ContentFile(data), save=False)
                except Exception as e:
                    results["failed"] += 1
                    row_info["status"] = "failed"
                    row_info["message"] = f"Failed to read image_filename from ZIP: {e}"
                    results["rows"].append(row_info)
                    continue

            product.save()

            # Tags
            tag_names = [t.strip() for t in (d["tags"] or "").split(",") if t.strip()]
            if tag_names:
                tags = list(Tag.objects.filter(name__in=tag_names))
                # auto-create tags if missing (optional: enable by default)
                existing_names = set(t.name for t in tags)
                for new_name in tag_names:
                    if new_name not in existing_names:
                        tags.append(Tag.objects.create(name=new_name))
                        existing_names.add(new_name)
                product.tags.set(tags)
            else:
                product.tags.clear()

            # ProductMedia
            # First, if update, we won't delete existing media; append new entries.
            order_counter = ProductMedia.objects.filter(product=product).count()

            # media_filenames
            for mt, fname in parse_semicolon_media(d["media_filenames"]):
                if mt not in {"IMAGE","VIDEO"}:
                    continue
                if mt == "IMAGE":
                    if not zip_bytes:
                        results["failed"] += 1
                        row_info["status"] = "failed"
                        row_info["message"] = f"media_filenames includes image '{fname}' but images_zip is missing"
                        results["rows"].append(row_info)
                        # rollback this row only by raising? We’re in one big transaction;
                        # instead, mark failed and continue to next row safely by returning early
                        transaction.set_rollback(True)
                        return results
                    try:
                        data = _get_zip_file(zip_bytes, fname)
                        pm = ProductMedia(product=product, media_type="IMAGE", order=order_counter)
                        pm.file_path = f"imported/{fname.split('/')[-1]}"  # optional: keep a visible path label
                        pm.save()
                    except Exception as e:
                        results["failed"] += 1
                        row_info["status"] = "failed"
                        row_info["message"] = f"Failed media image from ZIP: {e}"
                        results["rows"].append(row_info)
                        transaction.set_rollback(True)
                        return results
                    order_counter += 1
                else:
                    pm = ProductMedia(product=product, media_type="VIDEO", url=fname, order=order_counter)
                    pm.save()
                    order_counter += 1

            # media_urls
            for mt, u in parse_semicolon_media(d["media_urls"]):
                if mt not in {"IMAGE","VIDEO"}:
                    continue
                if mt == "IMAGE":
                    try:
                        _ = _download_url(u, timeout=10)  # just to validate reachability; we don't store bytes for ProductMedia.image in your schema
                        pm = ProductMedia(product=product, media_type="IMAGE", order=order_counter)
                        pm.file_path = u  # store URL in file_path for reference, since ProductMedia has string fields
                        pm.save()
                    except Exception as e:
                        results["failed"] += 1
                        row_info["status"] = "failed"
                        row_info["message"] = f"Failed media image download: {e}"
                        results["rows"].append(row_info)
                        transaction.set_rollback(True)
                        return results
                    order_counter += 1
                else:
                    if not _looks_like_url(u):
                        results["failed"] += 1
                        row_info["status"] = "failed"
                        row_info["message"] = "Invalid media video URL"
                        results["rows"].append(row_info)
                        transaction.set_rollback(True)
                        return results
                    pm = ProductMedia(product=product, media_type="VIDEO", url=u, order=order_counter)
                    pm.save()
                    order_counter += 1

            if is_update:
                results["updated"] += 1
                row_info["status"] = "updated"
                row_info["message"] = "Updated existing product"
            else:
                results["created"] += 1
                row_info["status"] = "created"
                row_info["message"] = "Created new product"
            results["rows"].append(row_info)

    return results

def _safe_filename_from_url(url: str) -> str:
    name = url.split("?")[0].rstrip("/").split("/")[-1] or "image.jpg"
    # basic sanitize
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name)
    return name
