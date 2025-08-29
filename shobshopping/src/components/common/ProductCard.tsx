// src/components/common/ProductCard.tsx

import { Heart, Star, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

import { API } from "../../lib/api"

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
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated =
    !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken")

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    setLoading(true)
    try {
      await API.createCart({ product_id: product.id, quantity: 1 })
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      // Optionally show error toast
      // console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 bg-white">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-28 sm:h-32 md:h-36 lg:h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
              {product.badge}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm backdrop-blur-sm transition-all duration-300"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-2 sm:p-3 md:p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm md:text-base overflow-hidden break-words line-clamp-2 group-hover:text-red-600 transition-colors duration-300" style={{maxWidth: '100%'}}>{product.name}</h3>

          {product.rating !== undefined && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[0,1,2,3,4].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors ${
                      i < Math.floor(product.rating ?? 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 ml-2">({product.reviews})</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800 overflow-hidden text-ellipsis block">BDT {product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 line-through ml-2 overflow-hidden text-ellipsis block">BDT {product.originalPrice}</span>
              )}
            </div>
            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 border border-gray-200 overflow-hidden text-ellipsis block">
              {product.seller}
            </Badge>
          </div>
          <Button
            className="w-full flex items-center justify-center gap-2 h-7 sm:h-8 md:h-9 lg:h-10 text-xs sm:text-sm bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            onClick={handleAddToCart}
            disabled={loading || added}
            >
            {added ? "Added!" : loading ? "Adding..." : (
              <>
              Add to Cart <ShoppingCart className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};
