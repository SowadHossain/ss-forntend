import { useEffect, useState } from "react"
import CategoryShowcaseSection from "../components/HomePage/CategoryShowcaseSection"
import FeaturedProductsSection from "../components/HomePage/FeaturedProductsSection"
import FooterSection from "../components/HomePage/FooterSection"
import HeroSection from "../components/HomePage/HeroSection"
import NavbarSection from "../components/HomePage/NavbarSection"

import { API } from "../lib/api"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([API.getCategories(), API.getProducts()])
      .then(([catRes, prodRes]) => {
        const prodList = prodRes?.results || prodRes || []
        const catList = Array.isArray(catRes) ? catRes : (catRes?.results || [])
        setProducts(prodList)
        setCategories(catList)
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to fetch homepage data")
        setProducts([])
        setCategories([])
      })
      .finally(() => setLoading(false))
  }, [])

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

  if (error) {
    return (
      <div className="min-h-screen pt-28 flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 lg:pt-0 bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      <HeroSection />

      <FeaturedProductsSection products={products.slice(0, 10)} />

      {/* Show a few category showcases derived from API categories */}
      {categories.slice(0, 3).map((category: any, index: number) => {
        // Match products by category name when available
        const categoryProducts = products
          .filter((p) => {
            const prodCatName = p.category?.name || (typeof p.category === "string" ? p.category : "")
            const catName = category?.name || category?.title || ""
            return prodCatName && catName && prodCatName.toString().toLowerCase() === catName.toString().toLowerCase()
          })
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: parseFloat((p.price || "0").toString()) || 0,
            image: p.image || "/placeholder.svg",
            seller: p.seller || "Unknown",
            badge: p.badge || "",
            rating: parseFloat((p.rating || "0").toString()) || 0,
            reviews: parseFloat((p.reviews || "0").toString()) || 0,
          }))

        return (
          <CategoryShowcaseSection
            key={index}
            title={`Popular in ${category?.name || category?.title || "Category"}`}
            products={categoryProducts}
            link={`/categories/${encodeURIComponent((category?.name || category?.title || "").toLowerCase().replace(/\s+/g, "-"))}`}
          />
        )
      })}

      <FooterSection />
    </div>
  )
}
