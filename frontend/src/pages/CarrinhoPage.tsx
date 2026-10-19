import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CarrinhoPage() {
  const { items, totalItems, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthGate, setShowAuthGate] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.wine.price * i.qty, 0);

  function handleFinalize() {
    if (!user) {
      setShowAuthGate(true);
    } else {
      navigate("/checkout");
    }
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Meu Carrinho</h1>
        <p className="contact-hero-sub">
          {totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? "s" : ""} selecionado${totalItems !== 1 ? "s" : ""}` : "Seu carrinho está vazio"}
        </p>
      </section>

      {items.length === 0 ? (
        <div className="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(174,134,72,0.4)" strokeWidth="1.2">
            <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <h3 className="cart-empty-title font-serif">Seu carrinho está vazio</h3>
          <p className="cart-empty-sub">Que tal encontrar um vinho especial para você?</p>
          <Link to="/vinhos" className="auth-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "14px 40px", fontSize: 13 }}>VER VINHOS</Link>
        </div>
      ) : (
        <div className="cart-main">
          {/* Items list */}
          <div className="cart-items-col">
            {items.map(({ wine, qty }) => (
              <div key={wine.id} className="cart-item">
                <div className="cart-item-img-wrap">
                  <img src={wine.img} alt={wine.name} className="cart-item-img" />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-type">{wine.type} · {wine.grape}</p>
                  <h3 className="cart-item-name">{wine.name}</h3>
                  <p className="cart-item-origin">{wine.origin}</p>
                  <p className="cart-item-unit-price">R$ {wine.price.toFixed(2).replace(".", ",")} / un.</p>
                </div>
                <div className="cart-item-controls">
                  <div className="cart-qty-row">
                    <button className="cart-qty-btn" onClick={() => updateQty(wine.id, qty - 1)}>−</button>
                    <span className="cart-qty-val">{qty}</span>
                    <button className="cart-qty-btn" onClick={() => updateQty(wine.id, qty + 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">R$ {(wine.price * qty).toFixed(2).replace(".", ",")}</p>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(wine.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h3 className="cart-summary-title">Resumo do pedido</h3>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="cart-summary-row">
              <span>Frete</span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>Calculado no checkout</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total dos produtos</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <button className="auth-btn" style={{ marginTop: 20, fontSize: 13, letterSpacing: "0.14em" }} onClick={handleFinalize}>
              FINALIZAR COMPRA
            </button>
            <Link to="/vinhos" className="cart-continue-link">← Continuar comprando</Link>
          </div>
        </div>
      )}

      {/* Auth gate modal */}
      {showAuthGate && (
        <div className="quiz-backdrop" onClick={() => setShowAuthGate(false)}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quiz-close" onClick={() => setShowAuthGate(false)}>✕</button>
            <div className="quiz-intro" style={{ gap: 20 }}>
              <div className="quiz-deco-line" />
              <h2 className="quiz-main-title font-serif">Entre para continuar</h2>
              <p className="quiz-intro-sub">Para finalizar sua compra, você precisa entrar na sua conta.</p>
              <button className="quiz-btn-primary" onClick={() => { setShowAuthGate(false); navigate("/login", { state: { from: "/checkout" } }); }}>ENTRAR</button>
              <button className="quiz-btn-ghost" onClick={() => { setShowAuthGate(false); navigate("/cadastro", { state: { from: "/checkout" } }); }}>CRIAR CONTA</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
