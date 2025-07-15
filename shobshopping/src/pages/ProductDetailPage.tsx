import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Navbar from "../components/Navbar";

const product = {
  id: 1,
  name: "Wireless Bluetooth Headphones Premium",
  price: 79.99,
  originalPrice: 99.99,
  rating: 4.5,
  reviews: 128,
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ],
  seller: {
    name: "TechStore Pro",
    rating: 4.8,
    totalSales: 15420,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  category: "Electronics",
  inStock: true,
  stockCount: 25,
  freeShipping: true,
  description:
    "Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding for all-day wear.",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Premium comfort padding",
    "Bluetooth 5.0 connectivity",
    "Built-in microphone",
    "Foldable design",
  ],
  specifications: {
    Brand: "TechStore Pro",
    Model: "TSP-WH-001",
    Connectivity: "Bluetooth 5.0",
    "Battery Life": "30 hours",
    "Charging Time": "2 hours",
    Weight: "250g",
    Warranty: "2 years",
  },
  variants: {
    color: ["Black", "White", "Blue"],
    size: ["Standard"],
  },
};

const reviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent sound quality and very comfortable to wear for long periods. The noise cancellation works great!",
    helpful: 12,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Good headphones overall. Battery life is impressive. Only minor complaint is they can feel a bit tight after extended use.",
    helpful: 8,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike R.",
    rating: 5,
    date: "2024-01-05",
    comment:
      "Best headphones I've owned. Great value for money and the seller shipped very quickly.",
    helpful: 15,
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-700 mb-8">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">
              Products
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category.toLowerCase()}`}
              className="hover:text-blue-600"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title & Rating */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-700">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <Badge className="bg-red-500">
                        Save $
                        {(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>
                {product.freeShipping && (
                  <p className="text-green-600 text-sm mt-2 flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Free shipping on this item
                  </p>
                )}
              </div>

              {/* Seller Info */}
              <Card className="mb-6 border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={product.seller.avatar} />
                        <AvatarFallback>
                          {product.seller.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          to={`/sellers/${product.seller.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {product.seller.name}
                        </Link>
                        <div className="flex items-center text-sm text-gray-700">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {product.seller.rating} •{" "}
                          {product.seller.totalSales.toLocaleString()} sales
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Variants */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color: {selectedColor}
                  </label>
                  <div className="flex space-x-2">
                    {product.variants.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedColor === color
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(val) => setQuantity(parseInt(val))}
                  >
                    <SelectTrigger className="w-24 bg-white border border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {[...Array(Math.min(10, product.stockCount))].map(
                        (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.stockCount} items available
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-6">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <div className="flex space-x-4">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Heart className="w-5 h-5 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center">
                  <Shield className="w-6 h-6 text-blue-600 mb-2" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-6 h-6 text-blue-600 mb-2" />
                  <span>30 Day Returns</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-6 h-6 text-blue-600 mb-2" />
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
