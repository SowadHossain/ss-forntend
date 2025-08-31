import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useEffect } from "react"

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  if (totalPages <= 1) return null

  const handleFirst = () => {
    onPageChange(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handlePrev = () => {
    onPageChange(Math.max(1, currentPage - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleLast = () => {
    onPageChange(totalPages)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show up to 5 page numbers, with "..." if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {<ChevronsLeft />}
      </button>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {<ChevronLeft />}
      </button>
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-3 py-1 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(Number(page))}
            className={`px-3 py-1 rounded border text-sm transition ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {<ChevronRight />}
      </button>
      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {<ChevronsRight />}
      </button>
    </div>
  )
}
