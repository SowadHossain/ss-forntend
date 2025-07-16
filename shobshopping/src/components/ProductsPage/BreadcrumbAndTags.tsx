import React from "react"
import { X } from "lucide-react"
import { Badge } from "../ui/badge"

interface BreadcrumbAndTagsProps {
  categoryPath: string[] 
  filters: string[] 
  onRemoveFilter: (filter: string) => void
}

export default function BreadcrumbAndTags({
  categoryPath,
  filters,
  onRemoveFilter,
}: BreadcrumbAndTagsProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-2">
          {categoryPath.map((crumb, index) => (
            <span key={crumb}>
              {index > 0 && <span className="mx-1">/</span>}
              <span className="hover:underline cursor-pointer">{crumb}</span>
            </span>
          ))}
        </nav>

        {/* Active Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {filters.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-sm text-gray-800 bg-white border-gray-300 flex items-center gap-1"
            >
              {tag}
              <button onClick={() => onRemoveFilter(tag)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
