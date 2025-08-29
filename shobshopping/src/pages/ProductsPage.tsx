import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../lib/api"; // <-- import API

import FooterSection from "../components/HomePage/FooterSection";
import BreadcrumbAndTags from "../components/ProductsPage/BreadcrumbAndTags";
import FilterSidebar from "../components/ProductsPage/FilterSidebar";
import NavbarSection from "../components/HomePage/NavbarSection";
import ProductGrid from "../components/ProductsPage/ProductGrid";
import Pagination from "../components/common/Pagination";
import SubNavbar from "../components/common/SubNavbar";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>(["Best Value", "Free Shipping"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Real API data states
  const [categories, setCategories] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [sellerOptions, setSellerOptions] = useState<string[]>([]); // <-- new: derived seller list from products
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query");


  // Sync URL param to searchQuery state on mount
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Fetch categories, sellers, products from API
  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.getCategories(), // <-- use API
      API.getAllSellers({}), // <-- use API
      API.getProducts(), // <-- use API
    ])
      .then(([catData, sellerData, prodData]) => {
        setCategories(catData);
        setSellers(sellerData);
        setProducts(prodData);

        // derive seller options from products so filtering matches the product.seller values
        const derivedSellers = Array.from(
          new Set((prodData || []).map((p: any) => (p.seller || "").toString()))
        )
          .filter(Boolean)
          .sort((a: string, b: string) => a.localeCompare(b));
        setSellerOptions(derivedSellers);
      })
      .catch((err) => {
        // Optionally handle error
        setCategories([]);
        setSellers([]);
        setProducts([]);
        setSellerOptions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
    setCurrentPage(1);
  };

  const handleSellerChange = (seller: string, checked: boolean) => {
    setSelectedSellers((prev) =>
      checked ? [...prev, seller] : prev.filter((s) => s !== seller)
    );
    setCurrentPage(1);
  };

  const handleRemoveFilter = (tag: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  };


  // 🔍 Filtering logic (updated to account for API shapes)
  const filteredProducts = products
    .map((product: any) => {
      const priceNumber = parseFloat(product.price || "0") || 0;
      const name = (product.name || "").toString();
      const description = (product.description || "").toString();
      const categoryName = product.category?.name || "";
      const seller = (product.seller || "").toString();
      const tagText = (product.tags || []).map((t: any) => t.name).join(" ");

      const q = (searchQuery || "").trim().toLowerCase();
      let matchScore = 0;
      if (q) {
        if (name.toLowerCase() === q) matchScore += 6;
        if (name.toLowerCase().includes(q)) matchScore += 4;
        if (description.toLowerCase().includes(q)) matchScore += 2;
        if (categoryName.toLowerCase().includes(q)) matchScore += 1;
        if (tagText.toLowerCase().includes(q)) matchScore += 1;
        if (seller.toLowerCase().includes(q)) matchScore += 1;
      }

      return {
        ...product,
        _priceNumber: priceNumber,
        _matchScore: matchScore,
      };
    })
    .filter((product: any) => {
      // if there's a search query, require a positive match score
      if (searchQuery && product._matchScore === 0) return false;

      // category filter: compare against category.name
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (cat) =>
            (product.category?.name || "")
              .toString()
              .toLowerCase()
              .startsWith(cat.toString().toLowerCase())
        );

      // seller filter: selectedSellers contains seller identifiers (we derive them from products)
      const matchesSeller =
        selectedSellers.length === 0 ||
        selectedSellers.some(
          (s) => (product.seller || "").toString().toLowerCase() === s.toString().toLowerCase()
        );

      // numeric price check using parsed price
      const matchesPrice =
        product._priceNumber >= priceRange[0] && product._priceNumber <= priceRange[1];

      return matchesCategory && matchesSeller && matchesPrice;
    })
    .sort((a: any, b: any) => b._matchScore - a._matchScore); // sort by relevance

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <img
          src="https://shobshopping.com/logo.png"
          alt="Logo"
          className="w-20 h-20 animate-bounce mb-4"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden pt-28 lg:pt-0">
  <NavbarSection />
  {/* <SubNavbar /> */}
      <BreadcrumbAndTags
        categoryPath={["Home", "Products"]}
        filters={activeTags}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={(range) => setPriceRange([range[0], range[1]])}
            categories={categories.map((cat: any) => cat.name)}
            sellers={sellerOptions} 
            selectedCategories={selectedCategories}
            selectedSellers={selectedSellers}
            onCategoryChange={handleCategoryChange}
            onSellerChange={handleSellerChange}
          />
        </aside>

        <main className="flex-1">
          <ProductGrid products={paginatedProducts} viewMode={viewMode} />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </main>
      </div>

      <FooterSection />
    </div>
  );
}
