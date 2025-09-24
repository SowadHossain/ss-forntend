import { JSX } from "react";
import {
  FaBaby, FaBasketballBall,
  FaBox,
  FaCar,
  FaCouch,
  FaDog,
  FaGamepad,
  FaGem,
  FaGift,
  FaHeart, FaHeartbeat,
  FaHome,
  FaKeyboard,
  FaMobileAlt,
  FaPlug,
  FaRing,
  FaTshirt,
  FaUtensils
} from "react-icons/fa";

interface FeaturedCategoriesProps {
  // optional override of categories
  categories?: string[]
}

const DEFAULT_CATEGORIES = [
  "Fashion & Apparel",
  "Gadgets & Electronics",
  "Kitchen Item",
  "Beauty & Personal Care",
  "Health & Wellness",
  "Baby Products",
  "Sports & Outdoors",
  "Car & Bike Accessories",
  "Mobile Accessories",
  "Computer Accessories",
  "Gaming",
  "Jewelry",
  "Pet Supplies",
  "Home Appliances",
  "Furniture & Decorations",
  "Luxury Items",
  "Others",
  "Giftbox",
]

const iconMap: Record<string, JSX.Element> = {
  "Fashion & Apparel": <FaTshirt />,
  "Gadgets & Electronics": <FaPlug />,
  "Kitchen Item": <FaUtensils />,
  "Beauty & Personal Care": <FaHeart />,
  "Health & Wellness": <FaHeartbeat />,
  "Baby Products": <FaBaby />,
  "Sports & Outdoors": <FaBasketballBall />,
  "Car & Bike Accessories": <FaCar />,
  "Mobile Accessories": <FaMobileAlt />,
  "Computer Accessories": <FaKeyboard />,
  "Gaming": <FaGamepad />,
  "Jewelry": <FaRing />,
  "Pet Supplies": <FaDog />,
  "Home Appliances": <FaHome />,
  "Furniture & Decorations": <FaCouch />,
  "Luxury Items": <FaGem />,
  "Others": <FaBox />,
  "Giftbox": <FaGift />,
};

export default function FeaturedCategories({ categories = DEFAULT_CATEGORIES }: FeaturedCategoriesProps) {
  return (
    <section className="py-6 md:py-16 px-4 sm:px-6 lg:px-8 md:bg-gradient-to-br md:from-red-50 md:via-white md:to-red-50">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Categories
          </h2>
          <p className="text-gray-600">Explore top categories curated for you</p>
        </div>
        <div>
          <h3 className="md:hidden text-xl font-semibold text-gray-50 mb-6">Categories</h3>
        </div>

        {/* Grid: phone shows 4 per row */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {categories.map((cat, idx) => (
            <button
              key={cat + idx}
              className="flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-sm border border-red-100 hover:shadow-md transition-colors duration-200 text-center h-20 sm:h-24"
              onClick={
                () => {
                  // Navigate to products page with category filter
                  window.location.href = `/products?categories=${encodeURIComponent(cat)}`
              }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{iconMap[cat] ?? "📦"}</div>
              <div className="text-xs sm:text-sm text-gray-700 truncate w-full">{cat}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
