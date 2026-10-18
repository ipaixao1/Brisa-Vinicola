import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WineCard from "@/components/WineCard";
import { wines, allGrapes, allTypes, type Wine } from "@/data/wines";

const GOLD = "#AE8648";
const PAGE_SIZE = 9;

type SortKey = "recentes" | "menor" | "maior" | "vendidos" | "az";
type CategoryTab = "TODOS" | "TINTOS" | "BRANCOS" | "ESPUMANTES" | "ROSÉ";

const tabMap: Record<CategoryTab, Wine["type"] | null> = {
  TODOS: null,
  TINTOS: "Tinto",
  BRANCOS: "Branco",
  ESPUMANTES: "Espumante",
  "ROSÉ": "Rosé",
};

const typeToTab: Record<Wine["type"], CategoryTab> = {
  Tinto: "TINTOS",
  Branco: "BRANCOS",
  Espumante: "ESPUMANTES",
  "Rosé": "ROSÉ",
};

export default function VinhosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lê filtros vindos pela URL (ex: Home → "Tipo de vinho" ou busca no Header)
  const initialTab = (() => {
    const t = searchParams.get("tipo");
    return (t && typeToTab[t as Wine["type"]]) || "TODOS";
  })();

  const [tab, setTab] = useState<CategoryTab>(initialTab);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number } | null>(null);
  const [typeFilters, setTypeFilters] = useState<Set<string>>(new Set());
  const [grapeFilters, setGrapeFilters] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("recentes");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Mantém o estado em sincronia se o usuário chegar de outro link (Home, Header…)
  useEffect(() => {
    const t = searchParams.get("tipo");
    const q = searchParams.get("q");
    setTab((t && typeToTab[t as Wine["type"]]) || "TODOS");
    setSearch(q ?? "");
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function toggleSet(set: Set<string>, val: string): Set<string> {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  }

  const filtered = useMemo(() => {
    let list = [...wines];

    // Tab
    const tabType = tabMap[tab];
    if (tabType) list = list.filter((w) => w.type === tabType);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.grape.toLowerCase().includes(q) ||
          w.producer.toLowerCase().includes(q)
      );
    }

    // Price
    if (priceFilter) {
      list = list.filter((w) => w.price >= priceFilter.min && w.price <= priceFilter.max);
    }

    // Type checkboxes
    if (typeFilters.size > 0) {
      list = list.filter((w) => typeFilters.has(w.type));
    }

    // Grape checkboxes
    if (grapeFilters.size > 0) {
      list = list.filter((w) => grapeFilters.has(w.grape));
    }

    // Sort
    switch (sort) {
      case "menor": list.sort((a, b) => a.price - b.price); break;
      case "maior": list.sort((a, b) => b.price - a.price); break;
      case "az": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "recentes": list.sort((a, b) => b.date - a.date); break;
      case "vendidos": list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }

    return list;
  }, [tab, search, priceFilter, typeFilters, grapeFilters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyPrice() {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    setPriceFilter({ min, max });
    setPage(1);
  }

  function clearAll() {
    setTab("TODOS");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPriceFilter(null);
    setTypeFilters(new Set());
    setGrapeFilters(new Set());
    setSort("recentes");
    setPage(1);
  }

  const Filters = () => (
    <aside className="vsidebar">
      <div className="vsidebar-section">
        <h4 className="vsidebar-title">Preço</h4>
        <div className="vsidebar-price-row">
          <input
            className="vprice-input"
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="vsidebar-dash">—</span>
          <input
            className="vprice-input"
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button className="vsidebar-apply" onClick={applyPrice}>FILTRAR</button>
      </div>

      <div className="vsidebar-section">
        <h4 className="vsidebar-title">Tipo</h4>
        {allTypes.map((t) => (
          <label key={t} className="vcheck-label">
            <input
              type="checkbox"
              className="vcheck"
              checked={typeFilters.has(t)}
              onChange={() => { setTypeFilters(toggleSet(typeFilters, t)); setPage(1); }}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>

      <div className="vsidebar-section">
        <h4 className="vsidebar-title">Uva</h4>
        {allGrapes.map((g) => (
          <label key={g} className="vcheck-label">
            <input
              type="checkbox"
              className="vcheck"
              checked={grapeFilters.has(g)}
              onChange={() => { setGrapeFilters(toggleSet(grapeFilters, g)); setPage(1); }}
            />
            <span>{g}</span>
          </label>
        ))}
      </div>

      <button className="vsidebar-clear" onClick={clearAll}>Limpar filtros</button>
    </aside>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* ── Page hero ── */}
      <section className="vpage-hero">
        <div className="vpage-deco-line" />
        <h1 className="vpage-title font-serif">Vinhos</h1>
        <p className="vpage-desc">
          Descubra nossa seleção cuidadosamente escolhida de vinhos de todo o mundo.<br className="vhero-br" />
          Do terroir único ao cuidado artesanal, cada garrafa conta uma história.
        </p>
      </section>

      {/* ── Category tabs ── */}
      <div className="vtabs-wrap">
        <div className="vtabs">
          {(Object.keys(tabMap) as CategoryTab[]).map((t) => (
            <button
              key={t}
              className={`vtab${tab === t ? " active" : ""}`}
              onClick={() => { setTab(t); setPage(1); }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* ── Search + Sort bar ── */}
      <div className="vsearch-bar-wrap">
        <div className="vsearch-bar-inner">
          {/* Search input */}
          <div className="vsearch-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="vsearch-input"
              type="text"
              placeholder="Buscar vinhos..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="vsearch-bar-right">
            {/* Mobile filter toggle */}
            <button className="vmobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filtrar vinhos
            </button>

            {/* Count */}
            <span className="vcount">
              Mostrando {paginated.length} de {filtered.length} vinho{filtered.length !== 1 ? "s" : ""}
            </span>

            {/* Sort */}
            <select
              className="vsort"
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
              <option value="vendidos">Mais vendidos</option>
              <option value="az">Nome: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar + grid ── */}
      <div className="vmain">
        <Filters />

        <div className="vgrid-area">
          {paginated.length === 0 ? (
            <div className="vempty">
              <p>Nenhum vinho encontrado com os filtros selecionados.</p>
              <button className="vsidebar-clear" onClick={clearAll}>Limpar filtros</button>
            </div>
          ) : (
            <div className="vgrid">
              {paginated.map((w) => <WineCard key={w.id} wine={w} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="vpagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`vpage-btn${page === p ? " active" : ""}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="vmobile-drawer-backdrop" onClick={() => setMobileFiltersOpen(false)}>
          <div className="vmobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="vmobile-drawer-head">
              <span style={{ fontFamily: "Poppins", fontWeight: 600, color: "#fff", fontSize: 14 }}>Filtrar vinhos</span>
              <button onClick={() => setMobileFiltersOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <Filters />
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
