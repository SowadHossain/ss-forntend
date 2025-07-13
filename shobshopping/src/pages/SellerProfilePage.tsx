import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Star, MapPin, Calendar, Award, MessageCircle, Heart, ShoppingCart } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

const seller = {
  name: "TechStore Pro",
  avatar: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=200&width=800",
  rating: 4.8,
  totalReviews: 1250,
  totalSales: 15420,
  joinDate: "2020-03-15",
  location: "San Francisco, CA",
  description:
    "We specialize in premium tech accessories and gadgets. Our mission is to provide high-quality products at competitive prices with exceptional customer service.",
  badges: ["Top Seller", "Fast Shipping", "Verified"],
  responseTime: "Within 2 hours",
  shippingTime: "1-2 business days",
}

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones Premium",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 128,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    price: 199.99,
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    freeShipping: false,
  },
  {
    id: 3,
    name: "USB-C Fast Charging Cable",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.6,
    reviews: 234,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 4,
    name: "Wireless Phone Charger",
    price: 39.99,
    rating: 4.4,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    inStock: false,
    freeShipping: true,
  },
  {
    id: 5,
    name: "Bluetooth Speaker Portable",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.7,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    freeShipping: true,
  },
  {
    id: 6,
    name: "Phone Camera Lens Kit",
    price: 29.99,
    rating: 4.3,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    inStock: true,
    freeShipping: false,
  },
]

const reviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-01-15",
    comment: "Excellent seller! Fast shipping and great product quality. Highly recommended!",
    product: "Wireless Bluetooth Headphones",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Amazing customer service. The seller responded quickly to my questions and the product arrived exactly as described.",
    product: "Smart Fitness Watch Pro",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 4,
    date: "2024-01-05",
    comment: "Good products and reasonable prices. Will definitely shop here again.",
    product: "USB-C Fast Charging Cable",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function SellerStorefront() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={seller.coverImage || "/placeholder.svg"}
          alt="Store cover"
          className="object-cover opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seller Profile */}
        <div className="relative -mt-16 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{seller.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{seller.name}</h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{seller.rating}</span>
                          <span className="ml-1">({seller.totalReviews.toLocaleString()} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {seller.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Joined {new Date(seller.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {seller.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="flex items-center">
                            <Award className="w-3 h-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Seller
                      </Button>
                      <Button variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Follow Store
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{seller.totalSales.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Sales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{products.length}</div>
              <div className="text-sm text-gray-600">Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{seller.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{seller.shippingTime}</div>
              <div className="text-sm text-gray-600">Shipping Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Store Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="about">About Store</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({seller.totalReviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
                      {product.freeShipping && (
                        <Badge variant="secondary" className="absolute bottom-2 left-2">
                          Free Shipping
                        </Badge>
                      )}
                    </div>

                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                      <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <Button className="w-full" disabled={!product.inStock} size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {seller.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{seller.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Store Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Store Rating:</span>
                        <span className="font-medium">{seller.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reviews:</span>
                        <span className="font-medium">{seller.totalReviews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-medium">{seller.totalSales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">{new Date(seller.joinDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Shipping & Policies</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">{seller.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Time:</span>
                        <span className="font-medium">{seller.shippingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return Policy:</span>
                        <span className="font-medium">30 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Warranty:</span>
                        <span className="font-medium">1-2 years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">Product: {review.product}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
