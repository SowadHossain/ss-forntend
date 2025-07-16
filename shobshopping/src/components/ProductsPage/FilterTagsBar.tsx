import React from "react"
interface FilterTagsBarProps {
    sortBy: string
    viewMode: "grid" | "list"
    priceRange: number[]
    selectedCategories: string[]
    selectedSellers: string[]
  }
  
  export default function FilterTagsBar({
    sortBy,
    viewMode,
    priceRange,
    selectedCategories,
    selectedSellers,
  }: FilterTagsBarProps) {
    const tags = [
      { label: `Sort: ${sortBy.replace("-", " ")}` },
      { label: `View: ${viewMode}` },
      { label: `Price: $${priceRange[0]} - $${priceRange[1]}` },
      ...selectedCategories.map((cat) => ({ label: `Category: ${cat}` })),
      ...selectedSellers.map((seller) => ({ label: `Seller: ${seller}` })),
    ]
  
    return (
      <div className="mt-4 mb-6 flex flex-wrap gap-2 text-sm text-gray-700 border-b border-gray-200 pb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-300"
          >
            {tag.label}
          </span>
        ))}
      </div>
    )
  }
  