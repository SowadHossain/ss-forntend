import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProfilePage from "./pages/SellerProfilePage";
import AdminPage from "./pages/AdminPage";
import BuyerProfilePage from "./pages/BuyerProfilePage.tsx";



export default function App() {
  return (
    <>
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
          {/* Add more routes as needed */}
          {/* <Route path="/not-found" element={<NotFoundPage />} /> */}
          
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>

      <footer className="text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} ShobShopping
      </footer>
    </>
  );
}
