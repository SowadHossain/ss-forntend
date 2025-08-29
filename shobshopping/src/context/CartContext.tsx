import React, { createContext, useContext, useEffect, useState } from "react";
import { API } from "../lib/api";

// New types: keep the raw backend shape (cart entry with product payload)
export type CartProduct = {
  id: number;
  name?: string;
  description?: string;
  price?: string;
  original_price?: string;
  stock_quantity?: number;
  image?: string;
  seller?: string;
  [key: string]: any;
};

export type CartEntry = {
  id: number; // cart entry id from backend, for local fallback we use product.id
  product: CartProduct;
  quantity: number;
  added_at?: string;
};

interface CartContextType {
  cartItems: CartEntry[]; // return raw JSON entries
  addToCart: (item: { product: CartProduct; quantity: number }) => void;
  removeFromCart: (id: number) => void; // id is the cart entry id (or product.id for local)
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartEntry[]>([]);

  // Load cart from backend or localStorage
  const refreshCart = async () => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      try {
        // Expecting API.getCart() to return an array of cart entries (raw JSON)
        const data = await API.getCart();
        // Ensure we set the raw JSON (array) so useCart returns it directly
        setCartItems(Array.isArray(data) ? data : data.items || []);
      } catch {
        setCartItems([]);
      }
    } else {
      const local = localStorage.getItem("cart");
      setCartItems(local ? JSON.parse(local) : []);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // Add to cart
  const addToCart = async ({ product, quantity }: { product: CartProduct; quantity: number }) => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      // Backend flow: let API handle payload shape
      await API.createCart({ product_id: product.id, quantity });
      await refreshCart();
    } else {
      // Local fallback: store entry-like objects matching backend shape.
      setCartItems((prev) => {
        // Use product.id as local id to allow remove/update operations
        const existing = prev.find((e) => e.product?.id === product.id);
        let updated: CartEntry[];
        if (existing) {
          updated = prev.map((e) =>
            e.product?.id === product.id ? { ...e, quantity: e.quantity + quantity } : e
          );
        } else {
          const entry: CartEntry = {
            id: product.id, // local id uses product id
            product,
            quantity,
            added_at: new Date().toISOString(),
          };
          updated = [...prev, entry];
        }
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Remove from cart
  const removeFromCart = async (id: number) => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      await API.deleteCartItem(id);
      await refreshCart();
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((e) => e.id !== id && e.product?.id !== id);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Update quantity
  const updateQuantity = async (id: number, quantity: number) => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      await API.updateCartItem(id, { quantity });
      await refreshCart();
    } else {
      setCartItems((prev) => {
        const updated = prev.map((e) =>
          e.id === id || e.product?.id === id ? { ...e, quantity } : e
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
