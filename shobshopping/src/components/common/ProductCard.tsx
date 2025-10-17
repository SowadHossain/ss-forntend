// src/components/common/ProductCard.tsx

import { ShoppingCart } from "lucide-react"
import { useState, type MouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

import { API } from "../../lib/api"

type Product = {
  id: string
  name: string
  description?: string
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
  original_price?: string | number
}

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)
  const [wished, setWished] = useState(false)
  const [showLuxuryDialog, setShowLuxuryDialog] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated =
    !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken")

  // Check if product is a luxury item (defensive: category may be string or object,
  // and casing/wording may vary). Match if the category contains "luxury".
  const _categoryRaw = (product as any).category
  const _categoryName =
    typeof _categoryRaw === "string" ? _categoryRaw : _categoryRaw?.name ?? ""
  const isLuxuryItem = String(_categoryName).toLowerCase().includes("luxury")

  // compute numeric price and discount percent (support originalPrice or original_price)
  const _priceNum = typeof product.price === "number" ? product.price : Number(String(product.price).replace(/[^0-9.-]+/g, ""))
  const originalPriceRaw = product.originalPrice ?? (product as any).original_price ?? product.original_price
  const _originalPriceNum =
    typeof originalPriceRaw === "number"
      ? originalPriceRaw
      : Number(String(originalPriceRaw ?? "").replace(/[^0-9.-]+/g, ""))
  const discountPercent =
    _originalPriceNum && !Number.isNaN(_priceNum) && _originalPriceNum > _priceNum
      ? Math.round(((_originalPriceNum - _priceNum) / _originalPriceNum) * 100)
      : 0

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

  const handleProductClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isLuxuryItem) {
      e.preventDefault()
      setShowLuxuryDialog(true)
    }
  }

  const handleConfirmLuxuryView = () => {
    setShowLuxuryDialog(false)
    navigate(`/products/${product.id}`)
  }

  return (
    <>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-white bg-gray-200 rounded-lg overflow-hidden h-full shadow-lg">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative flex-shrink-0">
            <Link 
              to={`/products/${product.id}`} 
              className="block w-full"
              onClick={handleProductClick}
            >
              <div className="w-full aspect-square overflow-hidden bg-gray-50 border-b border-red-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            {discountPercent > 0 && (
              <div className="absolute top-3 left-0">
                <div className="bg-[#cf2633] text-white text-xs font-semibold px-2 py-1 relative">
                  {discountPercent}%
                </div>
              </div>
            )}
            {/* {product.badge && !discountPercent && (
              <Badge className="absolute top-2 left-2 bg-pink-700 text-white shadow-lg text-xs">
                {product.badge}
              </Badge>
            )} */}
            {/* {wished && (
              <div
                role="status"
                aria-live="polite"
                className="absolute top-12 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-20"
              >
                Added to wishlist
              </div>
            )} */}
          </div>
          
          <div className="p-3 space-y-1 flex flex-col flex-1 justify-between">
            {/* Product Name */}
            <h3 className="font-bold text-black text-lg line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 overflow-hidden block whitespace-normal truncate">
              <Link 
                to={`/products/${product.id}`} 
                className="block"
                onClick={handleProductClick}
              >
                <span title={product.name}>
                  {product.name}
                </span>
              </Link>
            </h3>

            {/* Rating (if available) */}
            {/* {product.rating !== undefined && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0,1,2,3,4].map((i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 transition-colors ${
                        i < Math.floor(product.rating ?? 0) ? "text-yellow-400 fill-current" : "text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-700 ml-1">({product.reviews || 0})</span>
              </div>
            )} */}

            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {/* {_originalPriceNum > 0 && discountPercent > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    {_originalPriceNum} ৳
                  </span>
                )} */}
                <span className="text-lg font-bold text-[#cf2633]">
                  BDT {_priceNum}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1 pt-0">
              {/* Buy Now Button - Primary */}
              {/* <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm h-9 transition-all duration-200"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                View Details
              </Button> */}
              
              {/* Add to Cart Button - Secondary */}
              {/* <Button
                variant="outline"
                className="w-full border-gray-300 hover:border-gray-400 text-black font-semibold hover:text-gray-900 font-medium text-sm h-9 bg-white hover:bg-gray-50 flex items-center justify-center gap-2 transition-all duration-200"
                onClick={handleAddToCart}
                disabled={loading || added}
              > */}
              <Button
                variant="outline"
                className="w-full bg-[#cf2633] text-white text-sm rounded-md hover:bg-red-700 font-medium text-sm h-9 transition-all duration-200 hover:text-white"
                onClick={handleAddToCart}
                disabled={loading || added}
              >
                {added ? (
                  "Added to Cart!"
                ) : loading ? (
                  "Adding..."
                ) : (
                  <>
                    Add to Cart
                    <ShoppingCart className="w-4 h-4" />
                  </>
                )}
              </Button>

            </div>

            {/* Seller Badge (backwards compatibility) */}
            {/* {product.seller && (
              <div className="pt-1">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                  {product.seller}
                </Badge>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Luxury Items Confirmation Dialog */}
      <AlertDialog open={showLuxuryDialog} onOpenChange={setShowLuxuryDialog}>
        <AlertDialogContent className="sm:max-w-[425px] mx-4 max-w-[calc(100vw-2rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-center sm:text-left">
              Luxury Item Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center sm:text-left">
              You are about to view details for a luxury item. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel 
              className="w-full sm:w-auto order-2 sm:order-1"
              onClick={() => setShowLuxuryDialog(false)}
            >
              No, Go Back
            </AlertDialogCancel>
            <AlertDialogAction 
              className="w-full sm:w-auto order-1 sm:order-2 bg-[#890707] hover:bg-[#a02020]"
              onClick={handleConfirmLuxuryView}
            >
              Yes, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
};
