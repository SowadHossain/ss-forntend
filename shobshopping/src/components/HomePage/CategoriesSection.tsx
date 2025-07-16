import React from "react"
import { Card, CardContent } from "../ui/card"
import { mockCategories } from "../../lib/mock/mockCategories" // updated file path

type Subcategory = {
  name: string
  count: number
}

type Category = {
  name: string
  subcategories: Subcategory[]
}

interface CategoriesSectionProps {
  categories?: Category[]
}

export default function CategoriesSection({ categories = mockCategories }: CategoriesSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category 🛒</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const totalCount = category.subcategories.reduce((sum, sub) => sum + sub.count, 0)
            return (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                    {category.name.split(" ")[0][0]}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{totalCount.toLocaleString()} items</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
