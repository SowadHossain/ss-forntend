import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";


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
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>

      <footer className="text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()} ShobShopping
      </footer>
    </>
  );
}
