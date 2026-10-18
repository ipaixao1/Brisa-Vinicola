import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders, DELIVERY_STATUSES } from "@/context/OrderContext";

const PAY_LABELS: Record<string, string> = {
  "pix": "PIX",
  "cartao-credito": "Cartão de Crédito",
  "cartao-debito": "Cartão de Débito",
};

const ROUTE_UPDATES = [
  "Pedido recebido e em fila de preparação.",
  "Pagamento confirmado. Pedido autorizado.",
  "Equipe de estoque separando os itens.",
  "Pedido despachado do armazém central.",
  "Em trânsito na transportadora parceira.",
  "Pedido saiu para entrega final.",
  "Entregue no endereço informado.",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function deliveryDate(iso: string) {
  const d = new Date(iso);
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

// Simulated map — SVG route with animated marker
function DeliveryMap({ progress }: { progress: number }) {
  // progress: 0–1, representing how far along the route the marker is
  const pathPoints = [
    [40, 140], [80, 120], [120, 100], [140, 80], [160, 70], [190, 60], [220, 55],
    [250, 60], [270, 75], [290, 90], [310, 100], [340, 95], [360, 80],
  ] as [number, number][];

  function getPointAtProgress(pts: [number, number][], p: number): [number, number] {
    const totalSegs = pts.length - 1;
    const segIdx = Math.min(Math.floor(p * totalSegs), totalSegs - 1);
    const segProgress = (p * totalSegs) - segIdx;
    const [x1, y1] = pts[segIdx];
    const [x2, y2] = pts[segIdx + 1];
    return [x1 + (x2 - x1) * segProgress, y1 + (y2 - y1) * segProgress];
  }

  const pathD = `M ${pathPoints.map(([x, y]) => `${x},${y}`).join(" L ")}`;
  const [mx, my] = getPointAtProgress(pathPoints, progress);
  const [ox, oy] = pathPoints[0];
  const [dx, dy] = pathPoints[pathPoints.length - 1];

  return (
    <div className="track-map-wrap">
      <p className="track-map-label">Rota de entrega simulada</p>
      <svg viewBox="0 0 400 180" className="track-map-svg" preserveAspectRatio="xMidYMid meet">
        {/* Background grid */}
        {[0,1,2,3,4,5,6,7].map(r => (
          <line key={`h${r}`} x1="0" y1={r * 25} x2="400" y2={r * 25} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(c => (
          <line key={`v${c}`} x1={c * 27} y1="0" x2={c * 27} y2="180" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Route path — grey (full) */}
        <path d={pathD} stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Route path — gold (progress) */}
        <path d={pathD} stroke="#AE8648" strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray="1000" strokeDashoffset={1000 - progress * 1000}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />

        {/* Origin */}
        <circle cx={ox} cy={oy} r="8" fill="#AE8648" />
        <text x={ox} y={oy + 20} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Poppins">Origem</text>

        {/* Destination */}
        <circle cx={dx} cy={dy} r="8" fill={progress >= 0.99 ? "#AE8648" : "rgba(255,255,255,0.2)"} stroke="#AE8648" strokeWidth="2" />
        <text x={dx} y={dy + 20} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Poppins">Destino</text>

        {/* Animated marker */}
        {progress > 0 && progress < 1 && (
          <g transform={`translate(${mx},${my})`}>
            <circle r="12" fill="rgba(174,134,72,0.2)" />
            <circle r="7" fill="#AE8648" />
            <circle r="3" fill="#fff" />
          </g>
        )}

        {/* Last update label */}
        <text x="200" y="170" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="Poppins">
          Última atualização: há {Math.floor(Math.random() * 10 + 1)} min
        </text>
      </svg>
    </div>
  );
}

type ConfirmState = "pending" | "confirmed" | "not-received";

export default function AcompanharPedidoPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getOrder, advanceStatus } = useOrders();
  const navigate = useNavigate();

  const [order, setOrder] = useState(() => id ? getOrder(id) : undefined);
  const [confirmState, setConfirmState] = useState<ConfirmState>("pending");

  // Refresh order from storage
  function refresh() {
    if (id) setOrder(getOrder(id));
  }

  // Auto-advance every 5 seconds until "Entregue"
  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      const current = id ? getOrder(id) : undefined;
      if (!current) return;
      const isDelivered = current.statusIndex >= DELIVERY_STATUSES.length - 1;
      if (!isDelivered) {
        advanceStatus(id!);
        setOrder(getOrder(id!));
      } else {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!user) { navigate("/login", { state: { from: `/meus-pedidos/${id}` } }); return null; }
  if (!order) return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="cart-empty"><h3 className="cart-empty-title font-serif">Pedido não encontrado</h3></div>
      <Footer />
    </div>
  );

  const isDelivered = order.statusIndex >= DELIVERY_STATUSES.length - 1;
  const progress = order.statusIndex / (DELIVERY_STATUSES.length - 1);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Acompanhe seu pedido</h1>
        <p className="contact-hero-sub">Pedido {order.id} · {formatDate(order.date)}</p>
      </section>

      <div className="track-main">

        {/* Left: timeline + info */}
        <div className="track-left">

          {/* Delivery info */}
          <div className="track-delivery-info">
            <div>
              <p className="track-info-label">Previsão de entrega</p>
              <p className="track-info-val">{deliveryDate(order.date)}</p>
            </div>
            <div>
              <p className="track-info-label">Endereço</p>
              <p className="track-info-val">{order.address.street}, {order.address.number} · {order.address.city}/{order.address.state}</p>
            </div>
          </div>

          {/* Simulated map */}
          <DeliveryMap progress={isDelivered ? 1 : progress} />

          {/* Current update */}
          <div className="track-current-update">
            <div className="track-update-dot" />
            <div>
              <p className="track-update-label">Atualização mais recente</p>
              <p className="track-update-text">{ROUTE_UPDATES[order.statusIndex]}</p>
            </div>
          </div>

          {/* Delivery confirmation flow */}
          {isDelivered && confirmState === "pending" && (
            <div style={{ border: "1px solid rgba(174,134,72,0.35)", background: "rgba(174,134,72,0.06)", padding: "28px 24px", marginTop: 24 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#AE8648", margin: "0 0 8px" }}>
                Você recebeu o pedido?
              </p>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 24px" }}>
                Seu pedido chegou ao endereço de entrega. Por favor, confirme o recebimento.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => setConfirmState("confirmed")}
                  style={{ flex: 1, minWidth: 140, background: "#AE8648", border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "13px 20px", cursor: "pointer" }}
                >
                  SIM, RECEBI MEU PEDIDO
                </button>
                <button
                  onClick={() => setConfirmState("not-received")}
                  style={{ flex: 1, minWidth: 140, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", padding: "13px 20px", cursor: "pointer" }}
                >
                  NÃO, AINDA NÃO RECEBI
                </button>
              </div>
            </div>
          )}

          {isDelivered && confirmState === "confirmed" && (
            <div style={{ border: "1px solid rgba(174,134,72,0.35)", background: "rgba(174,134,72,0.06)", padding: "28px 24px", marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#AE8648", margin: 0 }}>Entrega confirmada!</p>
                  <p style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>Pedido finalizado · {formatDate(order.date)}</p>
                </div>
              </div>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 20px" }}>
                Obrigado por escolher a Brisa Vinícola. Esperamos que aprecie cada gole!
              </p>
              <button className="track-reorder-btn" onClick={() => navigate("/vinhos")}>Comprar novamente</button>
            </div>
          )}

          {isDelivered && confirmState === "not-received" && (
            <div style={{ border: "1px solid rgba(255,80,80,0.25)", background: "rgba(255,80,80,0.04)", padding: "28px 24px", marginTop: 24 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: "#e57", margin: "0 0 8px" }}>
                Entrega pendente de confirmação
              </p>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 20px" }}>
                Registramos que você ainda não recebeu seu pedido. Nossa equipe está acompanhando a situação. Entre em contato para obter suporte.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  onClick={() => navigate("/fale-conosco")}
                  style={{ background: "none", border: "1px solid rgba(255,80,80,0.4)", color: "#e57", fontFamily: "Poppins", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", padding: "12px 24px", cursor: "pointer" }}
                >
                  PRECISO DE AJUDA
                </button>
                <button
                  onClick={() => setConfirmState("pending")}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontFamily: "Poppins", fontSize: 12, cursor: "pointer", padding: "12px 0" }}
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: timeline + order summary */}
        <div className="track-right">

          {/* Status timeline */}
          <div className="track-timeline-card">
            <h3 className="track-timeline-title">Status do pedido</h3>
            <div className="track-timeline">
              {DELIVERY_STATUSES.map((status, i) => {
                const done = i <= order.statusIndex;
                const current = i === order.statusIndex && confirmState === "pending";
                return (
                  <div key={status} className="track-step">
                    <div className="track-step-left">
                      <div className={`track-step-dot${done ? " done" : ""}${current ? " current" : ""}`}>
                        {done && !current && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0e0d0c" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      {(i < DELIVERY_STATUSES.length - 1 || confirmState === "confirmed") && (
                        <div className={`track-step-line${done ? " done" : ""}`} />
                      )}
                    </div>
                    <div className="track-step-right">
                      <p className={`track-step-label${done ? " done" : ""}${current ? " current" : ""}`}>{status}</p>
                      {current && <p className="track-step-sub">{ROUTE_UPDATES[i]}</p>}
                    </div>
                  </div>
                );
              })}
              {confirmState === "confirmed" && (
                <div className="track-step">
                  <div className="track-step-left">
                    <div className="track-step-dot done" style={{ background: "#AE8648" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0e0d0c" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                  <div className="track-step-right">
                    <p className="track-step-label done" style={{ color: "#AE8648" }}>Pedido finalizado</p>
                    <p className="track-step-sub">Entrega confirmada pelo cliente</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="cart-summary">
            <h3 className="cart-summary-title">Resumo do pedido</h3>
            {order.items.map(({ wine, qty }) => (
              <div key={wine.id} className="checkout-order-item">
                <span className="checkout-order-item-name">{wine.name} × {qty}</span>
                <span style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                  R$ {(wine.price * qty).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 12 }} />
            <div className="cart-summary-row"><span>Subtotal</span><span>R$ {order.subtotal.toFixed(2).replace(".", ",")}</span></div>
            <div className="cart-summary-row"><span>Frete</span><span>R$ {order.frete.toFixed(2).replace(".", ",")}</span></div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total"><span>Total</span><span>R$ {order.total.toFixed(2).replace(".", ",")}</span></div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="orders-meta-row" style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Pagamento</span>
                <span style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{PAY_LABELS[order.payMethod]}</span>
              </p>
            </div>
          </div>

          <button className="cart-continue-link" style={{ display: "block", textAlign: "center", background: "none", border: "none", cursor: "pointer", marginTop: 12 }} onClick={() => navigate("/meus-pedidos")}>
            ← Todos os pedidos
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
