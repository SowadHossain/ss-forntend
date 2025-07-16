// src/pages/ProductsPage.tsx

import React, { useState } from "react"
import NavbarSection from "../components/HomePage/NavbarSection"
import FooterSection from "../components/HomePage/FooterSection"
import ProductsHeader from "../components/ProductsPage/ProductsHeader"
import FilterSidebar from "../components/ProductsPage/FilterSidebar"
import ProductGrid from "../components/ProductsPage/ProductGrid"
import BreadcrumbAndTags from "../components/ProductsPage/BreadcrumbAndTags"
import SubNavbar from "../components/common/SubNavbar"

import { mockCategories } from "../lib/mock/mockCategories"
import { mockSellers } from "../lib/mock/mockSellers"
import { mockProducts } from "../lib/mock/mockProducts"

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>(["Best Value", "Free Shipping"]) // you can change these dynamically
  const categoryPath = ["Home", "Electronics"] // dynamic later

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    )
  }

  const handleSellerChange = (seller: string, checked: boolean) => {
    setSelectedSellers((prev) =>
      checked ? [...prev, seller] : prev.filter((s) => s !== seller)
    )
  }

  const handleRemoveFilter = (tag: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tag))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarSection />
      <SubNavbar categories={mockCategories} />
      <BreadcrumbAndTags
        categoryPath={categoryPath}
        filters={activeTags}
        onRemoveFilter={handleRemoveFilter}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={mockCategories.map((cat) => cat.name)}
            sellers={mockSellers.map((s) => s.name)}
            selectedCategories={selectedCategories}
            selectedSellers={selectedSellers}
            onCategoryChange={handleCategoryChange}
            onSellerChange={handleSellerChange}
          />
        </aside>

        <main className="flex-1">
          <ProductGrid products={mockProducts} viewMode={viewMode} />
        </main>
      </div>

      <FooterSection />
    </div>
  )
}
