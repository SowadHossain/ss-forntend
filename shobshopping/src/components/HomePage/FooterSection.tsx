import React from "react"
import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 lg:px-8 pt-10 pb-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top: Branding and Sections */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ShobShopping ✨</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for amazing products and unbeatable deals! 🛍️
            </p>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <h3 className="font-semibold text-white mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/sellers" className="hover:text-white">Sellers</Link></li>
                <li><Link to="/deals" className="hover:text-white">Deals</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Account</h3>
              <ul className="space-y-1">
                <li><Link to="/auth/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/auth/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Connect</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-white">Twitter 🐦</a></li>
                <li><a href="#" className="hover:text-white">Instagram 📸</a></li>
                <li><a href="#" className="hover:text-white">Facebook 👥</a></li>
                <li><a href="#" className="hover:text-white">TikTok 🎵</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; 2025 ShobShopping. Made with 💜 for the next generation of shoppers!
        </div>
      </div>
    </footer>
  )
}
