import { Bolt, Lock, MapIcon } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerProfilePage from "./pages/BuyerProfilePage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProfilePage from "./pages/SellerProfilePage";

import DealsPage from "./pages/DealsPage";


export default function App() {
  return (
    <CartProvider>
      <main className="mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/seller-profile" element={<SellerProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/buyer-profile" element={<BuyerProfilePage />} />
          <Route path="/profile" element={<BuyerProfilePage />} />
          {/* Add more routes as needed */}
            <Route path="/deals" element={<DealsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* {!["/", "/products", "/products/:id"].includes(window.location.pathname) && ( */}
      <footer className="text-center text-sm text-gray-500">
        <div className="border-t border-red-200 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div>
            &copy; 2025 ShobShopping, Inc. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <span className="flex items-center gap-2 text-green-600 font-medium">
              <MapIcon size={18} strokeWidth={2} /> Nationwide shipping
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <Bolt size={16} /> Lightning-fast delivery
            </span>
            <span className="flex items-center gap-1 text-yellow-600">
              <Lock size={16} /> 100% secure checkout
            </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* )} */}
    </CartProvider>
  );
}
