import { ChevronDown, Menu, ShoppingCart, User, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API } from "../../lib/api"
import { Button } from "../ui/button"

// Use public logo to avoid bundler path/type issues
const logoPublic = "/logo.png"

interface Category {
  id: string | number
  name: string
  slug?: string
  // Add other category fields as needed
}

interface CartItem {
  id?: string | number
  quantity?: number
  qty?: number
  product?: {
    quantity?: number
    qty?: number
  }
}

interface Profile {
  id?: string | number
  name?: string
  email?: string
  role?: string
  user?: {
    name?: string
    role?: string
  }
}

export default function Navbar() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement | null>(null)
  const suggestionsDebounce = useRef<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Local cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Dropdown states
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false)
  
  const profileDropdownRef = useRef<HTMLDivElement | null>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement | null>(null)

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories", hasDropdown: true },
    { name: "Deals", path: "/deals" },
  ]

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await API.getCategories()
        // Handle different API response structures
        const categoryList = Array.isArray(data) 
          ? data 
          : data.results ?? data.categories ?? data.data ?? []
        setCategories(categoryList.slice(0, 8)) // Limit to 8 categories
      } catch (error) {
        console.error("Failed to load categories:", error)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Load cart data
  useEffect(() => {
    let mounted = true
    const loadCart = async () => {
      const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken")
      if (token) {
        try {
          const data = await API.getCart()
          const rawItems: CartItem[] = Array.isArray(data) 
            ? data 
            : data.results ?? data.items ?? data.cart ?? []
          if (mounted) setCartItems(rawItems)
        } catch (err) {
          console.error("Failed to load cart:", err)
          if (mounted) {
            // Fallback to localStorage
            const local = localStorage.getItem("cart")
            setCartItems(local ? JSON.parse(local) : [])
          }
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

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken")
      if (token) {
        try {
          const data = await API.getProfile()
          setProfile(data)
        } catch (error) {
          console.error("Failed to load profile:", error)
          setProfile(null)
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  // Calculate cart count
  const cartCount = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((sum, item) => {
      const q = item?.quantity ?? item?.qty ?? item?.product?.quantity ?? item?.product?.qty ?? 0
      return sum + (Number(q) || 0)
    }, 0)
  }, [cartItems])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(e.target as Node)) {
        setIsCategoriesDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdowns on Esc
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsProfileDropdownOpen(false)
        setIsCategoriesDropdownOpen(false)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // ProductsPage expects `query` param
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`)
      setMobileOpen(false)
    }
  }, [searchQuery, navigate])

  // Debounced suggestions for search input
  useEffect(() => {
    // clear previous debounce
    if (suggestionsDebounce.current) {
      window.clearTimeout(suggestionsDebounce.current)
      suggestionsDebounce.current = null
    }

    const q = searchQuery.trim()
    if (!q) {
      setSuggestions([])
      setShowSuggestions(false)
      setLoadingSuggestions(false)
      return
    }

    setLoadingSuggestions(true)
    // debounce 300ms
    suggestionsDebounce.current = window.setTimeout(async () => {
      try {
        const data = await API.getProducts(q)
        const list: any[] = Array.isArray(data) ? data : data.results ?? data.data ?? []
        setSuggestions(list.slice(0, 8))
        setShowSuggestions(true)
      } catch (err) {
        console.error("Failed to load product suggestions:", err)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300)

    return () => {
      if (suggestionsDebounce.current) {
        window.clearTimeout(suggestionsDebounce.current)
        suggestionsDebounce.current = null
      }
    }
  }, [searchQuery])

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle logout
  const handleLogout = useCallback(() => {
    try {
      sessionStorage.removeItem("accessToken")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("cart") // Clear local cart on logout
    } catch (error) {
      console.error("Logout error:", error)
    }
    setProfile(null)
    setCartItems([])
    setIsProfileDropdownOpen(false)
    navigate("/login")
  }, [navigate])

  // Generate category URL
  // const getCategoryUrl = useCallback((category: Category) => {
  //   const slug = category.name
  //   return `/products?categories=${encodeURIComponent(slug)}`
  // }, [])

  // Determine dashboard path based on user role
  const dashboardPath = useMemo(() => {
    const role = profile?.role?.toLowerCase() || profile?.user?.role?.toLowerCase()
    return role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"
  }, [profile])

  return (
    <header
      className="fixed lg:sticky top-0 left-0 right-0 z-[9999] w-full backdrop-blur-sm bg-gradient-to-br from-red-50 via-white to-red-50 border-b border-red-100 shadow-sm text-gray-700"
    >
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center space-x-3">
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img src={logoPublic} alt="Logo" className="h-8 md:h-10 w-auto" />
              <img src="/text_ss.png" alt="Site Name" className="block lg:block h-5 md:h-6 w-auto rounded" />
            </Link>
          </div>

          {/* Center: Desktop Navigation (centered) */}
          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex items-center space-x-1">
              {navLinks.map((link, index) =>
                link.hasDropdown ? (
                  <div key={index} className="relative" ref={categoriesDropdownRef}>
                    <button
                      className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors rounded-md hover:bg-red-50"
                      onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                      aria-haspopup="menu"
                      aria-expanded={isCategoriesDropdownOpen}
                    >
                      {link.name}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCategoriesDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-2 max-h-80 overflow-y-auto">
                          {loadingCategories ? (
                            <div className="px-4 py-3 text-sm text-gray-500">Loading categories...</div>
                          ) : categories.length > 0 ? (
                            <>
                              {categories.map((category, i) => (
                                // <Link
                                //   key={category.id || i}
                                //   to={getCategoryUrl(category)}
                                //   className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                //   onClick={() => setIsCategoriesDropdownOpen(false)}
                                // >
                                //   {category.name}
                                // </Link>
                                <a
                                  href={`/products?categories=${encodeURIComponent(category.name)}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  onClick={() => setIsCategoriesDropdownOpen(false)}
                                >
                                  {category.name}
                                </a>
                              ))}
                            </>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">No categories available</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className="px-3 py-2 text-gray-700 hover:text-red-600 font-medium text-sm transition-colors rounded-md hover:bg-red-50"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1">
            {/* Cart */}
            <Link
              to="/cart"
              className="hidden md:inline-flex lg:inline-flex relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label={`View cart (${cartCount} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile/Login */}
            {loading ? (
              <div className="w-20 h-9 bg-gray-100 rounded-md animate-pulse"></div>
            ) : profile ? (
              <div className="relative ml-2" ref={profileDropdownRef}>
                <button
                  className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 rounded-md transition-colors bg-white"
                  aria-haspopup="menu"
                  aria-expanded={isProfileDropdownOpen}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="max-w-[120px] truncate text-sm">
                    {profile?.name || profile?.user?.name || "User"}
                  </span>
                  <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000]">
                    <div className="py-1">
                      <Link
                        to={dashboardPath}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/buyer-dashboard?tab=orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/buyer-dashboard?tab=wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <Link
                        to="/buyer-dashboard?tab=profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <div className="border-t border-gray-100">
                        <button
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Ad */}
      {/* <div
        className="lg:hidden border-t border-gray-100 bg-white/90 backdrop-blur-sm overflow-hidden"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
          style={{
            display: "inline-block",
            animation: "scroll 15s linear infinite",
          }}
        >
          <span className="font-bold text-red-600">Welcome to Shob Shopping!</span>
          <span className="mx-2 text-green-600">Enjoy your shopping experience!</span>
          <span className="mx-2 text-blue-600">Discover amazing deals every day!</span>
        </div>

        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div> */}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link, index) =>
                link.hasDropdown ? (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-2 text-gray-700 hover:text-red-600 font-medium list-none">
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pl-4 mt-2 space-y-1">
                      {loadingCategories ? (
                        <div className="text-sm text-gray-500 py-2">Loading...</div>
                      ) : categories.length > 0 ? (
                        categories.map((category, i) => (
                          // <Link
                          //   key={category.id || i}
                          //   to={getCategoryUrl(category)}
                          //   onClick={() => setMobileOpen(false)}
                          //   className="block py-2 text-gray-600 hover:text-red-600 text-sm"
                          // >
                          //   {category.name}
                          // </Link>
                          <a
                            key={category.id || i}
                            href={`/products?categories=${encodeURIComponent(category.name)}`}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-gray-600 hover:text-red-600 text-sm"
                          >
                            {category.name}
                          </a>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 py-2">No categories available</div>
                      )}
                      {/* <Link
                        to="/categories"
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        View All Categories →
                      </Link> */}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-gray-700 hover:text-red-600 font-medium"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                  aria-label={`View cart (${cartCount} items)`}
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>

                {/* <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-500"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
