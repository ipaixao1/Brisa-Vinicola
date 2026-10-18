import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCards, type SavedCard } from "@/context/CardContext";
import { useAuth } from "@/context/AuthContext";
import CardForm from "@/components/CardForm";

const GOLD = "#AE8648";

export default function MeusCartoesPage() {
  const { user } = useAuth();
  const { cards, deleteCard, setPrimary } = useCards();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!user) {
    navigate("/login", { state: { from: "/meus-cartoes" } });
    return null;
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Meus Cartões</h1>
        <p className="contact-hero-sub">Gerencie seus métodos de pagamento</p>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", padding: "40px 24px 80px", flex: 1 }}>

        <button onClick={() => navigate("/minha-conta")} style={{ background: "none", border: "none", color: GOLD, fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", marginBottom: 32, padding: 0 }}>
          ← Voltar para Minha Conta
        </button>

        <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 28, lineHeight: 1.7 }}>
          🔒 Seus dados de pagamento são protegidos. Apenas os últimos 4 dígitos são armazenados.
        </p>

        {cards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(174,134,72,0.35)" strokeWidth="1.2" style={{ marginBottom: 20 }}>
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <p style={{ fontFamily: "Poppins", fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>
              Você ainda não possui cartões cadastrados.
            </p>
            <button onClick={() => setShowForm(true)} style={{ background: GOLD, border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "14px 32px", cursor: "pointer" }}>
              + ADICIONAR CARTÃO
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {cards.map(card => (
                <SavedCardCard
                  key={card.id}
                  card={card}
                  onSetPrimary={() => setPrimary(card.id)}
                  onDelete={() => setConfirmDeleteId(card.id)}
                />
              ))}
            </div>

            <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "none", border: "1px dashed rgba(174,134,72,0.35)", color: GOLD, fontFamily: "Poppins", fontSize: 13, letterSpacing: "0.08em", padding: "16px 24px", cursor: "pointer", width: "100%" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(174,134,72,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(174,134,72,0.35)")}
            >
              + Adicionar novo cartão
            </button>
          </>
        )}
      </div>

      <Footer />

      {showForm && (
        <CardForm
          onSave={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
          defaultSave
        />
      )}

      {confirmDeleteId && (
        <ConfirmDelete
          onConfirm={() => { deleteCard(confirmDeleteId); setConfirmDeleteId(null); }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

export function SavedCardCard({ card, onSetPrimary, onDelete }: { card: SavedCard; onSetPrimary?: () => void; onDelete?: () => void }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${card.isPrimary ? "rgba(174,134,72,0.45)" : "rgba(255,255,255,0.08)"}`, padding: "22px 28px", position: "relative" }}>
      {card.isPrimary && (
        <span style={{ position: "absolute", top: 16, right: 20, fontFamily: "Poppins", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, border: `1px solid ${GOLD}`, padding: "3px 10px" }}>
          Principal
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <BrandIcon brand={card.brand} />
        <div>
          <p style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 3px" }}>
            {card.brand} •••• {card.last4}
          </p>
          <p style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            {card.holderName}
          </p>
        </div>
      </div>
      <p style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>
        Validade: {card.expiry}
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!card.isPrimary && onSetPrimary && (
          <button onClick={onSetPrimary} style={ghostBtn}>Definir como principal</button>
        )}
        {onDelete && (
          <button onClick={onDelete} style={{ ...ghostBtn, color: "rgba(220,80,80,0.7)", borderColor: "rgba(220,80,80,0.2)" }}>Excluir</button>
        )}
      </div>
    </div>
  );
}

function BrandIcon({ brand }: { brand: string }) {
  const colors: Record<string, string> = {
    Visa: "#1A1F71", Mastercard: "#EB001B", Elo: "#FFD700",
    Amex: "#007BC1", Hipercard: "#B3131A", Outro: "#555",
  };
  return (
    <div style={{ width: 44, height: 28, background: colors[brand] ?? "#555", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "Poppins", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{brand.toUpperCase().slice(0, 4)}</span>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onCancel}>
      <div style={{ background: "#1a1714", border: "1px solid rgba(174,134,72,0.2)", padding: 40, maxWidth: 400, width: "100%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, color: "#fff", margin: "0 0 10px" }}>Excluir cartão?</h3>
        <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.6 }}>
          Tem certeza que deseja excluir este cartão?
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>CANCELAR</button>
          <button onClick={onConfirm} style={{ flex: 1, background: "rgba(200,60,60,0.85)", border: "none", color: "#fff", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>EXCLUIR</button>
        </div>
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  background: "none", border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 11,
  letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer",
};
