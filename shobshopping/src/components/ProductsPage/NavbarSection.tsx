import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { mockCategories } from "../../lib/mock/mockCategories"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

// Use public logo to avoid bundler path/type issues
const logoPublic = "/logo.png"

// removed useCart usage per request
import { API } from "../../lib/api"

export default function Navbar() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  // local cart state (replaces useCart)
  const [cartItems, setCartItems] = useState<any[]>([])

  // Load cart either from backend (if authenticated) or localStorage (fallback)
  useEffect(() => {
    let mounted = true
    const loadCart = async () => {
      const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken")
      if (token) {
        try {
          const data = await API.getCart()
          const rawItems: any[] = Array.isArray(data) ? data : data.results ?? data.items ?? data.cart ?? []
          if (mounted) setCartItems(rawItems)
        } catch (err) {
          if (mounted) setCartItems([])
        }
      } else {
        const local = localStorage.getItem("cart")
        if (mounted) setCartItems(local ? JSON.parse(local) : [])
      }
    }
    loadCart()
    return () => {
      mounted = false
    }
  }, [])

  // Sum quantities: prefer top-level quantity, fallback to product.quantity
  const cartCount = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((sum, item) => {
      const q = item?.quantity ?? item?.qty ?? item?.product?.quantity ?? item?.product?.qty ?? 0
      return sum + (Number(q) || 0)
    }, 0)
  }, [cartItems])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "Deals", path: "/deals" },
  ]

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Dropdown state/refs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on Esc
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDropdownOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  function handleLogout() {
    try {
      sessionStorage.removeItem("accessToken")
      localStorage.removeItem("accessToken")
    } catch {}
    setIsDropdownOpen(false)
    navigate("/login")
  }

  // If you want role-aware dashboard routing, adjust here
  const dashboardPath =
    (profile?.role?.toLowerCase?.() === "seller" || profile?.user?.role?.toLowerCase?.() === "seller")
      ? "/seller-dashboard"
      : "/buyer-dashboard"

  return (
    <header
      className="fixed lg:sticky top-0 left-0 right-0 z-[9999] w-full backdrop-blur border-b border-gray-200"
      style={{ backgroundColor: "#eac5c857" }}
    >
      {/* Row 1: Logo and actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img src={logoPublic} alt="Logo" className="h-9" />
              <img src="/text_ss.png" alt="Logo" className="h-5 rounded-lg" />
            </Link>
          </div>

          {/* Center: Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-3">
            {/* Desktop Nav Links */}
            <div className="hidden lg:flex space-x-6 mr-4">
              {navLinks.map((link, index) =>
                link.name === "Categories" ? (
                  <div key={index} className="relative group flex items-center">
                    <button className="inline-flex items-center text-[#cd2733] hover:text-[#a11e29] font-medium text-sm transition-transform transform hover:scale-105">
                      {link.name}
                    </button>
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                      <ul className="py-2">
                        {mockCategories.slice(0, 6).map((cat, i) => (
                          <li key={i}>
                            <Link
                              to={`/categories/${encodeURIComponent(
                                cat.name.toLowerCase().replace(/\s+/g, "-")
                              )}`}
                              className="block px-4 py-2 text-sm text-[#cd2733] hover:bg-gray-100"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className="text-[#cd2733] hover:text-[#a11e29] font-medium text-sm transition-transform transform hover:scale-105"
                    style={{ zIndex: 10000 }}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Desktop Only: Wishlist */}
            <div className="hidden lg:block">
              <Button variant="ghost" size="sm" className="text-[#cd2733] hover:text-[#cd2733]">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Always visible: Cart with TOTAL items count */}
            <div className="relative">
              <Link to="/cart" aria-label="Go to cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#cd2733] hover:text-[#cd2733] relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span
                      className="
                        absolute -top-1 -right-1
                        inline-flex items-center justify-center
                        min-w-[18px] h-[18px] px-[5px]
                        rounded-full
                        bg-[#cd2733] text-white text-[11px] leading-none
                        font-semibold
                      "
                      aria-label={`${cartCount} items in cart`}
                    >
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Profile/Login section with dropdown */}
            {loading ? null : profile ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#cd2733] text-[#cd2733] hover:bg-[#cd2733]/10 bg-transparent flex items-center"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen((s) => !s)}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="max-w-[120px] truncate">
                    {profile?.name || profile?.user?.name || "User"}
                  </span>
                  <svg
                    className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    aria-label="Profile menu"
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[10000] focus:outline-none"
                  >
                    <div className="py-1">
                      <Link
                        to={dashboardPath}
                        role="menuitem"
                        className="block px-4 py-2 text-sm text-[#cd2733] hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/wishlist"
                        role="menuitem"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        role="menuitem"
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#cd2733] text-[#cd2733] hover:bg-[#cd2733]/10 bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Full-width search bar */}
      <div className="lg:hidden border-t border-gray-100" style={{ backgroundColor: "#eac5c857" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pb-6 w-full overflow-x-hidden">
          <div className="flex flex-col space-y-3 mt-4">
            {navLinks.map((link, index) =>
              link.name === "Categories" ? (
                <details key={index} className="group text-sm [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium mb-1">
                    {link.name}
                  </summary>
                  <ul className="pl-4 mt-1 space-y-1 text-gray-600">
                    {mockCategories.slice(0, 6).map((cat, i) => (
                      <li key={i}>
                        <Link
                          to={`/categories/${encodeURIComponent(cat.name.toLowerCase().replace(/\s+/g, "-"))}`}
                          onClick={() => setMobileOpen(false)}
                          className="block hover:text-blue-600"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 bg-white"
              />
            </div>
          </div>

          {/* Mobile: Cart & Wishlist */}
          <div className="mt-6 flex gap-4">
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center text-gray-700 hover:text-blue-600 space-x-2 text-sm relative"
              aria-label="Go to cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span
                    className="
                      absolute -top-2 -right-3
                      inline-flex items-center justify-center
                      min-w-[16px] h-[16px] px-[5px]
                      rounded-full
                      bg-[#cd2733] text-white text-[10px] leading-none
                      font-semibold
                    "
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center text-gray-700 hover:text-blue-600 space-x-2 text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
