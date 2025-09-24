import React, { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { Star, Search, ChevronDown, ChevronUp, X, Filter, DollarSign, FileIcon, Building2Icon } from "lucide-react"

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
  isCollapsed?: boolean
  onToggleCollapse?: () => void
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
  isCollapsed = false,
  onToggleCollapse,
}: FilterSidebarProps) {
  const [categorySearch, setCategorySearch] = useState("")
  const [sellerSearch, setSellerSearch] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sellers: true,
    rating: true,
    tags: true,
  })

  const tags = ["Free Shipping", "In Stock", "On Sale", "New Arrivals", "Best Seller", "Limited Edition"]

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredSellers = sellers.filter(seller =>
    seller.toLowerCase().includes(sellerSearch.toLowerCase())
  )

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedCategories.length > 0) count += selectedCategories.length
    if (selectedSellers.length > 0) count += selectedSellers.length
    if (selectedRating && selectedRating > 0) count += 1
    if (selectedTags.length > 0) count += selectedTags.length
    if (priceRange[0] > 0 || priceRange[1] < 500) count += 1
    return count
  }

  const clearPriceRange = () => {
    setPriceRange([0, 500])
  }

  const clearRating = () => {
    if (onRatingChange) onRatingChange(0)
  }

  if (isCollapsed) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-800" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onClearAll && getActiveFiltersCount() > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClearAll}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs"
              >
                <X className="w-3 h-3" />
                Clear All
              </Button>
            )}
            {onToggleCollapse && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleCollapse}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Price Range
            </h3>
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearPriceRange}
                className="text-xs text-gray-500 hover:text-red-500 p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="px-2 relative">
            <div className="relative w-full h-8 mb-4">
              {/* Output displays */}
              {/* <span 
                className="absolute border border-gray-400 w-12 h-8 text-center text-gray-600 rounded text-sm font-bold leading-8 bottom-full mb-2 transform -translate-x-1/2"
                style={{ left: `${(priceRange[0] / 500) * 100}%` }}
              >
                ${priceRange[0]}
              </span>
              <span 
                className="absolute border border-gray-400 w-12 h-8 text-center text-gray-600 rounded text-sm font-bold leading-8 bottom-full mb-2 transform -translate-x-1/2"
                style={{ left: `${(priceRange[1] / 500) * 100}%` }}
              >
                ${priceRange[1]}
              </span> */}
              
              {/* Track backgrounds */}
              <span className="absolute w-full h-1 left-0 top-3 bg-gray-300 rounded"></span>
              <span 
                className="absolute h-1 top-3 bg-red-500 rounded"
                style={{ 
                  left: `${(Math.min(priceRange[0], priceRange[1]) / 500) * 100}%`,
                  width: `${(Math.abs(priceRange[1] - priceRange[0]) / 500) * 100}%`
                }}
              ></span>
              
              {/* Range inputs */}
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[0]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value)
                  setPriceRange([newValue, priceRange[1]])
                }}
                className="absolute left-0 top-2 w-full h-1 bg-transparent appearance-none pointer-events-auto cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-700 [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:pointer-events-auto
                  [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:border-none [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-transparent
                  [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none [&::-moz-range-track]:rounded
                  focus:outline-none"
              />
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value)
                  setPriceRange([priceRange[0], newValue])
                }}
                className="absolute left-0 top-2 w-full h-1 bg-transparent appearance-none pointer-events-auto cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-700 [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:pointer-events-auto
                  [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:border-none [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:bg-transparent
                  [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none [&::-moz-range-track]:rounded
                  focus:outline-none"
              />
            </div>
          </div>
          {/* non-moving output displays */}
          <div className="flex justify-between text-sm text-gray-600 px-1">
            <span>Price range:</span>
            <span>
              {priceRange[0]} - {priceRange[1]}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileIcon className="w-4 h-4" /> Categories
              {selectedCategories.length > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleSection('categories')}
              className="p-1"
            >
              {expandedSections.categories ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </div>
          
          {expandedSections.categories && (
            <>
              {categories.length > 5 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {filteredCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-3 hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                      className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <Label 
                      htmlFor={`cat-${category}`} 
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
                {filteredCategories.length === 0 && categorySearch && (
                  <p className="text-sm text-gray-500 text-center py-2">No categories found</p>
                )}
              </div>
            </>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Sellers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Building2Icon className="w-4 h-4" /> Sellers
              {selectedSellers.length > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {selectedSellers.length}
                </span>
              )}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleSection('sellers')}
              className="p-1"
            >
              {expandedSections.sellers ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </div>
          
          {expandedSections.sellers && (
            <>
              {sellers.length > 5 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sellers..."
                    value={sellerSearch}
                    onChange={(e) => setSellerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {filteredSellers.map((seller) => (
                  <div key={seller} className="flex items-center space-x-3 hover:bg-gray-50 p-1 rounded">
                    <Checkbox
                      id={`seller-${seller}`}
                      checked={selectedSellers.includes(seller)}
                      onCheckedChange={(checked) => onSellerChange(seller, checked as boolean)}
                      className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                    />
                    <Label 
                      htmlFor={`seller-${seller}`} 
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {seller}
                    </Label>
                  </div>
                ))}
                {filteredSellers.length === 0 && sellerSearch && (
                  <p className="text-sm text-gray-500 text-center py-2">No sellers found</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* <hr className="border-gray-200" /> */}

        {/* Ratings */}
        {/* {onRatingChange && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                ⭐ Minimum Rating
                {selectedRating && selectedRating > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    {selectedRating}+ stars
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {selectedRating && selectedRating > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearRating}
                    className="text-xs text-gray-500 hover:text-red-500 p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleSection('rating')}
                  className="p-1"
                >
                  {expandedSections.rating ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </Button>
              </div>
            </div>
            
            {expandedSections.rating && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="hover:bg-gray-50 p-1 rounded">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        className="w-4 h-4 text-yellow-500 focus:ring-yellow-400"
                        checked={selectedRating === star}
                        onChange={() => onRatingChange(star)}
                      />
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(star)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                          {[...Array(5 - star)].map((_, i) => (
                            <Star key={i + star} className="w-4 h-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-700">& up</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} */}

        {/* <hr className="border-gray-200" /> */}

        {/* Tags */}
        {/* {onTagChange && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                🏷️ Tags
                {selectedTags.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleSection('tags')}
                className="p-1"
              >
                {expandedSections.tags ? 
                  <ChevronUp className="w-4 h-4" /> : 
                  <ChevronDown className="w-4 h-4" />
                }
              </Button>
            </div>
            
            {expandedSections.tags && (
              <div className="grid grid-cols-1 gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="hover:bg-gray-50 p-1 rounded">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => onTagChange(tag, checked as boolean)}
                        className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">{tag}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  )
}
