import React from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { Star } from "lucide-react"

interface FilterSidebarProps {
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string, checked: boolean) => void
  sellers: string[]
  selectedSellers: string[]
  onSellerChange: (seller: string, checked: boolean) => void
  selectedRating?: number
  onRatingChange?: (stars: number) => void
  selectedTags?: string[]
  onTagChange?: (tag: string, checked: boolean) => void
  onClearAll?: () => void
}

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  categories,
  selectedCategories,
  onCategoryChange,
  sellers,
  selectedSellers,
  onSellerChange,
  selectedRating,
  onRatingChange,
  selectedTags = [],
  onTagChange,
  onClearAll,
}: FilterSidebarProps) {
  const tags = ["Free Shipping", "In Stock", "On Sale"]

  return (
    <div className="space-y-6 border border-gray-200 p-5 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">🎛️ Filters</h2>
        {onClearAll && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearAll}
            className="text-gray-500 hover:text-red-500 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">💰 Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">📂 Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`cat-${category}`} className="text-sm text-gray-700">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sellers */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">🏪 Sellers</h3>
        <div className="space-y-2 max-h-40 overflow-auto pr-1">
          {sellers.map((seller) => (
            <div key={seller} className="flex items-center space-x-2">
              <Checkbox
                id={`seller-${seller}`}
                checked={selectedSellers.includes(seller)}
                onCheckedChange={(checked) => onSellerChange(seller, checked as boolean)}
              />
              <Label htmlFor={`seller-${seller}`} className="text-sm text-gray-700">
                {seller}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Ratings */}
      {onRatingChange && (
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">⭐ Minimum Rating</h3>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  id={`rating-${star}`}
                  className="hidden"
                  checked={selectedRating === star}
                  onChange={() => onRatingChange(star)}
                />
                <Label htmlFor={`rating-${star}`} className="flex items-center text-sm text-gray-700 space-x-1">
                  {[...Array(star)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span>& up</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-200" />

      {/* Tags */}
      {onTagChange && (
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">🏷️ Tags</h3>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => onTagChange(tag, checked as boolean)}
                />
                <Label htmlFor={`tag-${tag}`} className="text-sm text-gray-700">
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
