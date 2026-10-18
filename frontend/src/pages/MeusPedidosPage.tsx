import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders, DELIVERY_STATUSES, type Order } from "@/context/OrderContext";

const PAY_LABELS: Record<string, string> = {
  "pix": "PIX",
  "cartao-credito": "Cartão de Crédito",
  "cartao-debito": "Cartão de Débito",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function OrderCard({ order, onTrack, onReorder }: { order: Order; onTrack: () => void; onReorder: () => void }) {
  const status = DELIVERY_STATUSES[order.statusIndex];
  const isDelivered = order.statusIndex === DELIVERY_STATUSES.length - 1;
  const totalItems = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="orders-card">
      <div className="orders-card-header">
        <div>
          <p className="orders-id">Pedido {order.id}</p>
          <p className="orders-date">{formatDate(order.date)}</p>
        </div>
        <div className={`orders-status-badge${isDelivered ? " delivered" : ""}`}>{status}</div>
      </div>

      <div className="orders-card-body">
        <div className="orders-items-preview">
          {order.items.slice(0, 3).map(({ wine, qty }) => (
            <div key={wine.id} className="orders-item-row">
              <img src={wine.img} alt={wine.name} className="orders-item-img" />
              <div>
                <p className="orders-item-name">{wine.name}</p>
                <p className="orders-item-qty">{qty} un. · R$ {(wine.price * qty).toFixed(2).replace(".", ",")}</p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="orders-more">+{order.items.length - 3} produto(s)</p>
          )}
        </div>

        <div className="orders-meta">
          <div className="orders-meta-row">
            <span>Produtos</span><span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
          </div>
          <div className="orders-meta-row">
            <span>Pagamento</span><span>{PAY_LABELS[order.payMethod]}</span>
          </div>
          <div className="orders-meta-row orders-meta-total">
            <span>Total</span><span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>

      <div className="orders-card-footer">
        <button className="orders-track-btn" onClick={onTrack}>ACOMPANHAR PEDIDO</button>
        {isDelivered && (
          <button className="orders-reorder-btn" onClick={onReorder}>Comprar novamente</button>
        )}
      </div>
    </div>
  );
}

export default function MeusPedidosPage() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login", { state: { from: "/meus-pedidos" } });
    return null;
  }

  const orders = getUserOrders(user.email);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Meus Pedidos</h1>
        <p className="contact-hero-sub">
          {orders.length === 0 ? "Você ainda não realizou nenhum pedido." : `${orders.length} pedido${orders.length !== 1 ? "s" : ""} encontrado${orders.length !== 1 ? "s" : ""}.`}
        </p>
      </section>

      <div className="orders-main">
        {orders.length === 0 ? (
          <div className="cart-empty">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(174,134,72,0.3)" strokeWidth="1.2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <h3 className="cart-empty-title font-serif" style={{ fontSize: "clamp(24px,4vw,40px)" }}>Nenhum pedido ainda</h3>
            <p className="cart-empty-sub">Explore nossa seleção e faça seu primeiro pedido.</p>
            <button className="auth-btn" style={{ fontSize: 12, letterSpacing: "0.14em", padding: "13px 40px" }} onClick={() => navigate("/vinhos")}>
              VER VINHOS
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={() => navigate(`/meus-pedidos/${order.id}`)}
                onReorder={() => navigate("/vinhos")}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
