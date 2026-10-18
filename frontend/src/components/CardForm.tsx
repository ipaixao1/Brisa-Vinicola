import { useState } from "react";
import { useCards } from "@/context/CardContext";

const GOLD = "#AE8648";

interface Props {
  onSave: () => void;
  onCancel: () => void;
  defaultSave?: boolean;
  onCardAdded?: (id: string) => void;
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function CardForm({ onSave, onCancel, defaultSave = false, onCardAdded }: Props) {
  const { addCard } = useCards();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [save, setSave] = useState(defaultSave);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (number.replace(/\s/g, "").length < 13) errs.number = "Número inválido";
    if (!name.trim()) errs.name = "Obrigatório";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = "Use MM/AA";
    if (cvv.length < 3) errs.cvv = "CVV inválido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const card = addCard({ number, name, expiry, save });
    onCardAdded?.(card.id);
    onSave();
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff", fontFamily: "Poppins", fontSize: 13, padding: "10px 14px",
    outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { fontFamily: "Poppins", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 };
  const err: React.CSSProperties = { fontFamily: "Poppins", fontSize: 11, color: "#e05", marginTop: 4 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onCancel}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}
        style={{ background: "#1a1714", border: "1px solid rgba(174,134,72,0.2)", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: 36 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 500, color: "#fff", margin: 0 }}>Novo cartão</h2>
          <button type="button" onClick={onCancel} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Card number */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Número do cartão *</label>
            <input style={{ ...inp, letterSpacing: "0.15em", borderColor: errors.number ? "#e05" : undefined }}
              value={number}
              onChange={e => setNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              maxLength={19}
            />
            {errors.number && <span style={err}>{errors.number}</span>}
          </div>

          {/* Name */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={lbl}>Nome impresso no cartão *</label>
            <input style={{ ...inp, borderColor: errors.name ? "#e05" : undefined }}
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              placeholder="COMO APARECE NO CARTÃO"
            />
            {errors.name && <span style={err}>{errors.name}</span>}
          </div>

          {/* Expiry */}
          <div>
            <label style={lbl}>Validade *</label>
            <input style={{ ...inp, borderColor: errors.expiry ? "#e05" : undefined }}
              value={expiry}
              onChange={e => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/AA"
              maxLength={5}
              inputMode="numeric"
            />
            {errors.expiry && <span style={err}>{errors.expiry}</span>}
          </div>

          {/* CVV */}
          <div>
            <label style={lbl}>CVV *</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inp, paddingRight: 40, borderColor: errors.cvv ? "#e05" : undefined }}
                type={showCvv ? "text" : "password"}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                inputMode="numeric"
              />
              <button type="button" onClick={() => setShowCvv(v => !v)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13 }}>
                {showCvv ? "🙈" : "👁"}
              </button>
            </div>
            {errors.cvv && <span style={err}>{errors.cvv}</span>}
          </div>

          {/* Save checkbox */}
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <input type="checkbox" id="saveCard" checked={save} onChange={e => setSave(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: GOLD, cursor: "pointer" }} />
            <label htmlFor="saveCard" style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
              Salvar este cartão para futuras compras
            </label>
          </div>

          {/* Security note */}
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <span style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Seus dados de pagamento são protegidos.</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>
            CANCELAR
          </button>
          <button type="submit" style={{ flex: 2, background: GOLD, border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "12px 0", cursor: "pointer" }}>
            ADICIONAR CARTÃO
          </button>
        </div>
      </form>
    </div>
  );
}
