import { Building, Files, Filter, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useCart } from "../context/CartContext";
import { API } from "../lib/api";
import { hasConsent, readCookie, setCookie } from "../lib/cookies";

import FooterSection from "../components/HomePage/FooterSection";
import BreadcrumbAndTags from "../components/ProductsPage/BreadcrumbAndTags";
import FilterSidebar from "../components/ProductsPage/FilterSidebar";
import NavbarSection from "../components/ProductsPage/NavbarSection";
import ProductGrid from "../components/ProductsPage/ProductGrid";
import Pagination from "../components/common/Pagination";
import SubNavbar from "../components/common/SubNavbar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  seller: string;
  category?: { name: string };
  tags?: { name: string }[];
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
}

export default function ProductsPage() {
  // View and filtering states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // API data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived seller options from products
  const [sellerOptions, setSellerOptions] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isAuthenticated = !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken");

  // per-product add-to-cart UI state for list view
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Helper functions
  const parseList = (val: string | null): string[] => 
    val ? val.split(",").map(s => decodeURIComponent(s)).filter(Boolean) : [];

  const normalizeApiResponse = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    return data?.results ?? data?.data ?? data?.categories ?? [];
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, sellersData, productsData] = await Promise.all([
          API.getCategories(),
          API.getAllSellers({}),
          API.getProducts(),
        ]);

        const normalizedCategories = normalizeApiResponse(categoriesData);
        const normalizedSellers = normalizeApiResponse(sellersData);
        const normalizedProducts = normalizeApiResponse(productsData);

        setCategories(normalizedCategories);
        setSellers(normalizedSellers);
        setProducts(normalizedProducts);

        // Derive unique seller options from products
        const uniqueSellers = Array.from(
          new Set(
            normalizedProducts
              .map((product: Product) => product.seller?.toString() || "")
              .filter(Boolean)
          )
        ).sort();
        setSellerOptions(uniqueSellers);

      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize state from URL parameters (only after data loads)
  useEffect(() => {
  if (loading || !isInitialMount.current) return;

    const query = searchParams.get("query") || "";
    const categories = parseList(searchParams.get("categories"));
    const sellers = parseList(searchParams.get("sellers"));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const view = (searchParams.get("view") as "grid" | "list") || "grid";
    const sort = searchParams.get("sort") || "relevance";
    const minPrice = Math.max(0, parseFloat(searchParams.get("price_min") || "0"));
    const maxPrice = Math.max(minPrice, parseFloat(searchParams.get("price_max") || "500"));

    setSearchQuery(query);
    setSelectedCategories(categories);
    setSelectedSellers(sellers);
    setCurrentPage(page);
  // Respect cookie-stored preference if consent given, otherwise use URL param
  const storedView = hasConsent() ? readCookie("products_view") : null;
  setViewMode((storedView as "grid" | "list") || view);
    setSortBy(sort);
    setPriceRange([minPrice, maxPrice]);

    isInitialMount.current = false;
  }, [loading, searchParams]);

  // Listen for cookie consent acceptance to restore saved preferences
  useEffect(() => {
    function onConsent() {
      const storedView = readCookie("products_view") as "grid" | "list" | null;
      const storedSort = readCookie("products_sort") || null;
      if (storedView) setViewMode(storedView);
      if (storedSort) setSortBy(storedSort);
    }

    window.addEventListener("cookie-consent-accepted", onConsent);
    return () => window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  // Sync state to URL (skip on initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;

    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (selectedCategories.length) params.set("categories", selectedCategories.map(encodeURIComponent).join(","));
    if (selectedSellers.length) params.set("sellers", selectedSellers.map(encodeURIComponent).join(","));
    if (priceRange[0] !== 0) params.set("price_min", priceRange[0].toString());
    if (priceRange[1] !== 500) params.set("price_max", priceRange[1].toString());
    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (viewMode !== "grid") params.set("view", viewMode);
    if (sortBy !== "relevance") params.set("sort", sortBy);

    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, selectedCategories, selectedSellers, priceRange, currentPage, viewMode, sortBy, searchParams, setSearchParams]);

  // Enhanced filtering and sorting logic
  // Derive top-level categories (parent === null) for the sidebar
  const topLevelCategories = categories.filter((c: any) => c?.parent === null || c?.parent === undefined)

  const processedProducts = products
    .map((product: Product) => {
      const price = parseFloat(product.price?.toString() || "0") || 0;
      const name = product.name || "";
      const description = product.description || "";
      const categoryName = product.category?.name || "";
      const seller = product.seller || "";
      const tags = (product.tags || []).map(tag => tag.name).join(" ");

      // Calculate search relevance score
      let matchScore = 0;
      const query = searchQuery.trim().toLowerCase();
      
      if (query) {
        const nameMatch = name.toLowerCase();
        const descMatch = description.toLowerCase();
        const catMatch = categoryName.toLowerCase();
        const sellerMatch = seller.toLowerCase();
        const tagMatch = tags.toLowerCase();

        if (nameMatch === query) matchScore += 10;
        else if (nameMatch.startsWith(query)) matchScore += 8;
        else if (nameMatch.includes(query)) matchScore += 6;
        
        if (descMatch.includes(query)) matchScore += 3;
        if (catMatch.includes(query)) matchScore += 2;
        if (sellerMatch.includes(query)) matchScore += 2;
        if (tagMatch.includes(query)) matchScore += 1;
      }

      return {
        ...product,
        _price: price,
        _matchScore: matchScore,
        _name: name.toLowerCase(),
        _seller: seller.toLowerCase(),
      };
    })
    .filter((product: any) => {
      // Search filter - require match if search query exists
      if (searchQuery.trim() && product._matchScore === 0) return false;

      // Category filter: support nested category shapes where product.category may have id, parent, parent_name
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(selected => {
        const prodCat = product.category || {}
        const prodName = (prodCat.name || "").toString().toLowerCase()
        const prodParentId = prodCat.parent
        const prodParentName = (prodCat.parent_name || "").toString().toLowerCase()
        const selectedLower = selected.toString().toLowerCase()

        // Match by name
        if (prodName && prodName.includes(selectedLower)) return true

        // If selected is a numeric id string, match by id or parent id
        if (!isNaN(Number(selected))) {
          const selNum = Number(selected)
          if (Number(prodCat.id) === selNum) return true
          if (Number(prodParentId) === selNum) return true
        }

        // Match by parent_name
        if (prodParentName && prodParentName.includes(selectedLower)) return true

        return false
      })

      // Seller filter
      const matchesSeller = selectedSellers.length === 0 ||
        selectedSellers.some(seller => 
          product._seller.includes(seller.toLowerCase())
        );

      // Price filter - only apply if user has modified the default range
      const hasCustomPriceRange = priceRange[0] !== 0 || priceRange[1] !== 500;
      const matchesPrice = !hasCustomPriceRange || 
        (product._price >= priceRange[0] && product._price <= priceRange[1]);

      return matchesCategory && matchesSeller && matchesPrice;
    })
    .sort((a: any, b: any) => {
      // Enhanced sorting logic
      switch (sortBy) {
        case "price_low":
          return a._price - b._price;
        case "price_high":
          return b._price - a._price;
        case "name_asc":
          return a._name.localeCompare(b._name);
        case "name_desc":
          return b._name.localeCompare(a._name);
        case "relevance":
        default:
          if (searchQuery.trim()) {
            return b._matchScore - a._matchScore;
          }
          // Default to name ascending when no search query
          return a._name.localeCompare(b._name);
      }
    });

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    if (!isInitialMount.current) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategories, selectedSellers, priceRange, sortBy]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  const handleSellerChange = (seller: string, checked: boolean) => {
    setSelectedSellers(prev =>
      checked ? [...prev, seller] : prev.filter(s => s !== seller)
    );
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSellers([]);
    setPriceRange([0, 500]);
    setSearchQuery("");
    setSortBy("relevance");
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
  setSortBy(newSort);
  if (hasConsent()) setCookie("products_sort", newSort);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
  setViewMode(mode);
  if (hasConsent()) setCookie("products_view", mode);
  };

  // Generate active filter tags for display
  const activeFilterTags = [
    ...selectedCategories.map(cat => `Category: ${cat}`),
    ...selectedSellers.map(seller => `Seller: ${seller}`),
  ...(priceRange[0] !== 0 || priceRange[1] !== 500 ? [`Price: BDT ${priceRange[0]} - BDT ${priceRange[1]}`] : []),
    ...(searchQuery.trim() ? [`Search: "${searchQuery.trim()}"`] : []),
  ];

  const handleRemoveFilterTag = (tag: string) => {
    if (tag.startsWith("Category: ")) {
      const category = tag.replace("Category: ", "");
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else if (tag.startsWith("Seller: ")) {
      const seller = tag.replace("Seller: ", "");
      setSelectedSellers(prev => prev.filter(s => s !== seller));
    } else if (tag.startsWith("Price: ")) {
      setPriceRange([0, 500]);
    } else if (tag.startsWith("Search: ")) {
      setSearchQuery("");
    }
  };

  // List view: navigate to product detail
  const handleViewDetails = (id: string) => {
    navigate(`/products/${id}`);
  };

  // List view: add product to cart using CartContext (handles auth/local fallback)
  const handleListAddToCart = async (product: any) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const id = product.id?.toString();
    if (!id) return;

    setAddingIds((s) => ({ ...s, [id]: true }));
    try {
      await addToCart({ product: product as any, quantity: 1 });
      setAddedIds((s) => ({ ...s, [id]: true }));
      setTimeout(() => setAddedIds((s) => ({ ...s, [id]: false })), 1500);
    } catch (err) {
      // ignore - CartContext handles errors, UI remains usable
    } finally {
      setAddingIds((s) => ({ ...s, [id]: false }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarSection />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <img
            src="https://shobshopping.com/logo.png"
            alt="Loading..."
            className="w-16 h-16 animate-bounce mb-4"
          />
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
        <FooterSection />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarSection />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden pt-20 lg:pt-0">
      <NavbarSection />

      <SubNavbar />
      
      {/* Search Bar Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search products, categories, or sellers..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 py-3 w-full text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb and Active Filters */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbAndTags
          categoryPath={["Home", "Products"]}
          filters={activeFilterTags}
          onRemoveFilter={handleRemoveFilterTag}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={(r: number[]) => setPriceRange([Number(r[0] ?? 0), Number(r[1] ?? 500)])}
            categories={topLevelCategories.map((cat: any) => cat.name)}
            sellers={sellerOptions}
            selectedCategories={selectedCategories}
            selectedSellers={selectedSellers}
            onCategoryChange={handleCategoryChange}
            onSellerChange={handleSellerChange}
            onClearAll={handleClearAllFilters}
          />
        </aside>

        <main className="flex-1">
          {/* Mobile Filter Sheet */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterTags.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {activeFilterTags.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-80 bg-white overflow-y-auto max-h-screen"
              >
                <div className="mt-16 pb-6">
                  <FilterSidebar
                    priceRange={priceRange}
                    setPriceRange={(r: number[]) =>
                      setPriceRange([Number(r[0] ?? 0), Number(r[1] ?? 500)])
                    }
                    categories={topLevelCategories.map((cat: any) => cat.name)}
                    sellers={sellerOptions}
                    selectedCategories={selectedCategories}
                    selectedSellers={selectedSellers}
                    onCategoryChange={handleCategoryChange}
                    onSellerChange={handleSellerChange}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Products
                {searchQuery && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    for "{searchQuery}"
                  </span>
                )}
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {processedProducts.length} {processedProducts.length === 1 ? 'result' : 'results'}
              </span>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>

              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* No Results Message */}
          {processedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategories.length || selectedSellers.length || priceRange[0] !== 0 || priceRange[1] !== 500
                    ? "Try adjusting your filters or search terms"
                    : "No products are currently available"
                  }
                </p>
                {(searchQuery || selectedCategories.length || selectedSellers.length || priceRange[0] !== 0 || priceRange[1] !== 500) && (
                  <Button 
                    onClick={handleClearAllFilters}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Product Display */}
          {processedProducts.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <ProductGrid products={paginatedProducts} viewMode={viewMode} />
              ) : (
                <div className="space-y-4">
                  {paginatedProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={product.image || "/api/placeholder/120/120"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.description}
                              </p>
                              
                              {/* Category and Seller */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                {product.category?.name && (
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    <Files className="inline-block w-4 h-4 text-gray-400" /> {product.category.name}
                                  </span>
                                )}
                                {product.seller && (
                                  <span className="bg-red-50 text-red-700 px-2 py-1 rounded">
                                    <Building className="inline-block w-4 h-4 text-red-400" /> {product.seller}
                                  </span>
                                )}
                              </div>

                              {/* Tags */}
                              {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {product.tags.slice(0, 3).map((tag: any, index: number) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                  {product.tags.length > 3 && (
                                    <span className="text-xs text-gray-400 px-2 py-1">
                                      +{product.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Price and Actions */}
                            <div className="flex flex-col items-end gap-3 sm:ml-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  BDT {parseFloat(product.price?.toString() || "0").toFixed(2)}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                  onClick={() => handleViewDetails(product.id)}
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleListAddToCart(product)}
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={processedProducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <FooterSection />
    </div>
  );
}
