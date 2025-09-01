// src/components/common/ProductCard.tsx

import { Heart, ShoppingCart, Star } from "lucide-react"
import { useState, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

import { API } from "../../lib/api"

type Product = {
  id: string
  name: string
  description: string
  price: string | number
  seller: string
  image?: string
  originalPrice?: number
  rating?: number
  reviews?: number
  badge?: string
  category?: {
    name: string
  }
  tags?: {
    name: string
  }[]
  _price?: number
  _matchScore?: number
  _name?: string
  _seller?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)
  const [wished, setWished] = useState(false)
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

  const handleWishlist = async (e: MouseEvent<HTMLButtonElement>) => {
    // prevent the surrounding elements / links from handling this click
    e.stopPropagation()
    e.preventDefault()
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    setWishLoading(true)
    try {
      await API.createWishlistItem({ product_id: product.id })
      setWished(true)
      setTimeout(() => setWished(false), 1500)
    } catch (err) {
      // Optionally show error toast
      // console.error(err)
    } finally {
      setWishLoading(false)
    }
  }

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 bg-white">
      <CardContent className="p-0">
        <div className="relative">
          <Link to={`/products/${product.id}`} className="block w-full">
            <div className="w-full aspect-square overflow-hidden rounded-t-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </div>
          </Link>
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
              {product.badge}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-transparent/30 hover:bg-transparent/50 text-red-600 hover:text-red-500 shadow-sm backdrop-blur-sm transition-all duration-300"
            onClick={handleWishlist}
            disabled={wishLoading || wished}
          >
            <Heart className="w-4 h-4" />
          </Button>
          {wished && (
            <div
              role="status"
              aria-live="polite"
              className="absolute top-12 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-20"
            >
              Added to wishlist
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 md:p-4 space-y-3">
          <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm md:text-base overflow-hidden break-words line-clamp-2 group-hover:text-red-600 transition-colors duration-300" style={{maxWidth: '100%'}}>
            <Link to={`/products/${product.id}`} className="block">
              {product.name}
            </Link>
          </h3>

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
