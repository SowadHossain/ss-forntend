import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { mockCategories } from "../../lib/mock/mockCategories";
import SearchDropdown from "../common/SearchDropdown";

type Product = {
  id: number;
  name: string;
  image: string;
  category?: string;
};

interface NavbarSectionProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  products?: Product[];
}

export default function NavbarSection({
  searchQuery,
  setSearchQuery,
  products = [],
}: NavbarSectionProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const cartCount = 3;
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "Deals", path: "/deals" },
  ];

  const handleProductSelect = (product: Product) => {
    navigate(`/products?query=${encodeURIComponent(product.name)}`);
    setSearchQuery?.("");
    setMobileOpen(false); // close mobile menu on select
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + mobile menu toggle */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-gray-600 hover:text-blue-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShobShopping ✨
              </span>
            </Link>
          </div>

          {/* Center: Search (desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products... 🔍"
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
              {searchQuery?.trim() && products.length > 0 && (
                <SearchDropdown
                  products={products}
                  query={searchQuery}
                  onSelect={handleProductSelect}
                />
              )}
            </div>
          </div>

          {/* Right: Icons + desktop nav */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex space-x-6 mr-4">
              {navLinks.map((link, index) =>
                link.name === "Categories" ? (
                  <div key={index} className="relative group">
                    <button className="text-gray-600 hover:text-blue-600 font-medium text-sm">
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
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                    className="text-gray-600 hover:text-blue-600 font-medium text-sm"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <Heart className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </div>

            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pb-6 z-50">
          <div className="flex flex-col space-y-3 mt-4">
            {navLinks.map((link, index) =>
              link.name === "Categories" ? (
                <details key={index} className="group text-sm">
                  <summary className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium mb-1">
                    {link.name}
                  </summary>
                  <ul className="pl-4 mt-1 space-y-1 text-gray-600">
                    {mockCategories.slice(0, 6).map((cat, i) => (
                      <li key={i}>
                        <Link
                          to={`/categories/${encodeURIComponent(
                            cat.name.toLowerCase().replace(/\s+/g, "-")
                          )}`}
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

          {/* Mobile search input + dropdown */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery ?? ""}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-200 bg-white"
            />
            {searchQuery?.trim() && products.length > 0 && (
              <SearchDropdown
                products={products}
                query={searchQuery}
                onSelect={handleProductSelect}
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
