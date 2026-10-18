import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export type CardBrand = "Visa" | "Mastercard" | "Elo" | "Amex" | "Hipercard" | "Outro";

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  holderName: string;
  expiry: string; // MM/AA
  isPrimary: boolean;
}

interface CardContextType {
  cards: SavedCard[];
  addCard: (raw: { number: string; name: string; expiry: string; save: boolean }) => SavedCard;
  deleteCard: (id: string) => void;
  setPrimary: (id: string) => void;
  getPrimary: () => SavedCard | null;
}

const CardContext = createContext<CardContextType | null>(null);

function storageKey(email: string) { return `brisa_cards_${email}`; }

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

  useEffect(() => {
    if (!user) { setCards([]); return; }
    try {
      const raw = localStorage.getItem(storageKey(user.email));
      setCards(raw ? JSON.parse(raw) : []);
    } catch { setCards([]); }
  }, [user?.email]);

  function save(list: SavedCard[]) {
    setCards(list);
    if (user) localStorage.setItem(storageKey(user.email), JSON.stringify(list));
  }

  function addCard(raw: { number: string; name: string; expiry: string; save: boolean }): SavedCard {
    const last4 = raw.number.replace(/\s/g, "").slice(-4);
    const brand = detectBrand(raw.number);
    const isFirst = cards.length === 0;
    const card: SavedCard = {
      id: crypto.randomUUID(),
      brand,
      last4,
      holderName: raw.name.trim().toUpperCase(),
      expiry: raw.expiry,
      isPrimary: isFirst,
    };
    if (raw.save) {
      const list = isFirst
        ? [card]
        : [...cards, card];
      save(list);
    }
    return card;
  }

  function deleteCard(id: string) {
    let list = cards.filter(c => c.id !== id);
    if (list.length > 0 && !list.some(c => c.isPrimary)) {
      list[0] = { ...list[0], isPrimary: true };
    }
    save(list);
  }

  function setPrimary(id: string) {
    save(cards.map(c => ({ ...c, isPrimary: c.id === id })));
  }

  function getPrimary(): SavedCard | null {
    return cards.find(c => c.isPrimary) ?? cards[0] ?? null;
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
