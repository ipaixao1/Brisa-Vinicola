import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Wine } from "@/data/wines";
import { api, toWine, type ApiWine } from "@/services/api";

interface ApiWineList {
  items: ApiWine[];
  total: number;
  page: number;
  pages: number;
}

interface WinesContextValue {
  wines: Wine[];
  allGrapes: string[];
  allTypes: readonly Wine["type"][];
  loading: boolean;
  error: string | null;
}

const WinesContext = createContext<WinesContextValue | null>(null);

const allTypes = ["Tinto", "Branco", "Espumante", "Rosé"] as const;

// Busca o catálogo completo na API (a API entrega até 50 vinhos por página)
async function fetchAllWines(): Promise<Wine[]> {
  const first = await api<ApiWineList>("/wines?page=1&page_size=50", { auth: false });
  let items = first.items;
  for (let page = 2; page <= first.pages; page++) {
    const next = await api<ApiWineList>(`/wines?page=${page}&page_size=50`, { auth: false });
    items = items.concat(next.items);
  }
  return items.map(toWine);
}

export function WinesProvider({ children }: { children: ReactNode }) {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllWines()
      .then((list) => {
        if (!cancelled) setWines(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erro ao carregar os vinhos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allGrapes = useMemo(() => [...new Set(wines.map((w) => w.grape))].sort(), [wines]);

  return (
    <WinesContext.Provider value={{ wines, allGrapes, allTypes, loading, error }}>
      {children}
    </WinesContext.Provider>
  );
}

export function useWines() {
  const ctx = useContext(WinesContext);
  if (!ctx) throw new Error("useWines must be used inside WinesProvider");
  return ctx;
}
