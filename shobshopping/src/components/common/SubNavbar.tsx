import React from "react"
import { ChevronDown } from "lucide-react"
import { mockCategories } from "../../lib/mock/mockCategories"

export default function SubNavbar() {
  return (
    <nav className="sticky top-0 bg-white shadow-sm border-y border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap justify-start gap-x-5 gap-y-2 py-2">
          {mockCategories.map((cat) => (
            <li key={cat.name} className="relative group">
              <button className="flex items-center text-xs font-semibold text-gray-700 hover:text-blue-600 transition">
                {cat.name}
                <ChevronDown className="ml-1 w-3 h-3" />
              </button>

              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 shadow-md rounded-md p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <ul className="max-h-64 overflow-y-auto space-y-1">
                  {cat.subcategories.map((sub) => (
                    <li
                      key={sub.name}
                      className="text-xs text-gray-700 hover:text-blue-600 cursor-pointer"
                    >
                      {sub.name}{" "}
                      <span className="text-[10px] text-gray-400">
                        ({sub.count})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
