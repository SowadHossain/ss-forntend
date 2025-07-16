// src/components/HomePage/HeroSection.tsx
import React from "react"
import { Button } from "../../components/ui/button"
import { TrendingUp, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"


export default function HeroSection() {
  return (
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
  )
}
