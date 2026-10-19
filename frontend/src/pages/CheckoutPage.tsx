import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressForm, { type AddressFormData } from "@/components/AddressForm";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAddresses, type Address } from "@/context/AddressContext";

const GOLD = "#AE8648";

function calcFrete(cep: string, state: string): number | null {
  const clean = cep.replace(/\D/g, "");
  if (clean.length < 8) return null;
  const uf = state.toUpperCase().trim();
  if (!uf || uf.length !== 2) return null;
  const table: Record<string, number> = {
    SP: 14.9, RJ: 19.9, MG: 18.9, RS: 24.9, SC: 22.9, PR: 21.9,
    BA: 27.9, PE: 28.9, CE: 29.9, GO: 23.9, DF: 22.9, ES: 20.9,
    AM: 39.9, PA: 36.9, MT: 28.9, MS: 26.9, RO: 38.9, AC: 42.9,
    RR: 44.9, AP: 43.9, TO: 31.9, MA: 32.9, PI: 31.9, AL: 29.9,
    SE: 28.9, RN: 30.9, PB: 29.9,
  };
  return table[uf] ?? 29.9;
}

export default function CheckoutPage() {
  const { items } = useCart();
  const { user } = useAuth();
  const { addresses, addAddress, getPrimary } = useAddresses();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customer, setCustomer] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "" });
  const [frete, setFrete] = useState<number | null>(null);
  const [freteStatus, setFreteStatus] = useState<"idle" | "calculating" | "done" | "error">("idle");

  const subtotal = items.reduce((s, i) => s + i.wine.price * i.qty, 0);
  const total = frete !== null ? subtotal + frete : subtotal;
  const selectedAddr = addresses.find(a => a.id === selectedId) ?? null;
  const hasAddresses = addresses.length > 0;

  // Auto-select primary on mount / when addresses change
  useEffect(() => {
    const primary = getPrimary();
    if (primary && !selectedId) setSelectedId(primary.id);
  }, [addresses]);

  // Recalculate frete when selected address changes
  useEffect(() => {
    setFrete(null);
    setFreteStatus("idle");
    if (!selectedAddr) return;
    setFreteStatus("calculating");
    const t = setTimeout(() => {
      const result = calcFrete(selectedAddr.cep, selectedAddr.state);
      if (result !== null) { setFrete(result); setFreteStatus("done"); }
      else setFreteStatus("error");
    }, 700);
    return () => clearTimeout(t);
  }, [selectedId]);

  function handleAddAddress(data: AddressFormData) {
    const newAddr = addAddress(data);
    setSelectedId(newAddr.id);
    setShowAddForm(false);
  }

  function handleProceed(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddr || frete === null) return;
    const address = {
      cep: selectedAddr.cep,
      street: selectedAddr.street,
      number: selectedAddr.number,
      complement: selectedAddr.complement,
      district: selectedAddr.neighborhood,
      city: selectedAddr.city,
      state: selectedAddr.state,
    };
    navigate("/pagamento", { state: { customer, address, subtotal, frete, total, items } });
  }

  const canProceed = !!selectedAddr && frete !== null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Checkout</h1>
        <p className="contact-hero-sub">Confirme seu endereço de entrega.</p>
      </section>

      {/* Progress steps */}
      <div className="checkout-steps">
        <div className="checkout-step active">
          <span className="checkout-step-num">1</span>
          <span className="checkout-step-label">Endereço</span>
        </div>
        <div className="checkout-step-line" />
        <div className="checkout-step">
          <span className="checkout-step-num">2</span>
          <span className="checkout-step-label">Pagamento</span>
        </div>
        <div className="checkout-step-line" />
        <div className="checkout-step">
          <span className="checkout-step-num">3</span>
          <span className="checkout-step-label">Confirmação</span>
        </div>
      </div>

      <form className="checkout-main" onSubmit={handleProceed}>
        <div className="checkout-col">

          {/* Customer */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">Dados do cliente</h2>
            <div className="checkout-grid-2">
              <div className="auth-field">
                <label className="auth-label">Nome completo</label>
                <input className="auth-input" name="name" value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} required />
              </div>
              <div className="auth-field">
                <label className="auth-label">E-mail</label>
                <input className="auth-input" type="email" name="email" value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} required />
              </div>
              <div className="auth-field">
                <label className="auth-label">Telefone</label>
                <input className="auth-input" name="phone" value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} placeholder="(11) 9 9999-9999" required />
              </div>
            </div>
          </div>

          {/* Address selection */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">Endereço de entrega</h2>

            {!hasAddresses ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
                  Você ainda não possui endereços cadastrados.
                </p>
                <button type="button" onClick={() => setShowAddForm(true)} style={{ background: GOLD, border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "12px 28px", cursor: "pointer" }}>
                  + ADICIONAR ENDEREÇO
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  {addresses.map(addr => (
                    <CheckoutAddressCard
                      key={addr.id}
                      addr={addr}
                      selected={selectedId === addr.id}
                      onSelect={() => setSelectedId(addr.id)}
                    />
                  ))}
                </div>

                <button type="button" onClick={() => setShowAddForm(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(174,134,72,0.3)", color: GOLD, fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.08em", padding: "12px 20px", cursor: "pointer", width: "100%" }}>
                  + Adicionar novo endereço
                </button>

                {/* Frete status */}
                <div style={{ marginTop: 16 }}>
                  {freteStatus === "calculating" && (
                    <p className="checkout-frete-msg"><span className="checkout-frete-spinner" /> Calculando frete...</p>
                  )}
                  {freteStatus === "done" && frete !== null && (
                    <p className="checkout-frete-msg checkout-frete-ok">✓ Frete calculado: <strong>R$ {frete.toFixed(2).replace(".", ",")}</strong></p>
                  )}
                  {freteStatus === "error" && (
                    <p className="checkout-frete-msg checkout-frete-err">Não foi possível calcular o frete para este endereço.</p>
                  )}
                </div>
              </>
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
                  <span style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                    R$ {(wine.price * qty).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="cart-summary-row">
              <span>Frete</span>
              {freteStatus === "calculating"
                ? <span style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic", fontFamily: "Poppins", fontSize: 12 }}>Calculando...</span>
                : frete !== null
                  ? <span style={{ color: GOLD, fontFamily: "Poppins", fontWeight: 600 }}>R$ {frete.toFixed(2).replace(".", ",")}</span>
                  : <span style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic", fontFamily: "Poppins", fontSize: 12 }}>Selecione um endereço</span>
              }
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            {!canProceed && (
              <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>
                {!selectedAddr ? "Selecione um endereço para continuar." : "Aguardando cálculo do frete."}
              </p>
            )}
            <button type="submit" className="auth-btn" style={{ marginTop: 16, fontSize: 13, letterSpacing: "0.14em", opacity: canProceed ? 1 : 0.4, cursor: canProceed ? "pointer" : "not-allowed" }} disabled={!canProceed}>
              PROSSEGUIR PARA PAGAMENTO →
            </button>
          </div>
        </div>
      </form>

      <div style={{ flex: 1 }} />
      <Footer />

      {showAddForm && (
        <AddressForm
          title="Adicionar endereço"
          onSave={handleAddAddress}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function CheckoutAddressCard({ addr, selected, onSelect }: { addr: Address; selected: boolean; onSelect: () => void }) {
  return (
    <div onClick={onSelect} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "18px 20px", border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.1)"}`, background: selected ? "rgba(174,134,72,0.06)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}>
      {/* Radio dot */}
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? GOLD : "rgba(255,255,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "#fff" }}>{addr.recipient}</span>
          {addr.isPrimary && <span style={{ fontFamily: "Poppins", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, border: `1px solid ${GOLD}`, padding: "2px 7px" }}>Principal</span>}
        </div>
        <p style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7 }}>
          {addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ""}<br />
          {addr.neighborhood} — {addr.city}/{addr.state} · CEP {addr.cep}
        </p>
      </div>
    </div>
  );
}
