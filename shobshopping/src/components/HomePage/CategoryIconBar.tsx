import React from "react"

interface CategoryIconBarProps {
  categories: any[]
  activeCategoryIndex: number
  onCategoryClick: (index: number) => void
}

export default function CategoryIconBar({
  categories,
  activeCategoryIndex,
  onCategoryClick,
}: CategoryIconBarProps) {
  return (
    <div className="flex gap-4 px-4 py-2 bg-white shadow rounded-lg overflow-x-auto">
      {categories.map((cat, idx) => (
        <button
          key={cat.id || idx}
          className={`flex flex-col items-center px-2 py-1 focus:outline-none ${
            activeCategoryIndex === idx ? "text-[#cd2733] font-bold" : "text-gray-600"
          }`}
          onClick={() => onCategoryClick(idx)}
        >
          {/* Use a placeholder icon, or replace with your own */}
          <span className="text-2xl mb-1">📦</span>
          <span className="text-xs">{cat.name || cat.title || "Category"}</span>
        </button>
      ))}
    </div>
  )
}
