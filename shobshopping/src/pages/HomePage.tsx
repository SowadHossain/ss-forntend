import React from "react"
import NavbarSection from "../components/HomePage/NavbarSection"
import HeroSection from "../components/HomePage/HeroSection"
import CategoriesSection from "../components/HomePage/CategoriesSection"
import FeaturedProductsSection from "../components/HomePage/FeaturedProductsSection"
import TopSellersSection from "../components/HomePage/TopSellersSection"
import CategoryShowcaseSection from "../components/HomePage/CategoryShowcaseSection"
import FooterSection from "../components/HomePage/FooterSection"

import { mockCategories } from "../lib/mock/mockCategories"
import { mockProducts } from "../lib/mock/mockProducts"
import { mockSellers } from "../lib/mock/mockSellers"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavbarSection />
      <HeroSection />
      {/* <CategoriesSection /> */}

      <FeaturedProductsSection products={mockProducts.slice(0, 4)} />
      <TopSellersSection sellers={mockSellers} />

      {/* Showcase top 3 categories with 5 subcategory items as mock products */}
      {mockCategories.map((category, index) => {
        const products = category.subcategories.slice(0, 4).map((sub, i) => ({
          id: index * 10 + i,
          name: sub.name,
          price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
          image: "/placeholder.jpg",
          seller: "MockVendor",
          badge: "Featured",
        }))

        return (
          <CategoryShowcaseSection
            key={index}
            title={`Popular in ${category.name}`}
            products={products}
            link={`/categories/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, "-"))}`}
          />
        )
      })}

      <FooterSection />
    </div>
  )
}
