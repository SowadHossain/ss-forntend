// src/components/common/ProductCard.tsx

import React from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Heart, Star, ShoppingCart } from "lucide-react"

type Product = {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  seller: string
  badge?: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 bg-white">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white">
              {product.badge}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

          {product.rating !== undefined && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating ?? 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
              {product.seller}
            </Badge>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            Add to Cart 🛒
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
