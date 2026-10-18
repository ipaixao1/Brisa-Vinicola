import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddressForm, { type AddressFormData } from "@/components/AddressForm";
import { useAddresses, type Address } from "@/context/AddressContext";
import { useAuth } from "@/context/AuthContext";

const GOLD = "#AE8648";

export default function MeusEnderecosPage() {
  const { user } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setPrimary } = useAddresses();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!user) {
    navigate("/login", { state: { from: "/meus-enderecos" } });
    return null;
  }

  const editingAddr = editingId ? addresses.find(a => a.id === editingId) : null;

  function handleSaveNew(data: AddressFormData) {
    addAddress(data);
    setShowForm(false);
  }

  function handleSaveEdit(data: AddressFormData) {
    if (!editingId) return;
    updateAddress(editingId, data);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    deleteAddress(id);
    setConfirmDeleteId(null);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <section className="cart-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Meus Endereços</h1>
        <p className="contact-hero-sub">Gerencie seus endereços de entrega</p>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", padding: "40px 24px 80px", flex: 1 }}>

        {/* Back link */}
        <button onClick={() => navigate("/minha-conta")} style={{ background: "none", border: "none", color: GOLD, fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", marginBottom: 32, padding: 0, display: "flex", alignItems: "center", gap: 8 }}>
          ← Voltar para Minha Conta
        </button>

        {/* Empty state */}
        {addresses.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(174,134,72,0.35)" strokeWidth="1.2" style={{ marginBottom: 20 }}>
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <p style={{ fontFamily: "Poppins", fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>
              Você ainda não possui endereços cadastrados.
            </p>
            <button onClick={() => setShowForm(true)} style={{ background: GOLD, border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "14px 32px", cursor: "pointer" }}>
              + ADICIONAR ENDEREÇO
            </button>
          </div>
        )}

        {/* Address list */}
        {addresses.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {addresses.map(addr => (
                <AddressCard
                  key={addr.id}
                  addr={addr}
                  onEdit={() => setEditingId(addr.id)}
                  onDelete={() => setConfirmDeleteId(addr.id)}
                  onSetPrimary={() => setPrimary(addr.id)}
                />
              ))}
            </div>

            <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "1px dashed rgba(174,134,72,0.35)", color: GOLD, fontFamily: "Poppins", fontSize: 13, letterSpacing: "0.08em", padding: "16px 24px", cursor: "pointer", width: "100%", justifyContent: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(174,134,72,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(174,134,72,0.35)")}
            >
              + Adicionar novo endereço
            </button>
          </>
        )}
      </div>

      <Footer />

      {/* Add form */}
      {showForm && (
        <AddressForm
          title="Novo endereço"
          onSave={handleSaveNew}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit form */}
      {editingAddr && (
        <AddressForm
          title="Editar endereço"
          initial={{ ...editingAddr }}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmDeleteId && (
        <ConfirmDelete
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

function AddressCard({ addr, onEdit, onDelete, onSetPrimary }: {
  addr: Address; onEdit: () => void; onDelete: () => void; onSetPrimary: () => void;
}) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${addr.isPrimary ? "rgba(174,134,72,0.45)" : "rgba(255,255,255,0.08)"}`, padding: "24px 28px", position: "relative" }}>
      {addr.isPrimary && (
        <span style={{ position: "absolute", top: 16, right: 20, fontFamily: "Poppins", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, border: `1px solid ${GOLD}`, padding: "3px 10px" }}>
          Principal
        </span>
      )}
      <p style={{ fontFamily: "Poppins", fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>{addr.recipient}</p>
      <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 2px", lineHeight: 1.7 }}>
        {addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ""}
      </p>
      <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 2px" }}>
        {addr.neighborhood} — {addr.city}/{addr.state}
      </p>
      <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 2px" }}>CEP {addr.cep}</p>
      {addr.reference && <p style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "4px 0 0", fontStyle: "italic" }}>{addr.reference}</p>}

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        {!addr.isPrimary && (
          <button onClick={onSetPrimary} style={ghostBtnStyle}>Definir como principal</button>
        )}
        <button onClick={onEdit} style={ghostBtnStyle}>Editar</button>
        <button onClick={onDelete} style={{ ...ghostBtnStyle, color: "rgba(220,80,80,0.7)", borderColor: "rgba(220,80,80,0.2)" }}>Excluir</button>
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onCancel}>
      <div style={{ background: "#1a1714", border: "1px solid rgba(174,134,72,0.2)", padding: 40, maxWidth: 400, width: "100%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.7)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
        </svg>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, color: "#fff", margin: "0 0 10px" }}>Excluir endereço?</h3>
        <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.6 }}>
          Tem certeza que deseja excluir este endereço?<br />Essa ação não pode ser desfeita.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>
            CANCELAR
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: "rgba(200,60,60,0.85)", border: "none", color: "#fff", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>
            EXCLUIR
          </button>
        </div>
      </div>
    </div>
  );
}

const ghostBtnStyle: React.CSSProperties = {
  background: "none", border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 11,
  letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px",
  cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
};
