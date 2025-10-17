import ProductCard from "../common/ProductCard"
import { Card, CardContent } from "../ui/card"

type Product = {
  id: number
  name: string
  image: string
  price: number
  seller: string
  rating?: number
  reviews?: number
  originalPrice?: number
  badge?: string
}

interface CategoryShowcaseSectionProps {
  title: string
  products: Product[]
  link?: string
}

export default function CategoryShowcaseSection({ title, products, link }: CategoryShowcaseSectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products && products.length > 0 ? (
            // Render products but if `link` is provided, replace the last product card with a "See more" card
            products.map((product, idx) => {
              const isLast = idx === products.length - 1

              if (isLast && link) {
                // Render a special "See more" card in place of the last product
                return (
                  <div key={`more-${idx}`}>
                    <Card className="h-full border bg-white rounded-lg flex items-center justify-center hover:shadow-md">
                      <CardContent className="p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">See more</h3>
                        <p className="text-sm text-gray-600">Explore more items in this category</p>
                        <div className="mt-4">
                          <a href={link} className="inline-block px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700">
                            View all
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              }

              return (
                <div key={product.id}>
                  {/* Ensure product has category in expected shape */}
                  <ProductCard
                    product={{
                      ...product,
                      id: String(product.id),
                      price: product.price,
                      image: product.image,
                      category: (product as any).category
                        ? typeof (product as any).category === "string"
                          ? { name: String((product as any).category) }
                          : { name: String(((product as any).category as any).name ?? "") }
                        : undefined,
                    }}
                  />
                </div>
              )
            })
          ) : (
            <div className="col-span-2 sm:col-span-3 md:col-span-2 lg:col-span-2">
              <Card className="h-full border-2 border-dashed border-gray-200 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-gray-300 mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v6M5 12h14M5 12a7 7 0 1 0 14 0M12 2l4 4M12 2l-4 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Coming soon</h3>
                  <p className="text-sm text-gray-600 mt-2">We're curating great products for this category — check back soon.</p>
                  {link ? (
                    <div className="mt-4">
                      <a href={link} className="inline-block px-4 py-2 text-sm font-medium bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                        Explore similar items
                      </a>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
