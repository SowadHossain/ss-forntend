import React from "react";
import { Search } from "lucide-react";

type Product = {
  id: number;
  name: string;
  image: string;
  category?: string;
};

interface SearchDropdownProps {
  products: Product[];
  query: string;
  onSelect: (product: Product) => void;
}

export default function SearchDropdown({
  products,
  query,
  onSelect,
}: SearchDropdownProps) {
  if (!query.trim()) return null;

  const normalizedQuery = query.toLowerCase();

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      const aExact = a.name.toLowerCase() === normalizedQuery;
      const bExact = b.name.toLowerCase() === normalizedQuery;
      return +bExact - +aExact;
    })
    .slice(0, 10); // Limit to top 10

  return (
    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded shadow-md z-50 max-h-80 overflow-y-auto">
      {filtered.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">No results found</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filtered.map((product) => (
            <li
              key={product.id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div className="flex-1 text-sm text-gray-700">{product.name}</div>
              <Search className="w-4 h-4 text-gray-400" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
