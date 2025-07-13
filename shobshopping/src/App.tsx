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
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-brand">ShobShopping</Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-brand-dark">Home</Link>
            <Link to="/products" className="hover:text-brand-dark">Products</Link>
            <Link to="/cart" className="hover:text-brand-dark">Cart</Link>
            <Link to="/login" className="hover:text-brand-dark">Login</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-4">
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
