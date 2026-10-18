import { useState } from "react";
import type { Address } from "@/context/AddressContext";

const GOLD = "#AE8648";

export type AddressFormData = Omit<Address, "id" | "isPrimary"> & { isPrimary: boolean };

const emptyForm: AddressFormData = {
  recipient: "", cep: "", street: "", number: "",
  complement: "", neighborhood: "", city: "", state: "", reference: "", isPrimary: false,
};

interface Props {
  initial?: Partial<AddressFormData>;
  onSave: (data: AddressFormData) => void;
  onCancel: () => void;
  title?: string;
}

export default function AddressForm({ initial, onSave, onCancel, title = "Novo endereço" }: Props) {
  const [form, setForm] = useState<AddressFormData>({ ...emptyForm, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(f => ({ ...f, [name]: val }));
    setErrors(ev => ({ ...ev, [name]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.recipient.trim()) errs.recipient = "Obrigatório";
    if (form.cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
    if (!form.street.trim()) errs.street = "Obrigatório";
    if (!form.number.trim()) errs.number = "Obrigatório";
    if (!form.neighborhood.trim()) errs.neighborhood = "Obrigatório";
    if (!form.city.trim()) errs.city = "Obrigatório";
    if (form.state.trim().length !== 2) errs.state = "UF inválida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff", fontFamily: "Poppins", fontSize: 13, padding: "10px 14px",
    outline: "none", boxSizing: "border-box",
  };
  const errStyle: React.CSSProperties = { fontFamily: "Poppins", fontSize: 11, color: "#e05", marginTop: 4 };
  const labelStyle: React.CSSProperties = { fontFamily: "Poppins", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        style={{ background: "#1a1714", border: "1px solid rgba(174,134,72,0.2)", width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", padding: 36 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 500, color: "#fff", margin: 0 }}>{title}</h2>
          <button type="button" onClick={onCancel} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Recipient */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Nome do destinatário *</label>
            <input style={{ ...inputStyle, borderColor: errors.recipient ? "#e05" : undefined }} name="recipient" value={form.recipient} onChange={change} />
            {errors.recipient && <span style={errStyle}>{errors.recipient}</span>}
          </div>

          {/* CEP */}
          <div>
            <label style={labelStyle}>CEP *</label>
            <input style={{ ...inputStyle, borderColor: errors.cep ? "#e05" : undefined }} name="cep" value={form.cep} onChange={change} placeholder="00000-000" maxLength={9} />
            {errors.cep && <span style={errStyle}>{errors.cep}</span>}
          </div>

          {/* State */}
          <div>
            <label style={labelStyle}>Estado (UF) *</label>
            <input style={{ ...inputStyle, borderColor: errors.state ? "#e05" : undefined }} name="state" value={form.state} onChange={change} placeholder="SP" maxLength={2} />
            {errors.state && <span style={errStyle}>{errors.state}</span>}
          </div>

          {/* Street */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Rua / Avenida *</label>
            <input style={{ ...inputStyle, borderColor: errors.street ? "#e05" : undefined }} name="street" value={form.street} onChange={change} />
            {errors.street && <span style={errStyle}>{errors.street}</span>}
          </div>

          {/* Number */}
          <div>
            <label style={labelStyle}>Número *</label>
            <input style={{ ...inputStyle, borderColor: errors.number ? "#e05" : undefined }} name="number" value={form.number} onChange={change} />
            {errors.number && <span style={errStyle}>{errors.number}</span>}
          </div>

          {/* Complement */}
          <div>
            <label style={labelStyle}>Complemento</label>
            <input style={inputStyle} name="complement" value={form.complement} onChange={change} placeholder="Apto, bloco..." />
          </div>

          {/* Neighborhood */}
          <div>
            <label style={labelStyle}>Bairro *</label>
            <input style={{ ...inputStyle, borderColor: errors.neighborhood ? "#e05" : undefined }} name="neighborhood" value={form.neighborhood} onChange={change} />
            {errors.neighborhood && <span style={errStyle}>{errors.neighborhood}</span>}
          </div>

          {/* City */}
          <div>
            <label style={labelStyle}>Cidade *</label>
            <input style={{ ...inputStyle, borderColor: errors.city ? "#e05" : undefined }} name="city" value={form.city} onChange={change} />
            {errors.city && <span style={errStyle}>{errors.city}</span>}
          </div>

          {/* Reference */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Ponto de referência</label>
            <input style={inputStyle} name="reference" value={form.reference} onChange={change} placeholder="Próximo ao..." />
          </div>

          {/* Is primary */}
          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <input type="checkbox" name="isPrimary" id="isPrimary" checked={form.isPrimary} onChange={change}
              style={{ width: 16, height: 16, accentColor: GOLD, cursor: "pointer" }} />
            <label htmlFor="isPrimary" style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
              Definir como endereço principal
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "Poppins", fontSize: 12, letterSpacing: "0.1em", padding: "12px 0", cursor: "pointer" }}>
            CANCELAR
          </button>
          <button type="submit" style={{ flex: 2, background: GOLD, border: "none", color: "#0e0d0c", fontFamily: "Poppins", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "12px 0", cursor: "pointer" }}>
            SALVAR ENDEREÇO
          </button>
        </div>
      </form>
    </div>
  );
}
