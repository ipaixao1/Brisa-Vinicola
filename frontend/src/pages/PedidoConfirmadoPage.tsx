import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { CartItem } from "@/context/CartContext";

interface LocationState {
  orderNum: string;
  total: number;
  items: CartItem[];
}

export default function PedidoConfirmadoPage() {
  const { state } = useLocation();
  const { orderNum, total, items } = (state as LocationState) ?? { orderNum: "BV-000000", total: 0, items: [] };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div className="confirm-page">
        <div className="confirm-card">
          <div className="confirm-check">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>

          <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
          <h1 className="confirm-title font-serif">Pedido realizado com sucesso!</h1>
          <p className="confirm-sub">
            Obrigado pela sua compra. Seu pedido foi recebido e está sendo preparado com todo cuidado.
          </p>

          <div className="confirm-order-badge">
            <span className="confirm-order-label">Número do pedido</span>
            <span className="confirm-order-num">{orderNum}</span>
          </div>

          {items.length > 0 && (
            <div className="confirm-items">
              <h3 className="confirm-items-title">Resumo da compra</h3>
              {items.map(({ wine, qty }) => (
                <div key={wine.id} className="checkout-order-item">
                  <span className="checkout-order-item-name">{wine.name} × {qty}</span>
                  <span style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                    R$ {(wine.price * qty).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
              <div className="cart-summary-divider" style={{ margin: "12px 0" }} />
              <div className="cart-summary-row cart-summary-total">
                <span>Total pago</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          )}

          <Link to="/vinhos" className="auth-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "14px 48px", fontSize: 13, letterSpacing: "0.14em", marginTop: 32 }}>
            CONTINUAR COMPRANDO
          </Link>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
