import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import NavbarSection from "../components/ProductsPage/NavbarSection";
import FooterSection from "../components/HomePage/FooterSection";
import FilterSidebar from "../components/ProductsPage/FilterSidebar";
import ProductGrid from "../components/ProductsPage/ProductGrid";
import BreadcrumbAndTags from "../components/ProductsPage/BreadcrumbAndTags";
import SubNavbar from "../components/common/SubNavbar";
import Pagination from "../components/common/Pagination";

import { mockCategories } from "../lib/mock/mockCategories";
import { mockSellers } from "../lib/mock/mockSellers";
import { mockProducts } from "../lib/mock/mockProducts";

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

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query");

  // Sync URL param to searchQuery state on mount
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

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

  // 🔍 Filtering logic
  const filteredProducts = mockProducts
    .map((product) => {
      const isExactMatch =
        searchQuery &&
        product.name.toLowerCase() === searchQuery.toLowerCase();

      const isPartialMatch =
        searchQuery &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      const sameCategory =
        searchQuery &&
        product.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return {
        ...product,
        _matchScore: isExactMatch ? 3 : isPartialMatch ? 2 : sameCategory ? 1 : 0,
      };
    })
    .filter((product) => {
      const matchesSearch = !searchQuery || product._matchScore > 0;

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) =>
          product.category?.toLowerCase().startsWith(cat.toLowerCase())
        );

      const matchesSeller =
        selectedSellers.length === 0 ||
        selectedSellers.some(
          (s) => product.seller?.toLowerCase() === s.toLowerCase()
        );

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesSeller && matchesPrice;
    })
    .sort((a, b) => b._matchScore - a._matchScore); // sort by relevance

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <NavbarSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={mockProducts}
      />
      <SubNavbar categories={mockCategories} />
      <BreadcrumbAndTags
        categoryPath={["Home", "Products"]}
        filters={activeTags}
        onRemoveFilter={handleRemoveFilter}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={mockCategories.map((cat) => cat.name)}
            sellers={mockSellers.map((s) => s.name)}
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
