import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export type CardBrand = "Visa" | "Mastercard" | "Elo" | "Amex" | "Hipercard" | "Outro";

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  holderName: string;
  expiry: string; // MM/AA
  isPrimary: boolean;
}

// A API usa id numérico; no front o id é texto
type ApiCard = Omit<SavedCard, "id"> & { id: number };

interface CardContextType {
  cards: SavedCard[];
  addCard: (raw: { number: string; name: string; expiry: string; save: boolean }) => Promise<SavedCard>;
  deleteCard: (id: string) => Promise<void>;
  setPrimary: (id: string) => Promise<void>;
  getPrimary: () => SavedCard | null;
}

const CardContext = createContext<CardContextType | null>(null);

function toCard(c: ApiCard): SavedCard {
  return { ...c, id: String(c.id) };
}

function detectBrand(number: string): CardBrand {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Elo";
  if (/^(384100|384140|384160|606282|637095|637568)/.test(n)) return "Hipercard";
  return "Outro";
}

export function CardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cards, setCards] = useState<SavedCard[]>([]);

  async function reload() {
    const list = await api<ApiCard[]>("/cards");
    setCards(list.map(toCard));
  }

  useEffect(() => {
    if (!user) {
      setCards([]);
      return;
    }
    let cancelled = false;
    api<ApiCard[]>("/cards")
      .then((list) => {
        if (!cancelled) setCards(list.map(toCard));
      })
      .catch(() => {
        if (!cancelled) setCards([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  async function addCard(raw: { number: string; name: string; expiry: string; save: boolean }): Promise<SavedCard> {
    // Sem "salvar cartão": nada vai para a API
    if (!raw.save) {
      return {
        id: `temp-${crypto.randomUUID()}`,
        brand: detectBrand(raw.number),
        last4: raw.number.replace(/\s/g, "").slice(-4),
        holderName: raw.name.trim().toUpperCase(),
        expiry: raw.expiry,
        isPrimary: false,
      };
    }
    // A API guarda só a bandeira e os 4 últimos dígitos
    const created = await api<ApiCard>("/cards", {
      method: "POST",
      body: { number: raw.number, name: raw.name, expiry: raw.expiry },
    });
    await reload();
    return toCard(created);
  }

  async function deleteCard(id: string) {
    await api(`/cards/${id}`, { method: "DELETE" });
    await reload();
  }

  async function setPrimary(id: string) {
    await api(`/cards/${id}/primary`, { method: "POST" });
    await reload();
  }

  function getPrimary(): SavedCard | null {
    return cards.find((c) => c.isPrimary) ?? cards[0] ?? null;
  }

  return (
    <CardContext.Provider value={{ cards, addCard, deleteCard, setPrimary, getPrimary }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCards() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCards must be used inside CardProvider");
  return ctx;
}
