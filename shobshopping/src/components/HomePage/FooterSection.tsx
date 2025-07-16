// src/components/HomePage/FooterSection.tsx
import React from "react"
import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ShobShopping ✨</span>
            </div>
            <p className="text-gray-400">Your ultimate destination for amazing products and unbeatable deals! 🛍️</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/sellers" className="hover:text-white">Sellers</Link></li>
              <li><Link to="/deals" className="hover:text-white">Deals</Link></li>
              <li><Link to="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/auth/login" className="hover:text-white">Login</Link></li>
              <li><Link to="/auth/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Twitter 🐦</a></li>
              <li><a href="#" className="hover:text-white">Instagram 📸</a></li>
              <li><a href="#" className="hover:text-white">Facebook 👥</a></li>
              <li><a href="#" className="hover:text-white">TikTok 🎵</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ShobShopping. Made with 💜 for the next generation of shoppers!</p>
        </div>
      </div>
    </footer>
  )
}
