import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { KeyboardEvent, useEffect } from "react"

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
  const safeItemsPerPage = Math.max(1, Math.floor(itemsPerPage) || 1)
  const totalPages = Math.max(0, Math.ceil(totalItems / safeItemsPerPage))

  useEffect(() => {
    // Keep UX consistent: scroll to top when page changes
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (_) {
      /* ignore in non-browser environments */
    }
  }, [currentPage])

  if (totalPages <= 1) return null

  const go = (page: number) => {
    const next = Math.min(Math.max(1, Math.floor(page)), totalPages)
    if (next !== currentPage) onPageChange(next)
  }

  const handleKey = (e: KeyboardEvent, page: number | string) => {
    if (typeof page === "number" && (e.key === "Enter" || e.key === " ")) go(page)
  }

  // Build page items per your explicit rules
  const buildPages = (): (number | string)[] => {
    const pages: (number | string)[] = []
    // if (totalPages <= 5) {
    //   for (let i = 1; i <= totalPages; i++) pages.push(i)
    //   return pages
    // }

    if (currentPage === 1) {
      pages.push(1, "...", totalPages)
    } else if (currentPage === totalPages) {
      pages.push(1, "...", totalPages)
    } else if (currentPage === 2) {
      pages.push(1, 2, "...", totalPages)
    } else if (currentPage === totalPages - 1) {
      pages.push(1, "...", totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage, "...", totalPages)
    }

    return pages
  }

  const pages = buildPages()

  return (
    <nav aria-label="Pagination" className="flex justify-center mt-8 items-center space-x-2">
      <button
        onClick={() => go(1)}
        disabled={currentPage === 1}
        aria-label="First page"
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronsLeft />
      </button>

      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronLeft />
      </button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={`page-${p}-${i}`}
            onClick={() => go(p)}
            onKeyDown={(e) => handleKey(e, p)}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={p === currentPage ? `Page ${p}, current` : `Go to page ${p}`}
            disabled={p === currentPage}
            className={`px-3 py-1 rounded border text-sm transition bg-white text-gray-700 disabled:opacity-50 ${
              p === currentPage ? "bg-blue-500 text-black border-blue-500 hover:bg-blue-50 hover:cursor-pointer" : ""
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={`dots-${i}`} className="px-3 py-1 text-sm text-gray-500" aria-hidden>
            {p}
          </span>
        )
      )}

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronRight />
      </button>

      <button
        onClick={() => go(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
        className="px-2 py-1 rounded border text-sm transition bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronsRight />
      </button>
    </nav>
  )
}
