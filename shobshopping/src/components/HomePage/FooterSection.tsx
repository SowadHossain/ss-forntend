import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import React from "react"
import { API } from "../../lib/api"

export default function FooterSection() {
  function useCategories() {
    const [categories, setCategories] = React.useState<any[]>([])

    React.useEffect(() => {
      API.getCategories().then(data => setCategories(data))
    }, [])

    return categories
  }

  // call the hook once and reuse the categories array
  const categories = useCategories()
  const splitIndex = Math.ceil(categories.length / 2)
  const leftCats = categories.slice(0, splitIndex)
  const rightCats = categories.slice(splitIndex)

  return (
    <footer className="bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-700 border-t border-red-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="ShobShopping" className="h-10 w-10 rounded-lg" />
              <img src="/text_ss.png" alt="ShobShopping" className="h-6 object-contain" />
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your trusted marketplace for quality products at unbeatable prices. 
              Discover millions of items from verified sellers worldwide.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-700">+880 1323-768642</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-700">support@shobshopping.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-gray-700">24/7 Customer Service</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
            {/* <div>
            <h3 className="font-semibold text-red-600 mb-4">Shop Categories</h3>
            <ul className="space-y-2 text-sm">
              {leftCats.map(category => (
              <li key={category.id}>
                <a
                href={`/products?categories=${encodeURIComponent(category.name)}`}
                className="text-gray-700 hover:text-red-600 transition-colors"
                >
                {category.name}
                </a>
              </li>
              ))}
            </ul>
            </div> */}

          {/* Customer Service */}
          <div>
            {/* {rightCats && rightCats.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-600 mb-2 text-sm">Categories</h4>
                <ul className="space-y-2 text-sm">
                  {rightCats.map(cat => (
                    <li key={`right-${cat.id}`}>
                      <a
                        href={`/products?categories=${encodeURIComponent(cat.name)}`}
                        className="text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            <h3 className="font-semibold text-red-600 mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/buyer-dashboard?tab=support" className="text-gray-700 hover:text-red-600 transition-colors">Help Center</a></li>
              <li><a href="/returns" className="text-gray-700 hover:text-red-600 transition-colors">Returns & Refunds</a></li>
              <li><a href="/shipping" className="text-gray-700 hover:text-red-600 transition-colors">Shipping Information</a></li>
              <li><a href="/contact" className="text-gray-700 hover:text-red-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="font-semibold text-red-600 mb-4">My Account</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="/login" className="text-gray-700 hover:text-red-600 transition-colors">Sign In</a></li>
              <li><a href="/buyer-dashboard" className="text-gray-700 hover:text-red-600 transition-colors">Dashboard</a></li>
              <li><a href="/buyer-dashboard?tab=wishlist" className="text-gray-700 hover:text-red-600 transition-colors">Wishlist</a></li>
            </ul>
            
          </div>

          <div>
            <h4 className="font-semibold text-red-600 mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/privacy" className="text-gray-600 hover:text-red-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-red-600 transition-colors">Terms of Service</a></li>
              <li><a href="/cookies" className="text-gray-600 hover:text-red-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Social */}
      <div className="border-t border-red-200 bg-red-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div
              className="flex items-center gap-4 select-none"
              draggable={false}
              style={{ userSelect: "none" }}
              onCopy={e => e.preventDefault()}
              onContextMenu={e => e.preventDefault()}
            >
              <span className="text-sm text-gray-600">Powered by</span>
              <img
              src="https://www.ucb.com.bd/assets/img/logo.png"
              alt="UCB Logo"
              className="h-8"
              draggable={false}
              style={{ userSelect: "none" }}
              onCopy={e => e.preventDefault()}
              onContextMenu={e => e.preventDefault()}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Follow Us:</span>
              <div className="flex space-x-3">
                <a href="#" className="bg-white hover:bg-[#1877F3] hover:text-white p-2 rounded-lg shadow-sm border border-gray-200 transition-colors text-[#1877F3]">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="bg-white hover:bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] hover:text-white p-2 rounded-lg shadow-sm border border-gray-200 transition-colors text-[#d6249f]">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="bg-white hover:bg-[#1DA1F2] hover:text-white p-2 rounded-lg shadow-sm border border-gray-200 transition-colors text-[#1DA1F2]">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      {/* <div className="border-t border-red-200 bg-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>
          &copy; 2025 ShobShopping, Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-2 md:mt-0">
          <span className="flex items-center gap-2 text-green-600 font-medium">
            <MapIcon size={18} strokeWidth={2} /> Nationwide shipping
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <Zap size={16} /> Lightning-fast delivery
          </span>
          <span className="flex items-center gap-1 text-yellow-600">
            <Lock size={16} /> 100% secure checkout
          </span>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  )
}
