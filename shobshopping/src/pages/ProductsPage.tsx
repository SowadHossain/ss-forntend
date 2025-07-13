import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { Label } from "../components/ui/label"
import { Slider } from "../components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 128,
    image: "/placeholder.svg?height=300&width=300",
    seller: "TechStore Pro",
    category: "Electronics",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    seller: "FitTech",
    category: "Electronics",
    inStock: true,
    freeShipping: false,
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.3,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    seller: "EcoFashion",
    category: "Fashion",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    price: 299.99,
    rating: 4.9,
    reviews: 45,
    image: "/placeholder.svg?height=300&width=300",
    seller: "PhotoGear",
    category: "Electronics",
    inStock: false,
    freeShipping: true,
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    price: 39.99,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    seller: "FitLife",
    category: "Sports",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    price: 29.99,
    rating: 4.4,
    reviews: 92,
    image: "/placeholder.svg?height=300&width=300",
    seller: "HomeEssentials",
    category: "Home & Garden",
    inStock: true,
    freeShipping: false,
  },
]

const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"]
const sellers = ["TechStore Pro", "FitTech", "EcoFashion", "PhotoGear", "FitLife", "HomeEssentials"]

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [searchQuery, setSearchQuery] = useState("")

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleSellerChange = (seller: string, checked: boolean) => {
    if (checked) {
      setSelectedSellers([...selectedSellers, seller])
    } else {
      setSelectedSellers(selectedSellers.filter((s) => s !== seller))
    }
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-white flex items-center">💰 Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-white flex items-center">📂 Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
              />
              <Label htmlFor={category} className="text-sm text-gray-300">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sellers */}
      <div>
        <h3 className="font-semibold mb-3 text-white flex items-center">🏪 Sellers</h3>
        <div className="space-y-2">
          {sellers.map((seller) => (
            <div key={seller} className="flex items-center space-x-2">
              <Checkbox
                id={seller}
                checked={selectedSellers.includes(seller)}
                onCheckedChange={(checked) => handleSellerChange(seller, checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
              />
              <Label htmlFor={seller} className="text-sm text-gray-300">
                {seller}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div>
        <h3 className="font-semibold mb-3 text-white flex items-center">⚡ Features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="free-shipping"
              className="border-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
            />
            <Label htmlFor="free-shipping" className="text-sm text-gray-300">
              🚚 Free Shipping
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              className="border-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
            />
            <Label htmlFor="in-stock" className="text-sm text-gray-300">
              ✅ In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              className="border-gray-600 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-pink-500"
            />
            <Label htmlFor="on-sale" className="text-sm text-gray-300">
              🔥 On Sale
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-xl"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-pink-400"
          >
            <Heart className="w-4 h-4" />
          </Button>
          {product.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
              🔥 Sale
            </Badge>
          )}
          {product.freeShipping && (
            <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              🚚 Free Ship
            </Badge>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-400 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-lg font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <span className={`text-sm ${product.inStock ? "text-green-400" : "text-red-400"}`}>
            {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-3">by {product.seller}</p>

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          disabled={!product.inStock}
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🔥 Products
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-white">🎛️ Filters</h2>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                  Clear All
                </Button>
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-gray-800 border-gray-700">
                <SheetHeader>
                  <SheetTitle className="text-white">🎛️ Filters</SheetTitle>
                  <SheetDescription className="text-gray-400">Refine your product search</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-sm text-gray-400">✨ Showing {products.length} amazing results</div>

            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled className="border-gray-600 text-gray-400">
                  Previous
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">1</Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  2
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  3
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
