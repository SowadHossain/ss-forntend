import { ArrowLeft, Compass, Home, Search } from "lucide-react"
import React, { useState } from "react"

export default function NotFoundPage() {
  const [q, setQ] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (!query) {
      // if empty, just go home
      window.location.href = "/"
      return
    }
    // redirect to a simple search route (adjust if your app uses a different route)
    window.location.href = `/search?q=${encodeURIComponent(query)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50 px-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-10 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="text-red-600 bg-red-100 rounded-full p-4">
            <Compass className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-red-600 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page not found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved. Try searching for what you need or return home.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2">
          <label htmlFor="site-search" className="sr-only">Search site</label>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search products, categories, or help..."
              className="w-full pl-10 pr-4 py-3 rounded-l-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-r-md font-medium"
            aria-label="Search"
          >
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>

          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-200 hover:bg-red-50"
          >
            <Home className="h-4 w-4 text-red-600" /> Home
          </a>

          <a
            href="/deals"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-200 hover:bg-red-50"
          >
            <Compass className="h-4 w-4 text-red-600" /> Products
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Tip: Check the URL for typos, or use the search above to find what you're looking for.</p>
        </div>
      </div>
    </div>
  )
}
