import React, { useRef, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../components/ui/carousel"
import { mockAds } from "../../lib/mock/mockAds"
import { Link } from "react-router-dom"
import { ArrowRight, Star, Shield, Truck } from "lucide-react"

export default function HeroSection() {
  const carouselApiRef = useRef<any>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselApiRef.current && typeof carouselApiRef.current.scrollNext === "function") {
        carouselApiRef.current.scrollNext()
      }
    }, 5000) // Slower transition for better UX
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-red-500" />
            <span>Secure Shopping</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-red-500" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-red-500" />
            <span>4.8+ Rating</span>
          </div>
          <div className="text-red-600 font-medium">
            🔥 Limited Time Offers
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          <Carousel 
            className="w-full" 
            setApi={api => (carouselApiRef.current = api)}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {mockAds.map((ad, index) => (
                <CarouselItem key={ad.id} className="flex items-stretch">
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full border border-red-100 hover:shadow-2xl transition-all duration-500">
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-64 lg:h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      {/* Overlay Badge */}
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                      {index === 0 && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          50% OFF 🔥
                        </div>
                      )}
                      {index === 1 && (
                        <div className="absolute top-4 right-4 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                          NEW ✨
                        </div>
                      )}
                      {index === 2 && (
                        <div className="absolute top-4 right-4 bg-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                          EXCLUSIVE 👑
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-25 to-transparent opacity-30"></div>
                      
                      <div className="relative z-10">
                        {/* Category Tag */}
                        <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium mb-4">
                          {index === 0 ? "Summer Sale" : index === 1 ? "New Arrivals" : "Exclusive Deals"}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                          {ad.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
                          {ad.description}
                        </p>

                        {/* Features/Benefits */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            ✓ Best Price
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            ✓ Fast Delivery
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            ✓ Easy Returns
                          </span>
                        </div>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            to={ad.link}
                            className="group inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          >
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                          
                          <Link
                            to="/explore"
                            className="inline-flex items-center justify-center border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-red-50"
                          >
                            {index === 2 ? "Join Now" : "View All"}
                          </Link>
                        </div>

                        {/* Price/Discount Info - Show for Summer Sale */}
                        {index === 0 && (
                          <div className="mt-6 flex items-center space-x-3">
                            <span className="text-2xl font-bold text-red-600">
                              Up to 50% OFF
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                              LIMITED TIME
                            </span>
                          </div>
                        )}
                        
                        {/* Member Discount for Exclusive Deals */}
                        {index === 2 && (
                          <div className="mt-6 flex items-center space-x-3">
                            <span className="text-2xl font-bold text-red-600">
                              Extra Discounts
                            </span>
                            <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm font-bold">
                              MEMBERS ONLY
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation */}
            <CarouselPrevious className="left-4 bg-white/90 border-red-200 hover:bg-white hover:border-red-300 text-red-600" />
            <CarouselNext className="right-4 bg-white/90 border-red-200 hover:bg-white hover:border-red-300 text-red-600" />
          </Carousel>
        </div>

        {/* Bottom Stats/Features */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="text-2xl font-bold text-red-600 mb-1">10M+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="text-2xl font-bold text-red-600 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="text-2xl font-bold text-red-600 mb-1">195+</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="text-2xl font-bold text-red-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
