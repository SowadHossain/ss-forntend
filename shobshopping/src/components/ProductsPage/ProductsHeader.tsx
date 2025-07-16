// src/components/ProductsPage/ProductsHeader.tsx

import React from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Grid, List, Search } from "lucide-react"
import { Badge } from "../ui/badge"

interface ProductsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  priceRange?: [number, number]
}

export default function ProductsHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  priceRange,
}: ProductsHeaderProps) {
  return (
    <div className=" border-gray-200 "> {/* <-- removed sticky & top-16 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-end">

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-44 bg-white border border-gray-200 text-gray-700 rounded-md shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 text-gray-800 shadow-lg rounded-md">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-md px-3 text-sm border ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={`rounded-md px-3 text-sm border ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Row: Filter Summary Tags */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
            Sort: {sortBy.replace("-", " ")}
          </Badge>
          <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
            View: {viewMode}
          </Badge>
          {priceRange && (
            <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
              Price: ${priceRange[0]} - ${priceRange[1]}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
