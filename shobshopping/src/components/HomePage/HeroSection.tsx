import { Shield, Truck } from "lucide-react"
import React, { useEffect, useRef } from "react"
import { mockAds } from "../../lib/mock/mockAds"

// Static banners data
const staticBanners = [
  {
    id: 1,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
    icon: Truck,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Premium Support",
    subtitle: "24/7 Customer Care",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
    icon: Shield,
    color: "from-green-500 to-green-600"
  }
]

export default function HeroSection() {
  const carouselRef = useRef(null)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  // store interval id so we can reset it on user interaction
  const intervalRef = useRef<number | null>(null)
  const AUTO_SLIDE_MS = 5000

  const startAutoSlide = () => {
    // clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % mockAds.length)
    }, AUTO_SLIDE_MS)
  }

  const resetAutoSlide = () => {
    // restart the timer so auto-advance waits full period after user action
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startAutoSlide()
  }

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const goToSlide = (index) => {
  setCurrentSlide(index)
  resetAutoSlide()
  }

  const nextSlide = () => {
  setCurrentSlide(prev => (prev + 1) % mockAds.length)
  resetAutoSlide()
  }

  const prevSlide = () => {
  setCurrentSlide(prev => (prev - 1 + mockAds.length) % mockAds.length)
  resetAutoSlide()
  }

  return (
    <section className="pt-20 relative py-6 md:py-10 px-4 sm:px-6 lg:px-8 md:bg-gradient-to-br md:from-red-50 md:via-white md:to-red-50">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: 2 columns (bigger + smaller with 2 rows) */}
        {/* Mobile: 1 column, 2 rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
          
          {/* Main Carousel - Desktop: spans 2 columns, Mobile: full width */}
          <div className="lg:col-span-2 relative">
            <div className="relative w-full h-48 sm:h-64 lg:h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100 hover:shadow-2xl transition-all duration-500">
              {/* Carousel Images */}
              <div className="relative w-full h-full overflow-hidden">
                {mockAds.map((ad, index) => (
                  <div
                    key={ad.id}
                    className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                      index === currentSlide ? 'translate-x-0' : 
                      index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                    }`}
                  >
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Feature Badges */}
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
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {mockAds.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Static Banners - Desktop: 1 column with 2 rows, Mobile: 2 columns */}
          <div className="hidden lg:grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            {staticBanners.map((banner, index) => {
              const IconComponent = banner.icon
              return (
                <div
                  key={banner.id}
                  className="relative bg-white rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden border border-red-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-32 lg:h-full min-h-[120px] lg:min-h-[235px]">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats/Features */}
        {/* <div className="mt-8 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-xl lg:text-2xl font-bold text-red-600 mb-1">10M+</div>
            <div className="text-xs lg:text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-xl lg:text-2xl font-bold text-red-600 mb-1">50K+</div>
            <div className="text-xs lg:text-sm text-gray-600">Products</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-xl lg:text-2xl font-bold text-red-600 mb-1">195+</div>
            <div className="text-xs lg:text-sm text-gray-600">Countries</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-300">
            <div className="text-xl lg:text-2xl font-bold text-red-600 mb-1">24/7</div>
            <div className="text-xs lg:text-sm text-gray-600">Support</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
