// src/components/HomePage/CategoryShowcaseSection.tsx

import React from "react"
import ProductCard from "../common/ProductCard"

type Product = {
  id: number
  name: string
  image: string
  price: number
  seller: string
  rating?: number
  reviews?: number
  originalPrice?: number
  badge?: string
}

interface CategoryShowcaseSectionProps {
  title: string
  products: Product[]
  link?: string
}

export default function CategoryShowcaseSection({ title, products, link }: CategoryShowcaseSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {link && (
            <a href={link} className="text-blue-600 hover:underline text-sm">
              Discover more
            </a>
          )}
        </div>

        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="min-w-[240px] max-w-[240px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
