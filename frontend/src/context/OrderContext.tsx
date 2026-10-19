import { createContext, useContext, type ReactNode } from "react";
import type { CartItem } from "./CartContext";

export type DeliveryStatus =
  | "Pagamento aprovado"
  | "Pedido confirmado"
  | "Em preparação"
  | "Pedido enviado"
  | "Em trânsito"
  | "Saiu para entrega"
  | "Entregue";

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  "Pagamento aprovado",
  "Pedido confirmado",
  "Em preparação",
  "Pedido enviado",
  "Em trânsito",
  "Saiu para entrega",
  "Entregue",
];

export type PayMethod = "pix" | "cartao-credito" | "cartao-debito";

export interface OrderAddress {
  cep: string; street: string; number: string;
  complement: string; district: string; city: string; state: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  frete: number;
  total: number;
  payMethod: PayMethod;
  installments: number;
  address: OrderAddress;
  statusIndex: number;
  userEmail: string;
}

const ORDERS_KEY = "brisa_orders";

function loadAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAllOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

interface OrderContextValue {
  addOrder: (order: Omit<Order, "id" | "date">) => Order;
  getUserOrders: (email: string) => Order[];
  getOrder: (id: string) => Order | undefined;
  advanceStatus: (id: string) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  function addOrder(data: Omit<Order, "id" | "date">): Order {
    const orders = loadAllOrders();
    const order: Order = {
      ...data,
      id: `BV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
    };
    saveAllOrders([order, ...orders]);
    return order;
  }

  function getUserOrders(email: string): Order[] {
    return loadAllOrders().filter((o) => o.userEmail === email);
  }

  function getOrder(id: string): Order | undefined {
    return loadAllOrders().find((o) => o.id === id);
  }

  function advanceStatus(id: string) {
    const orders = loadAllOrders();
    const updated = orders.map((o) =>
      o.id === id && o.statusIndex < DELIVERY_STATUSES.length - 1
        ? { ...o, statusIndex: o.statusIndex + 1 }
        : o
    );
    saveAllOrders(updated);
  }

  return (
    <OrderContext.Provider value={{ addOrder, getUserOrders, getOrder, advanceStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
}
