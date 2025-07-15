import React from "react"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  } from "./ui/navigation-menu"
  import { Link } from "react-router-dom"
  import { ShoppingCart, User2 } from "lucide-react"
  
  export default function Navbar() {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">ShobShopping</div>
  
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Products
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/accounts" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  My Account
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Cart
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
  
          <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600 flex items-center">
            <User2 className="w-4 h-4 mr-1" />
            Login
          </Link>
        </div>
      </header>
    )
  }
  