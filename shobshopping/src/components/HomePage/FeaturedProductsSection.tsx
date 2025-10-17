// src/components/HomePage/FeaturedProductsSection.tsx
import { Stars } from "lucide-react"
import ProductCard from "../common/ProductCard"

type Product = {
  id: number | string
  name: string
  description?: string
  price: number | string
  originalPrice?: number | string
  original_price?: number | string
  image?: string
  rating?: number | string
  reviews?: number | string
  recommended?: boolean
  seller?: string
  badge?: string
  category?: { id?: number; name?: string }
  tags?: { id?: number; name?: string }[]
}

interface FeaturedProductsSectionProps {
  products: Product[]
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  // Show up to 8 featured products.
  // Requirement: show only products marked as recommended, sorted by numeric price desc (high->low).
  // Use rating and reviews as secondary tiebreakers. Be defensive: rating/reviews/price may be strings.
  const parsePrice = (p: any) => {
    if (p === null || p === undefined) return 0
    if (typeof p === "number") return p
    const s = String(p).replace(/[^0-9.,-]/g, "").replace(/,/g, "")
    const n = parseFloat(s)
    return Number.isFinite(n) ? n : 0
  }

  const featured = [...products]
    // keep only recommended products
    .filter((p) => Boolean((p as any).recommended))
    .map((p) => ({
      ...p,
      _priceNum: parsePrice((p as any).price ?? (p as any).originalPrice ?? (p as any).original_price),
      _ratingNum: Number((p as any).rating) || 0,
      _reviewsNum: Number((p as any).reviews) || 0,
    }))
    // .sort((a, b) => {
    //   // primary: price desc
    //   if (b._priceNum !== a._priceNum) return b._priceNum - a._priceNum
    //   // secondary: rating desc
    //   if (b._ratingNum !== a._ratingNum) return b._ratingNum - a._ratingNum
    //   // tertiary: reviews desc
    //   return b._reviewsNum - a._reviewsNum
    // })
    .slice(0, 8)

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-12 shadow-md rounded-lg bg-gradient-to-r from-red-100 via-pink-50 to-white py-6"> */}
        <div className="text-center mb-12 shadow-md rounded-lg bg-white py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 drop-shadow-lg">
            Featured Products <Stars className="inline-block w-6 h-6 text-yellow-400" />
            </h2>
          <p className="text-gray-600">Handpicked deals just for you!</p>
        </div>
        {/* Render up to 8 items in a 4-column grid (2 rows on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map((product) => {
            // coerce fields to shape expected by ProductCard
            const originalPriceRaw = (product as any).originalPrice ?? (product as any).original_price
            const originalPriceNum =
              typeof originalPriceRaw === "number"
                ? originalPriceRaw
                : Number(String(originalPriceRaw ?? "").replace(/[^0-9.-]+/g, ""))

            const productForCard = {
              ...product,
              id: String(product.id),
              description: String(product.description ?? product.name ?? ""),
              seller: String(product.seller ?? ""),
              originalPrice: Number.isFinite(originalPriceNum) && originalPriceNum !== 0 ? originalPriceNum : undefined,
              rating: Number((product as any)._ratingNum ?? product.rating) || undefined,
              reviews: Number((product as any)._reviewsNum ?? product.reviews) || undefined,
              image: product.image ?? "",
                        // normalize category: API may return either a string or an object
                        category: product.category
                          ? typeof product.category === "string"
                            ? { name: String(product.category) }
                            : { name: String((product.category as any).name ?? "") }
                          : undefined,
              tags: Array.isArray(product.tags)
                ? product.tags.map((t) => ({ name: String((t as any).name ?? "") }))
                : undefined,
            }

            return <ProductCard key={String(product.id)} product={productForCard} />
          })}
        </div>
      </div>
    </section>
  )
}
