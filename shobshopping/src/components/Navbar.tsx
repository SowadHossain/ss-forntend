import { ShoppingCart, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/logo.png"; // Adjust the path as necessary to your logo image
import { useCart } from "../context/CartContext";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu";
  
import { API } from "../lib/api";
import { hasConsent, setCookie } from "../lib/cookies";

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken")
    if (token) {
      API.getProfile()
        .then((data) => setProfile(data))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={"/assets/logo.png"} alt="Logo" className="h-10 w-auto mr-2" />
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center">
            <NavigationMenuItem>
              <Link to="/" className="text-[#cd2733] hover:text-[#cd2733] px-3 py-2 text-sm font-medium flex items-center">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/products" className="text-[#cd2733] hover:text-[#cd2733] px-3 py-2 text-sm font-bold flex items-center">
                Products
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <NavigationMenuTrigger className="text-[#cd2733] hover:text-[#cd2733] px-3 py-2 text-sm font-bold bg-transparent border-none shadow-none flex items-center">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent style={{ position: 'absolute', left: 0, top: '100%', marginTop: '0.5rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: '160px', zIndex: 100 }}>
                <NavigationMenuLink asChild>
                  <Link to="/categories/electronics" onClick={() => { if (hasConsent()) setCookie('last_category','electronics') }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Electronics</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/categories/fashion" onClick={() => { if (hasConsent()) setCookie('last_category','fashion') }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Fashion</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/categories/home" onClick={() => { if (hasConsent()) setCookie('last_category','home') }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/categories/sports" onClick={() => { if (hasConsent()) setCookie('last_category','sports') }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sports</Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/accounts" className="text-[#cd2733] hover:text-[#cd2733] px-3 py-2 text-sm font-bold flex items-center">
                My Account
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/cart" className="flex items-center text-[#cd2733] hover:text-[#cd2733] px-3 py-2 text-sm font-bold relative">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#cd2733] text-white rounded-full px-2 py-0.5 text-xs font-bold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                )}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Profile/Login section */}
        {loading ? null : profile ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#cd2733]">
              {profile?.name || profile?.user?.name || "User"}
            </span>
            <Link to="/accounts" className="text-sm text-[#cd2733] hover:text-[#cd2733] flex items-center font-bold">
              <User2 className="w-4 h-4 mr-1" />
              Profile
            </Link>
          </div>
        ) : (
          <Link to="/login" className="text-sm text-[#cd2733] hover:text-[#cd2733] flex items-center font-bold">
            <User2 className="w-4 h-4 mr-1" />
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
