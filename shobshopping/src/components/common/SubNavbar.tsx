import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { API } from "../../lib/api"

type ApiCategory = {
  id: number
  name: string
  parent: number | null
  parent_name?: string | null
  subcategories?: any[]
  subcategories_count?: number
  products_count?: number
}

type Subcat = {
  id: number
  name: string
  count: number
}

type Cat = {
  id: number
  name: string
  subcategories: Subcat[]
}

export default function SubNavbar() {
  const [categories, setCategories] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchCategories = async () => {
      try {
        const data: ApiCategory[] = await API.getCategories()

        if (!mounted) return

        // Transform API flat list into parent categories with subcategories
        const map = new Map<number, Cat>()

        // First pass: create parent categories
        data.forEach((item) => {
          if (item.parent === null) {
            map.set(item.id, { id: item.id, name: item.name, subcategories: [] })
          }
        })

        // Second pass: attach subcategories to their parents. If parent missing, create placeholder using parent_name
        data.forEach((item) => {
          if (item.parent !== null) {
            const parentId = item.parent
            const sub: Subcat = { id: item.id, name: item.name, count: item.products_count ?? 0 }
            const parent = map.get(parentId)
            if (parent) parent.subcategories.push(sub)
            else {
              // Parent category wasn't returned as a top-level item; create a placeholder so the UI can still show it
              map.set(parentId, {
                id: parentId,
                name: item.parent_name ?? "Unknown",
                subcategories: [sub],
              })
            }
          }
        })

        // Keep ordering predictable: convert to array
        const cats = Array.from(map.values())
        setCategories(cats)
      } catch (err: any) {
        setError(err?.message ?? String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <nav className="sticky top-0 bg-white shadow-sm border-y border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-3 text-xs text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="py-3 text-xs text-red-500">Error: {error}</div>
        ) : (
          <ul className="flex flex-wrap justify-start gap-x-5 gap-y-2 py-2">
            {categories.map((cat) => (
              <li key={cat.id} className="relative group">
                <button className="flex items-center text-xs font-semibold text-gray-700 hover:text-blue-600 transition">
                  {cat.name}
                  <ChevronDown className="ml-1 w-3 h-3" />
                </button>

                {/* Dropdown */}
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 shadow-md rounded-md p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  {/* Group subcategories by a visible prefix to make long lists easier to scan.
                      Example grouping: "abs - 1", "abs - 2" => group header "abs" with children.
                      If no prefix found, they go into an "Other" group. */}
                  <div className="max-h-64 overflow-y-auto">
                    {/** Build groups: prefix => items **/}
                    {(() => {
                      type Group = { key: string; items: Subcat[] }

                      const groupsMap = new Map<string, Subcat[]>()

                      cat.subcategories.forEach((s) => {
                        const parts = s.name.split(" - ")
                        const key = parts.length > 1 ? parts[0].trim() : "Other"
                        const arr = groupsMap.get(key) ?? []
                        arr.push(s)
                        groupsMap.set(key, arr)
                      })

                      const groups: Group[] = Array.from(groupsMap.entries()).map(([k, v]) => ({ key: k, items: v }))

                      // Render groups in a responsive grid. Small lists show single column, larger show 2-3.
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {groups.map((g) => (
                            <div key={g.key} className="space-y-1">
                              <div className="text-[11px] font-medium text-gray-600">{g.key}</div>
                              <ul className="space-y-1">
                                {g.items.map((sub) => (
                                  <li key={sub.id}>
                                    <a
                                      href={`/products?sub-category=${encodeURIComponent(sub.name)}`}
                                      className="text-xs text-gray-700 hover:text-blue-600 block w-full"
                                    >
                                      {(() => {
                                        // Show the remainder after the prefix for compactness when possible
                                        const parts = sub.name.split(" - ")
                                        return parts.length > 1 ? parts.slice(1).join(" - ") : sub.name
                                      })()}
                                      <span className="ml-1 text-[10px] text-gray-400">({sub.count})</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}
