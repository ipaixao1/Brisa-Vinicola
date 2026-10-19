import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardForm from "@/components/CardForm";
import { SavedCardCard } from "@/pages/MeusCartoesPage";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders, type PayMethod, type OrderAddress } from "@/context/OrderContext";
import { useCards, type SavedCard } from "@/context/CardContext";
import type { CartItem } from "@/context/CartContext";

const GOLD = "#AE8648";

interface LocationState {
  customer: { name: string; email: string; phone: string };
  address: OrderAddress;
  subtotal: number;
  frete: number;
  total: number;
  items: CartItem[];
}

type Stage = "select" | "processing" | "pix-waiting" | "confirmed";

const PIX_CODE = "00020126580014BR.GOV.BCB.PIX0136a4d2e2e8-7c3f-4b1a-9d5c-brisavinicola5204000053039865802BR5923BRISA VINICOLA LTDA6009SAO PAULO62070503***6304A2B3";

function InstallmentSelect({ total, value, onChange }: { total: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="pay-installments">
      <label className="auth-label" style={{ marginBottom: 8, display: "block" }}>Parcelamento</label>
      <div className="pay-installments-grid">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button"
            className={`pay-installment-opt${value === n ? " active" : ""}`}
            onClick={() => onChange(n)}
          >
            <span className="pay-inst-n">{n}×</span>
            <span className="pay-inst-amt">R$ {(total / n).toFixed(2).replace(".", ",")}</span>
            <span className="pay-inst-tag">{n === 1 ? "à vista" : "sem juros"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { cards, getPrimary } = useCards();

  const state = location.state as LocationState | null;

  const [payMethod, setPayMethod] = useState<PayMethod>("pix");
  // Saved card selection
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  // Debit card fields (not saved)
  const [debitNumber, setDebitNumber] = useState("");
  const [debitName, setDebitName] = useState("");
  const [debitExpiry, setDebitExpiry] = useState("");
  const [debitCvv, setDebitCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [stage, setStage] = useState<Stage>("select");
  const [pixCountdown, setPixCountdown] = useState(10);
  const [processingMsg, setProcessingMsg] = useState("Processando pagamento...");
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Auto-select primary card on mount / when cards change
  useEffect(() => {
    if (payMethod === "cartao-credito") {
      const primary = getPrimary();
      if (primary && !selectedCardId) setSelectedCardId(primary.id);
      else if (cards.length === 0) setShowCardForm(true);
    }
  }, [payMethod, cards.length]);

  if (!state || !user) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="cart-empty">
          <h3 className="cart-empty-title font-serif">Sessão inválida</h3>
          <p className="cart-empty-sub">Retorne ao carrinho para iniciar a compra.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { subtotal, frete, total, items, address } = state;
  const selectedCard = cards.find(c => c.id === selectedCardId) ?? null;

  function createOrder() {
    const order = addOrder({
      items, subtotal, frete, total,
      payMethod,
      installments: payMethod === "cartao-credito" ? installments : 1,
      address,
      statusIndex: 0,
      userEmail: user!.email,
    });
    clearCart();
    return order.id;
  }

  function handlePix() {
    setStage("pix-waiting");
    let count = 10;
    setPixCountdown(count);
    const timer = setInterval(() => {
      count--;
      setPixCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        const id = createOrder();
        setOrderId(id);
        setStage("confirmed");
      }
    }, 1000);
  }

  function handleCard() {
    setStage("processing");
    setProcessingMsg("Processando pagamento...");
    setTimeout(() => setProcessingMsg("Verificando dados da transação..."), 1500);
    setTimeout(() => setProcessingMsg("Autorizando com o banco..."), 3000);
    setTimeout(() => {
      const id = createOrder();
      setOrderId(id);
      setStage("confirmed");
    }, 4500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (payMethod === "pix") { handlePix(); return; }
    if (payMethod === "cartao-credito" && !selectedCard) return;
    handleCard();
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Processing screen ──────────────────────────────────────────────────────
  if (stage === "processing") {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="pay-processing-screen">
          <div className="pay-processing-ring"><div className="pay-processing-spinner" /></div>
          <h2 className="pay-processing-title font-serif">Processando pagamento</h2>
          <p className="pay-processing-msg">{processingMsg}</p>
          <p className="pay-processing-sub">Não feche ou recarregue esta página.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ── PIX waiting screen ─────────────────────────────────────────────────────
  if (stage === "pix-waiting") {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="pay-pix-screen">
          <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
          <h2 className="contact-hero-title font-serif" style={{ marginBottom: 8 }}>Pagamento via PIX</h2>
          <p className="pay-pix-amount">R$ {total.toFixed(2).replace(".", ",")}</p>
          {pixCountdown > 0 && (
            <>
              <p className="pay-pix-status"><span className="pay-pix-dot" />Aguardando confirmação do pagamento...</p>
              <div className="pay-pix-countdown-wrap">
                <svg className="pay-pix-clock" viewBox="0 0 36 36" width="64" height="64">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(174,134,72,0.15)" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#AE8648" strokeWidth="2"
                    strokeDasharray={`${(pixCountdown / 10) * 100.53} 100.53`} strokeLinecap="round"
                    transform="rotate(-90 18 18)" style={{ transition: "stroke-dasharray 1s linear" }} />
                  <text x="18" y="23" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="Poppins" fontWeight="700">{pixCountdown}s</text>
                </svg>
              </div>
              <div className="pay-qr-wrap">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                  <rect width="160" height="160" fill="#fff" rx="4" />
                  {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                    const isCorner = (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
                    return isCorner ? <rect key={`${r}-${c}`} x={8+c*21} y={8+r*21} width={18} height={18} fill="#0e0d0c" rx="1" /> : null;
                  }))}
                  <rect x="20" y="20" width="42" height="42" fill="#fff" rx="1" /><rect x="27" y="27" width="28" height="28" fill="#0e0d0c" rx="1" />
                  <rect x="98" y="20" width="42" height="42" fill="#fff" rx="1" /><rect x="105" y="27" width="28" height="28" fill="#0e0d0c" rx="1" />
                  <rect x="20" y="98" width="42" height="42" fill="#fff" rx="1" /><rect x="27" y="105" width="28" height="28" fill="#0e0d0c" rx="1" />
                  <rect x="70" y="70" width="8" height="8" fill="#0e0d0c" rx="1" /><rect x="82" y="70" width="8" height="8" fill="#0e0d0c" rx="1" />
                  <rect x="94" y="82" width="8" height="8" fill="#0e0d0c" rx="1" /><rect x="70" y="94" width="8" height="8" fill="#0e0d0c" rx="1" />
                  <rect x="82" y="82" width="8" height="8" fill="#0e0d0c" rx="1" />
                </svg>
              </div>
              <div className="pay-pix-code-wrap">
                <p className="pay-pix-code-label">Código PIX copia e cola</p>
                <div className="pay-pix-code-row">
                  <span className="pay-pix-code">{PIX_CODE.slice(0, 48)}...</span>
                  <button type="button" className="pay-copy-btn" onClick={copyPix}>{copied ? "✓ Copiado!" : "Copiar código"}</button>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ── Confirmed screen ───────────────────────────────────────────────────────
  if (stage === "confirmed") {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="pay-confirmed-screen">
          <div className="confirm-check" style={{ width: 80, height: 80, marginBottom: 24 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
          <h1 className="confirm-title font-serif">Pagamento aprovado!</h1>
          <p className="confirm-sub">
            {payMethod === "pix" ? "PIX confirmado." : "Pagamento com cartão aprovado."}{" "}
            Seu pedido foi criado e está sendo preparado.
          </p>
          <div className="confirm-order-badge" style={{ marginBottom: 32 }}>
            <span className="confirm-order-label">Número do pedido</span>
            <span className="confirm-order-num">{orderId}</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="auth-btn" style={{ fontSize: 12, letterSpacing: "0.12em", padding: "13px 32px" }} onClick={() => navigate(`/meus-pedidos/${orderId}`)}>
              ACOMPANHAR PEDIDO
            </button>
            <button className="quiz-btn-ghost" style={{ fontSize: 12, letterSpacing: "0.1em" }} onClick={() => navigate("/vinhos")}>
              CONTINUAR COMPRANDO
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Payment selection screen ───────────────────────────────────────────────
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Pagamento</h1>
        <p className="contact-hero-sub">Escolha como deseja pagar.</p>
      </section>

      <div className="checkout-steps">
        <div className="checkout-step done"><span className="checkout-step-num">✓</span><span className="checkout-step-label">Endereço</span></div>
        <div className="checkout-step-line done" />
        <div className="checkout-step active"><span className="checkout-step-num">2</span><span className="checkout-step-label">Pagamento</span></div>
        <div className="checkout-step-line" />
        <div className="checkout-step"><span className="checkout-step-num">3</span><span className="checkout-step-label">Confirmação</span></div>
      </div>

      <form className="checkout-main" onSubmit={handleSubmit}>
        <div className="checkout-col">
          <div className="checkout-section">
            <h2 className="checkout-section-title">Forma de pagamento</h2>

            {/* Method tabs */}
            <div className="pay-method-tabs">
              {([
                { id: "pix" as PayMethod, label: "PIX", icon: "⚡", tag: "Aprovação imediata" },
                { id: "cartao-credito" as PayMethod, label: "Cartão de Crédito", icon: "💳", tag: "Até 6× sem juros" },
                { id: "cartao-debito" as PayMethod, label: "Cartão de Débito", icon: "🏦", tag: "" },
              ]).map(({ id, label, icon, tag }) => (
                <button key={id} type="button"
                  className={`pay-method-tab${payMethod === id ? " active" : ""}`}
                  onClick={() => { setPayMethod(id); setSelectedCardId(null); setShowCardForm(false); }}
                >
                  <span className="pay-method-icon">{icon}</span>
                  <span className="pay-method-label">{label}</span>
                  {tag && <span className="pay-method-tag">{tag}</span>}
                </button>
              ))}
            </div>

            {/* ── PIX ── */}
            {payMethod === "pix" && (
              <div className="pay-pix-info">
                <div className="pay-pix-icon">⚡</div>
                <div>
                  <p className="pay-pix-info-title">Pague com PIX</p>
                  <p className="pay-pix-info-desc">Aprovação em segundos. Após clicar em "Pagar com PIX", um QR Code será exibido para você escanear.</p>
                </div>
              </div>
            )}

            {/* ── Credit card — saved cards + installments ── */}
            {payMethod === "cartao-credito" && (
              <div style={{ marginTop: 24 }}>
                {cards.length > 0 && (
                  <>
                    <p className="auth-label" style={{ marginBottom: 12 }}>Selecione um cartão</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                      {cards.map(card => (
                        <SelectableCard key={card.id} card={card} selected={selectedCardId === card.id} onSelect={() => { setSelectedCardId(card.id); setShowCardForm(false); }} />
                      ))}
                    </div>
                  </>
                )}

                {cards.length === 0 && !showCardForm && (
                  <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>
                    Você não possui cartões salvos.
                  </p>
                )}

                <button type="button" onClick={() => { setShowCardForm(true); setSelectedCardId(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(174,134,72,0.35)", color: GOLD, fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.08em", padding: "12px 20px", cursor: "pointer", width: "100%", marginBottom: 20 }}>
                  + Adicionar novo cartão
                </button>

                {selectedCard && (
                  <InstallmentSelect total={total} value={installments} onChange={setInstallments} />
                )}
              </div>
            )}

            {/* ── Debit card ── */}
            {payMethod === "cartao-debito" && (
              <div className="checkout-grid-2" style={{ marginTop: 24 }}>
                <div className="auth-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Número do cartão</label>
                  <input className="auth-input" value={debitNumber}
                    onChange={e => setDebitNumber(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                    placeholder="0000 0000 0000 0000" maxLength={19} required />
                </div>
                <div className="auth-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Nome impresso no cartão</label>
                  <input className="auth-input" value={debitName} onChange={e => setDebitName(e.target.value.toUpperCase())} placeholder="COMO APARECE NO CARTÃO" required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Validade</label>
                  <input className="auth-input" value={debitExpiry}
                    onChange={e => { const d = e.target.value.replace(/\D/g,"").slice(0,4); setDebitExpiry(d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d); }}
                    placeholder="MM/AA" maxLength={5} required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">CVV</label>
                  <input className="auth-input" type="password" value={debitCvv}
                    onChange={e => setDebitCvv(e.target.value.replace(/\D/g,"").slice(0,4))}
                    placeholder="•••" maxLength={4} required />
                </div>
                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13 }}>🔒</span>
                  <span style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Seus dados de pagamento são protegidos.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="checkout-summary-col">
          <div className="cart-summary" style={{ position: "sticky", top: 90 }}>
            <h3 className="cart-summary-title">Resumo do pedido</h3>
            <div style={{ marginBottom: 16 }}>
              {items.map(({ wine, qty }) => (
                <div key={wine.id} className="checkout-order-item">
                  <span className="checkout-order-item-name">{wine.name} × {qty}</span>
                  <span style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>R$ {(wine.price * qty).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary-row">
              <span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="cart-summary-row">
              <span>Frete ({address.state})</span>
              <span style={{ color: GOLD, fontFamily: "Poppins", fontWeight: 600 }}>R$ {frete.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span><span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            {payMethod === "cartao-credito" && installments > 1 && selectedCard && (
              <p style={{ fontFamily: "Poppins", fontSize: 11, color: GOLD, textAlign: "center", margin: "8px 0 0" }}>
                {installments}× de R$ {(total / installments).toFixed(2).replace(".", ",")} sem juros
              </p>
            )}
            {payMethod === "cartao-credito" && !selectedCard && (
              <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>
                Selecione ou adicione um cartão para continuar.
              </p>
            )}
            <button type="submit"
              className="auth-btn"
              style={{ marginTop: 16, fontSize: 13, letterSpacing: "0.14em", opacity: (payMethod === "cartao-credito" && !selectedCard) ? 0.4 : 1, cursor: (payMethod === "cartao-credito" && !selectedCard) ? "not-allowed" : "pointer" }}
              disabled={payMethod === "cartao-credito" && !selectedCard}
            >
              {payMethod === "pix" ? "PAGAR COM PIX" : payMethod === "cartao-credito" ? "PAGAR COM CARTÃO" : "PAGAR COM DÉBITO"}
            </button>
          </div>
        </div>
      </form>

      <div style={{ flex: 1 }} />
      <Footer />

      {showCardForm && (
        <CardForm
          onSave={() => setShowCardForm(false)}
          onCancel={() => setShowCardForm(false)}
          defaultSave={false}
          onCardAdded={(id) => setSelectedCardId(id)}
        />
      )}
    </div>
  );
}

function SelectableCard({ card, selected, onSelect }: { card: SavedCard; selected: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 20px", border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.1)"}`, background: selected ? "rgba(174,134,72,0.06)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? GOLD : "rgba(255,255,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "#fff" }}>{card.brand} •••• {card.last4}</span>
          {card.isPrimary && <span style={{ fontFamily: "Poppins", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, border: `1px solid ${GOLD}`, padding: "2px 7px" }}>Principal</span>}
        </div>
        <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>
          {card.holderName} · Validade {card.expiry}
        </p>
      </div>
    </div>
  );
}
