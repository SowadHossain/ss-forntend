import React from "react"
import { Mail, Phone, MapPin, CreditCard, Shield, Truck, RotateCcw } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Exclusive Deals
            </h2>
            <p className="text-gray-400 mb-6">
              Get notified about flash sales, new arrivals, and exclusive discounts delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-900/20 p-3 rounded-full mb-2">
                <Truck className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Free Shipping</h4>
              <p className="text-xs text-gray-400">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-900/20 p-3 rounded-full mb-2">
                <RotateCcw className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-400">30-day return policy</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/20 p-3 rounded-full mb-2">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-400">SSL encrypted checkout</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-900/20 p-3 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-orange-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Best Prices</h4>
              <p className="text-xs text-gray-400">Price match guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="ShobShopping" className="h-10 w-10 rounded-lg" />
              <span className="text-xl font-bold text-white">ShobShopping</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted marketplace for quality products at unbeatable prices. 
              Discover millions of items from verified sellers worldwide.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>1-800-SHOB-SHOP</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>support@shobshopping.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>24/7 Customer Service</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Shop Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/electronics" className="hover:text-white transition-colors">Electronics & Gadgets</a></li>
              <li><a href="/fashion" className="hover:text-white transition-colors">Fashion & Apparel</a></li>
              <li><a href="/home" className="hover:text-white transition-colors">Home & Garden</a></li>
              <li><a href="/sports" className="hover:text-white transition-colors">Sports & Outdoors</a></li>
              <li><a href="/beauty" className="hover:text-white transition-colors">Beauty & Health</a></li>
              <li><a href="/books" className="hover:text-white transition-colors">Books & Media</a></li>
              <li><a href="/deals" className="hover:text-white transition-colors">Today's Deals</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/track-order" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="/shipping" className="hover:text-white transition-colors">Shipping Information</a></li>
              <li><a href="/size-guide" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/live-chat" className="hover:text-white transition-colors">Live Chat Support</a></li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">My Account</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="/account/login" className="hover:text-white transition-colors">Sign In</a></li>
              <li><a href="/account/register" className="hover:text-white transition-colors">Create Account</a></li>
              <li><a href="/account/orders" className="hover:text-white transition-colors">Order History</a></li>
              <li><a href="/account/wishlist" className="hover:text-white transition-colors">Wishlist</a></li>
              <li><a href="/account/addresses" className="hover:text-white transition-colors">Address Book</a></li>
            </ul>
            
            <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Social */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <span className="text-sm text-gray-400">Accepted Payment Methods:</span>
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-red-600">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-800">AMEX</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-yellow-600">PAYPAL</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-green-600">APPLE PAY</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow Us:</span>
              <div className="flex space-x-3">
                <a href="#" className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="bg-slate-800 hover:bg-pink-600 p-2 rounded-lg transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.085.338-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z"/></svg>
                </a>
                <a href="#" className="bg-slate-800 hover:bg-blue-800 p-2 rounded-lg transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
                <a href="#" className="bg-slate-800 hover:bg-red-600 p-2 rounded-lg transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      {/* <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              &copy; 2025 ShobShopping, Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-2 md:mt-0">
              <span>🌍 Ship to 195+ countries</span>
              <span>⚡ Lightning-fast delivery</span>
              <span>🔒 100% secure checkout</span>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  )
}
