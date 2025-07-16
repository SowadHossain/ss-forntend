// src/components/HomePage/TopSellersSection.tsx
import React from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Star } from "lucide-react"

type Seller = {
  name: string
  rating: number
  sales: string
  image: string
}

interface TopSellersSectionProps {
  sellers: Seller[]
}

export default function TopSellersSection({ sellers }: TopSellersSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Top Sellers 🏆</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
            >
              <CardContent className="p-6">
                <img
                  src={seller.image || "/placeholder.svg"}
                  alt={seller.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-gradient-to-r from-blue-400 to-purple-500"
                />
                <h3 className="font-semibold text-gray-800 mb-2">{seller.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{seller.rating}</span>
                </div>
                <p className="text-sm text-gray-500">{seller.sales} sales</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  View Store
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
