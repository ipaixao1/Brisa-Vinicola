import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WineCard from "@/components/WineCard";
import { wines } from "@/data/wines";
import { useCart } from "@/context/CartContext";

const GOLD = "#AE8648";

export default function WineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const wine = wines.find((w) => w.id === Number(id));

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!wine) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="cart-empty">
          <h3 className="cart-empty-title font-serif">Vinho não encontrado</h3>
          <p className="cart-empty-sub">Esse produto não existe ou foi removido do catálogo.</p>
          <Link to="/vinhos" className="auth-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "14px 40px", fontSize: 13 }}>
            VER VINHOS
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = wines
    .filter((w) => w.id !== wine.id && w.type === wine.type)
    .slice(0, 3);

  function handleAdd() {
    if (!wine) return;
    for (let i = 0; i < qty; i++) addToCart(wine);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "120px 24px 0" }}>
        {/* Breadcrumb */}
        <nav style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 28, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Início</Link>
          <span>/</span>
          <Link to="/vinhos" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Vinhos</Link>
          <span>/</span>
          <Link to={`/vinhos?tipo=${encodeURIComponent(wine.type)}`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{wine.type}</Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>{wine.name}</span>
        </nav>

        {/* Main product block */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 420px) 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }} className="wd-grid">
          {/* Image */}
          <div style={{ position: "relative", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
            {wine.badge && (
              <span style={{ position: "absolute", top: 18, left: 18, background: GOLD, color: "#0e0d0c", fontFamily: "Poppins", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", padding: "5px 12px" }}>
                {wine.badge}
              </span>
            )}
            <img src={wine.img} alt={wine.name} style={{ maxHeight: 420, width: "auto", objectFit: "contain" }} />
          </div>

          {/* Info */}
          <div>
            <p style={{ fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, margin: "0 0 10px" }}>
              {wine.type} · {wine.grape} · {wine.origin}
            </p>
            <h1 className="font-serif" style={{ fontSize: "clamp(32px, 4vw, 46px)", color: "#fff", margin: "0 0 6px", lineHeight: 1.1 }}>
              {wine.name}
            </h1>
            <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>
              {wine.producer}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
              {wine.priceOld && (
                <span style={{ fontFamily: "Poppins", fontSize: 16, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>
                  R$ {wine.priceOld.toFixed(2).replace(".", ",")}
                </span>
              )}
              <span style={{ fontFamily: "Poppins", fontSize: 32, fontWeight: 700, color: "#fff" }}>
                R$ {wine.price.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <p style={{ fontFamily: "Poppins", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: "0 0 28px", maxWidth: 560 }}>
              {wine.description}
            </p>

            {/* Traits */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {wine.traits.map((t) => (
                <span key={t} style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(174,134,72,0.3)", padding: "6px 14px" }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: 40, height: 44, background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}
                  aria-label="Diminuir quantidade"
                >−</button>
                <span style={{ width: 40, textAlign: "center", fontFamily: "Poppins", fontSize: 14, color: "#fff" }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{ width: 40, height: 44, background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}
                  aria-label="Aumentar quantidade"
                >+</button>
              </div>

              <button
                onClick={handleAdd}
                className="auth-btn"
                style={{ flex: "1 1 220px", fontSize: 13, letterSpacing: "0.12em", padding: "14px 24px", background: added ? "#2a5" : undefined }}
              >
                {added ? "VINHO ADICIONADO ✓" : "ADICIONAR AO CARRINHO"}
              </button>
            </div>
            <button
              onClick={() => navigate("/vinhos")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "Poppins", fontSize: 12, cursor: "pointer", padding: "6px 0" }}
            >
              ← Continuar explorando vinhos
            </button>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 20, marginTop: 36, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <Spec label="Teor Alcoólico" value={wine.alcohol} />
              <Spec label="Acidez Total" value={wine.acidity} />
              <Spec label="Volume" value={wine.volume} />
              <Spec label="Temperatura de serviço" value={wine.servingTemp} />
            </div>

            {/* Pairings */}
            <div style={{ marginTop: 32 }}>
              <h4 style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", margin: "0 0 12px" }}>
                Harmoniza bem com
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {wine.pairings.map((p) => (
                  <span key={p} style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)", padding: "7px 14px" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related wines */}
        {related.length > 0 && (
          <section style={{ marginTop: "clamp(56px, 8vw, 96px)", paddingBottom: 80 }}>
            <div className="auth-deco-line" style={{ margin: "0 0 18px" }} />
            <h2 className="font-serif" style={{ fontSize: "clamp(26px, 3vw, 34px)", color: "#fff", margin: "0 0 28px" }}>
              Vinhos parecidos
            </h2>
            <div className="vgrid">
              {related.map((w) => <WineCard key={w.id} wine={w} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: "Poppins", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontFamily: "Poppins", fontSize: 14, color: "#fff", margin: 0 }}>{value}</p>
    </div>
  );
}
