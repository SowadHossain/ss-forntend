import React from "react"
import ProductCard from "../common/ProductCard"

type Product = {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  seller: string
  badge?: string
  category?: string
  inStock?: boolean
  freeShipping?: boolean
}

interface ProductGridProps {
  products: Product[]
  viewMode: "grid" | "list"
}

export default function ProductGrid({ products, viewMode }: ProductGridProps) {
  return (
    <div className="grid gap-6 mb-12 mt-4 text-sm text-gray-600">
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
