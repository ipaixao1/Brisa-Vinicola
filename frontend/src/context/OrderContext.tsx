import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "./CartContext";
import { useAuth } from "@/context/AuthContext";
import { api, toWine, type ApiWine } from "@/services/api";

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

// Formato que a API devolve (os vinhos vêm com o nome do arquivo da imagem)
type ApiOrder = Omit<Order, "items"> & { items: { wine: ApiWine; qty: number }[] };

function toOrder(o: ApiOrder): Order {
  return { ...o, items: o.items.map((i) => ({ wine: toWine(i.wine), qty: i.qty })) };
}

interface OrderContextValue {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, "id" | "date">) => Promise<Order>;
  getUserOrders: (email: string) => Order[];
  getOrder: (id: string) => Order | undefined;
  advanceStatus: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(!!user);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api<ApiOrder[]>("/orders")
      .then((list) => {
        if (!cancelled) setOrders(list.map(toOrder));
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // A API recalcula subtotal, frete e total a partir do banco; o front só envia o que foi escolhido.
  async function addOrder(data: Omit<Order, "id" | "date">): Promise<Order> {
    const created = await api<ApiOrder>("/orders", {
      method: "POST",
      body: {
        items: data.items.map((i) => ({ wine_id: i.wine.id, qty: i.qty })),
        address: data.address,
        payMethod: data.payMethod,
        installments: data.installments,
      },
    });
    const order = toOrder(created);
    setOrders((prev) => [order, ...prev]);
    return order;
  }

  function getUserOrders(email: string): Order[] {
    return orders.filter((o) => o.userEmail === email);
  }

  function getOrder(id: string): Order | undefined {
    return orders.find((o) => o.id === id);
  }

  async function advanceStatus(id: string) {
    const updated = toOrder(await api<ApiOrder>(`/orders/${id}/advance`, { method: "POST" }));
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, getUserOrders, getOrder, advanceStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
}
