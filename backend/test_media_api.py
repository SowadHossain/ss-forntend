#!/usr/bin/env python3
"""
Test script to verify the new media functionality
This can be run with: python test_media_api.py
"""

import json

# Sample request data that sellers would send
sample_request_data = {
    "name": "Sample Product with Multiple Media",
    "description": "A product with multiple images and video links",
    "price": "29.99",
    "stock_quantity": 100,
    "category_id": 1,  # Assuming category exists
    "images": [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",  # 1x1 red pixel
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4Wj0XwAAAABJRU5ErkJggg==",  # 1x1 green pixel
    ],
    "video_links": [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://vimeo.com/123456789"
    ]
}

print("Sample API Request Data:")
print(json.dumps(sample_request_data, indent=2))

print("\n" + "="*50)
print("USAGE INSTRUCTIONS:")
print("="*50)

print("""
To use this new functionality, sellers should send a POST request to your products endpoint with:

1. IMAGES: Send as 'images' array containing base64 strings
   - Each image will be converted to PNG and saved to media/product/
   - File paths will be stored in ProductMedia table

2. VIDEO LINKS: Send as 'video_links' array containing URLs
   - YouTube, Vimeo, or any video URLs
   - URLs will be stored directly in ProductMedia table

3. BACKWARD COMPATIBILITY: Original 'image' field still works
   - Can still send single image as 'image' or 'image_base64'

API Response will include:
- 'media' field: Array of all images and videos with URLs
- 'image_url': Original image URL (for backward compatibility)

Example usage:
POST /api/products/
Content-Type: application/json

{
  "name": "Product Name",
  "price": "19.99",
  "images": ["base64_string_1", "base64_string_2"],
  "video_links": ["https://youtube.com/watch?v=..."]
}
""")
