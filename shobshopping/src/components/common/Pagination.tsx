import React from "react"

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border text-sm transition ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
          >
            {page}
          </button>
        )
      })}
    </div>
  )
}
