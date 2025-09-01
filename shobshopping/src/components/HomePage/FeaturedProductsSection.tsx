// src/components/HomePage/FeaturedProductsSection.tsx
import { Heart, Star, Stars } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import ProductCard from "../common/ProductCard"

type Product = {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  seller: string
  badge: string
}

interface FeaturedProductsSectionProps {
  products: Product[]
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  // Show only the first 10 products
  // Pick top 8 highest-rated products (use reviews as tiebreaker). Ensure rating is numeric.
  const featured = [...products]
    .map((p) => ({
      ...p,
      _ratingNum: Number(p.rating) || 0,
      _reviewsNum: Number(p.reviews) || 0,
    }))
    .sort((a, b) => {
      if (b._ratingNum !== a._ratingNum) return b._ratingNum - a._ratingNum
      return b._reviewsNum - a._reviewsNum
    })
    .slice(0, 8)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products <Stars className="inline-block w-6 h-6 text-yellow-400" /></h2>
          <p className="text-gray-600">Handpicked deals just for you!</p>
        </div>
        {/* Render up to 8 items in a 4-column grid (2 rows on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map((product) => (
            // <Card
            //   key={product.id}
            //   className="group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-gray-200 bg-white overflow-hidden"
            // >
            //   <CardContent className="p-0">
            //     <div className="relative">
            //       <img
            //         src={product.image || "/placeholder.svg"}
            //         alt={product.name}
            //         className="w-full h-36 md:h-40 object-cover rounded-t-lg"
            //       />
            //       <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] md:text-xs px-2 py-0.5 max-w-[60%] truncate">
            //         {product.badge}
            //       </Badge>
            //       <Button
            //         size="sm"
            //         variant="ghost"
            //         className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
            //       >
            //         <Heart className="w-4 h-4" />
            //       </Button>
            //     </div>
            //     <div className="p-3 md:p-4">
            //       <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-xs md:text-sm">{product.name}</h3>
            //       <div className="flex items-center mb-2">
            //         <div className="flex items-center">
            //           {[0,1,2,3,4].map((i) => (
            //             <Star
            //               key={i}
            //               className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
            //                 i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
            //               }`}
            //             />
            //           ))}
            //         </div>
            //         <span className="text-xs md:text-sm text-gray-500 ml-2">({product.reviews})</span>
            //       </div>
            //       <div className="flex items-center justify-between mb-3">
            //         <div>
            //           <span className="text-sm md:text-base font-bold text-gray-800">${product.price}</span>
            //           <span className="text-[10px] md:text-xs text-gray-500 line-through ml-2">${product.originalPrice}</span>
            //         </div>
            //         <Badge variant="secondary" className="text-[9px] md:text-[11px] bg-gray-100 text-gray-600 max-w-[72px] md:max-w-[96px] overflow-hidden text-ellipsis whitespace-nowrap">
            //           {product.seller}
            //         </Badge>
            //       </div>
            //       <Button className="w-full h-8 md:h-9 bg-gradient-to-r from-[#cd2733] to-purple-600 hover:from-[#cd2733] hover:to-purple-700 text-white text-xs md:text-sm"
            //       style={{backgroundImage: "linear-gradient(45deg, #cd2733, #fc6974)",}}>
            //         Add to Cart 🛒
            //       </Button>
            //     </div>
            //   </CardContent>
            // </Card>
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
