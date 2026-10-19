import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Wine } from "@/data/wines";

export interface CartItem {
  wine: Wine;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  addToCart: (wine: Wine) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "brisa_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  function addToCart(wine: Wine) {
    setItems((prev) => {
      const existing = prev.find((i) => i.wine.id === wine.id);
      if (existing) {
        return prev.map((i) => i.wine.id === wine.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { wine, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setItems((prev) => prev.filter((i) => i.wine.id !== id));
  }

  function updateQty(id: number, qty: number) {
    if (qty < 1) { removeFromCart(id); return; }
    setItems((prev) => prev.map((i) => i.wine.id === id ? { ...i, qty } : i));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, totalItems, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
