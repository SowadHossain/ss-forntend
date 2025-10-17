import { useEffect, useState } from "react"
import CategoryShowcaseSection from "../components/HomePage/CategoryShowcaseSection"
import FeaturedProductsSection from "../components/HomePage/FeaturedProductsSection"
import FooterSection from "../components/HomePage/FooterSection"
import HeroSection from "../components/HomePage/HeroSection"
import NavbarSection from "../components/HomePage/NavbarSection"

import FeaturedCategories from "../components/HomePage/FeaturedCategories"
import { API } from "../lib/api"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [rawProducts, setRawProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([API.getCategories(), API.getProducts()])
      .then(([catRes, prodRes]) => {
        // Normalize product list from API response
        const rawProdList: any[] = prodRes?.results || prodRes || []
        setRawProducts(rawProdList)

        // Helper to parse price into a number. Handles strings like "1,234.56", "$1,234", or numeric types.
        const parsePrice = (p: any) => {
          if (p === null || p === undefined) return 0
          if (typeof p === "number") return p
          const s = String(p)
            // remove common currency symbols and spaces
            .replace(/[^0-9.,-]/g, "")
            // remove thousand-separators (commas)
            .replace(/,/g, "")
          const n = parseFloat(s)
          return Number.isFinite(n) ? n : 0
        }

        // Sort products by price descending (high to low)
        const prodList = Array.isArray(rawProdList)
          ? [...rawProdList].sort((a: any, b: any) => {
              const pa = parsePrice(a?.price)
              const pb = parsePrice(b?.price)
              return pb - pa
            })
          : rawProdList
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
    <div className="min-h-screen pt-20 lg:pt-0 bg-gradient-to-br from-slate-50 via-white to-[#cd2733]/10">
      <NavbarSection />
      
      <HeroSection />

      {/* <div className="bg-gradient-to-br from-red-400 via-red-400 to-red-400"> */}
      <div className="bg-[#890707]">
        <FeaturedCategories />
      </div>

      {/* <div className="border-t-4 border-red-50"></div> */}

      <FeaturedProductsSection products={rawProducts} />

      {/* Show a few category showcases derived from API categories */}
      {categories
        .filter((category: any) => category?.parent === null)
        .map((category: any, index: number) => {
        // Match products by category name when available
        // Determine number of products to show based on device width
        const getShowcaseCount = () => {
          if (typeof window !== "undefined") {
            const width = window.innerWidth
            // if (width < 768) return 4 // phone
            if (width < 1024) return 4 // tablet
          }
          return 5 // pc
        }

        const showcaseCount = getShowcaseCount()

        // Helper to check if a product's category belongs to the current (top-level) category.
        const productMatchesCategory = (prodCat: any, topCategory: any) => {
          if (!prodCat) return false

          // If category is a simple string, compare by name
          if (typeof prodCat === "string") {
            return prodCat.toString().toLowerCase() === String(topCategory?.name || topCategory?.title || "").toLowerCase()
          }

          // prodCat is an object. Match by multiple possible relations:
          // - exact id match
          // - prodCat.parent equals topCategory.id (child -> parent link)
          // - prodCat.parent_name equals topCategory.name
          // - fallback: prodCat.name equals topCategory.name
          const topId = topCategory?.id
          const topName = String(topCategory?.name || topCategory?.title || "").toLowerCase()

          if (prodCat.id && topId && prodCat.id === topId) return true
          if (prodCat.parent !== undefined && topId !== undefined && prodCat.parent === topId) return true
          if (prodCat.parent_name && prodCat.parent_name.toString().toLowerCase() === topName) return true
          if (prodCat.name && prodCat.name.toString().toLowerCase() === topName) return true

          return false
        }

        const categoryProducts = products
          .filter((p) => productMatchesCategory(p.category, category))
          .slice(0, showcaseCount)
          .map((p) => ({
            id: p.id,
            name: p.name,
            // normalize category shape for ProductCard
            category: p.category
              ? typeof p.category === "string"
                ? { name: String(p.category) }
                : { name: String((p.category as any).name ?? "") }
              : undefined,
            price: parseFloat((p.price || "0").toString()) || 0,
            image: p.image || "/placeholder.svg",
            seller: p.seller || "Unknown",
            badge: p.badge || "",
            rating: parseFloat((p.rating || "0").toString()) || 0,
            reviews: parseFloat((p.reviews || "0").toString()) || 0,
          }))

        // Don't render a showcase for categories with zero matched products
        // if (!categoryProducts || categoryProducts.length === 0) return null

      return (
          <CategoryShowcaseSection
            key={category?.id || index}
            title={`Popular in ${category?.name || category?.title || "Category"}`}
            products={categoryProducts}
            link={`/products?categories=${encodeURIComponent((category?.name || category?.title || ""))}`}
          />
        )
      })}

      <FooterSection />
    </div>
  )
}
