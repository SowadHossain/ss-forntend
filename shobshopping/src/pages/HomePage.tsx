import React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Star, Search, ShoppingCart, User, Heart, Zap, TrendingUp, Shield, Truck } from "lucide-react"
import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "Gaming Laptop Pro Max 🎮",
    price: 1299.99,
    originalPrice: 1599.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 234,
    seller: "TechZone",
    badge: "🔥 Hot Deal",
  },
  {
    id: 2,
    name: "Wireless Earbuds Elite ✨",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 156,
    seller: "AudioMax",
    badge: "⚡ Fast Ship",
  },
  {
    id: 3,
    name: "Smart Watch Series X 📱",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 89,
    seller: "WearTech",
    badge: "🆕 New",
  },
  {
    id: 4,
    name: "4K Webcam Ultra HD 📹",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 67,
    seller: "StreamGear",
    badge: "💎 Premium",
  },
]

const categories = [
  { name: "Electronics 📱", count: "2.5k", color: "from-blue-400 to-purple-500" },
  { name: "Fashion 👕", count: "1.8k", color: "from-pink-400 to-red-500" },
  { name: "Home & Garden 🏠", count: "1.2k", color: "from-green-400 to-teal-500" },
  { name: "Sports 🏃", count: "950", color: "from-orange-400 to-yellow-500" },
  { name: "Books 📚", count: "750", color: "from-indigo-400 to-blue-500" },
  { name: "Toys 🧸", count: "680", color: "from-purple-400 to-pink-500" },
]

const topSellers = [
  { name: "TechZone", rating: 4.9, sales: "10k+", image: "/placeholder.svg?height=60&width=60" },
  { name: "AudioMax", rating: 4.8, sales: "8.5k+", image: "/placeholder.svg?height=60&width=60" },
  { name: "WearTech", rating: 4.7, sales: "7.2k+", image: "/placeholder.svg?height=60&width=60" },
  { name: "StreamGear", rating: 4.9, sales: "6.8k+", image: "/placeholder.svg?height=60&width=60" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShopVibe ✨
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for products, brands, or sellers... 🔍"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="ml-1 bg-red-500 text-white">3</Badge>
              </Button>
              <Link to="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shop Smarter
              </span>
              <br />
              <span className="text-gray-800">Live Better ✨</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing products from trusted sellers worldwide. Get the best deals, fastest shipping, and
              premium quality! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Start Shopping 🛍️
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Now 📈
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category 🛒</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}
                  >
                    {category.name.split(" ")[1]}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name.split(" ")[0]}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products 🌟</h2>
            <p className="text-gray-600">Handpicked deals just for you!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 bg-white"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                      {product.badge}
                    </Badge>
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
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-800">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* Top Sellers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Top Sellers 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSellers.map((seller, index) => (
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

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose ShopVibe? 💫</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Shopping 🔒</h3>
              <p className="text-gray-600">
                Your data and payments are always protected with enterprise-grade security.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery 🚚</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly with our network of trusted shipping partners.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Guaranteed ⭐</h3>
              <p className="text-gray-600">Every product is verified by our quality team before reaching you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShopVibe ✨</span>
              </div>
              <p className="text-gray-400">Your ultimate destination for amazing products and unbeatable deals! 🛍️</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/products" className="hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/sellers" className="hover:text-white">
                    Sellers
                  </Link>
                </li>
                <li>
                  <Link to="/deals" className="hover:text-white">
                    Deals
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/auth/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="hover:text-white">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-white">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter 🐦
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram 📸
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Facebook 👥
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    TikTok 🎵
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShopVibe. Made with 💜 for the next generation of shoppers!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
