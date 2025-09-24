# Product Multi-Media API Document## API Endpoints

### 1. Create NEW Product ### Request Body Examples

#### 1. Create NEW Product with Media
```json
POST /api/products/
{
  "name": "New Product Name",
  "description": "Product description",
  "price": "29.99",
  "stock_quantity": 100,
  "category_id": 1,
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAA...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
  ],
  "video_links": [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://vimeo.com/123456789"
  ],
  "tag_ids": [1, 2]
}
```

#### 2. Add Media to Existing Product (by Product ID)
```json
POST /api/products/123/add_media/
{
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAA...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
  ],
  "video_links": [
    "https://www.youtube.com/watch?v=new_video",
    "https://vimeo.com/new_video"
  ]
}
```

#### 3. Update Product Media (replaces all existing media)
```json
PATCH /api/products/123/
{
  "images": [
    "data:image/png;base64,new_image..."
  ],
  "video_links": [
    "https://www.youtube.com/watch?v=replacement_video"
  ]
}
``` /api/products/
Content-Type: application/json
Authorization: Bearer <token>
```

### 2. Update Existing Product (replaces all media)
```
PATCH /api/products/{product_id}/
Content-Type: application/json
Authorization: Bearer <token>
```

### 3. Add Media to Existing Product (keeps existing media)
```
POST /api/products/{product_id}/add_media/
Content-Type: application/json
Authorization: Bearer <token>
```

### 4. Get Product Media
```
GET /api/products/{product_id}/media/
```

### 5. Clear All Product Media
```
DELETE /api/products/{product_id}/clear_media/
Authorization: Bearer <token>
```rview
This API now supports multiple images and video links for products. Sellers can send arrays of base64 images and video URLs when creating or updating products. The system includes comprehensive validation and error handling.

## New Features

### 1. Multiple Images Support
- Send multiple base64 images in the `images` array
- Each image is automatically converted to PNG format
- Images are saved to `media/product/` directory
- File paths are stored in the `ProductMedia` table
- Invalid images are skipped with detailed logging

### 2. Video Links Support
- Send multiple video URLs in the `video_links` array
- Supports YouTube, Vimeo, and other video platforms
- URLs are validated for proper format
- URLs are stored directly in the `ProductMedia` table
- Invalid URLs are skipped with detailed logging

### 3. Backward Compatibility
- Original `image` and `image_base64` fields still work
- Existing API clients continue to work without changes

### 4. Comprehensive Validation
- ✅ Product existence validation
- ✅ Base64 image format validation
- ✅ URL format validation using Django validators
- ✅ Media type validation (IMAGE/VIDEO)
- ✅ Required field validation per media type
- ✅ File cleanup on database errors
- ✅ Detailed error logging

## API Endpoints

### Create Product with Media
```
POST /api/products/
Content-Type: application/json
Authorization: Bearer <token>
```

### Get Product Media
```
GET /api/products/{id}/media/
```

### Request Body Example
```json
{
  "name": "Sample Product",
  "description": "Product with multiple media",
  "price": "29.99",
  "stock_quantity": 100,
  "category_id": 1,
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."
  ],
  "video_links": [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://vimeo.com/123456789"
  ],
  "tag_ids": [1, 2]
}
```

### Response Example
```json
{
  "id": 1,
  "name": "Sample Product",
  "description": "Product with multiple media",
  "price": "29.99",
  "stock_quantity": 100,
  "category": {
    "id": 1,
    "name": "Electronics"
  },
  "media": [
    {
      "id": 1,
      "media_type": "IMAGE",
      "file_path": "product/abc123.png",
      "url": null,
      "order": 0,
      "media_url": "http://example.com/media/product/abc123.png"
    },
    {
      "id": 2,
      "media_type": "IMAGE", 
      "file_path": "product/def456.png",
      "url": null,
      "order": 1,
      "media_url": "http://example.com/media/product/def456.png"
    },
    {
      "id": 3,
      "media_type": "VIDEO",
      "file_path": null,
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "order": 0,
      "media_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],
  "image_url": "http://example.com/media/product/main_image.png",
  "seller": "seller@example.com",
  "created_at": "2025-09-08T10:00:00Z"
}
```

## Database Schema

### ProductMedia Table
- `id`: Primary key
- `product`: Foreign key to Product
- `media_type`: 'IMAGE' or 'VIDEO'
- `file_path`: Path to image file (for images)
- `url`: External URL (for videos)
- `order`: Display order (0-based)
- `created_at`: Timestamp

## Image Processing
- Base64 images are decoded and validated
- All images are converted to PNG format using Pillow
- Images are saved with UUID filenames
- Directory `media/product/` is created automatically
- Invalid images are skipped with error logging

## Video Links
- URLs are validated using Django's URLField
- No processing or validation of video content
- Supports any valid URL format

## Admin Interface
- ProductMedia appears as inline in Product admin
- Image previews shown for uploaded images
- Video links displayed as clickable links
- Ordering can be managed manually

## Validation and Error Handling

### Product Validation
- ✅ Product must exist before media can be created
- ✅ Product creation validates all required fields
- ✅ Media processing doesn't fail product creation

### Image Validation
- ✅ Base64 strings are validated and decoded
- ✅ Invalid images are skipped with error logging
- ✅ Images are converted to PNG format using Pillow
- ✅ File system errors are handled gracefully
- ✅ Database errors trigger file cleanup

### Video Validation
- ✅ URLs must start with http:// or https://
- ✅ URLs are validated using Django's URLValidator
- ✅ Invalid URLs are skipped with warning logs
- ✅ Malformed URLs don't break product creation

### Error Response Examples

**Invalid Base64 Image:**
```
# Invalid images are skipped, valid ones are processed
# Check server logs for detailed error information
```

**Invalid Video URL:**
```
# Invalid URLs are skipped, valid ones are processed
# Check server logs for warning messages
```

**Invalid Product Data:**
```json
{
  "name": ["This field is required."],
  "price": ["A valid number is required."]
}
```

## Testing

### Management Commands
```bash
# Test basic functionality
python manage.py test_media

# Test comprehensive validation
python manage.py test_validation
```

### API Testing Examples

**Valid Request:**
```bash
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": "29.99",
    "stock_quantity": 10,
    "category_id": 1,
    "images": ["iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="],
    "video_links": ["https://www.youtube.com/watch?v=test"]
  }'
```

**Get Product Media:**
```bash
curl http://localhost:8000/api/products/1/media/
```
