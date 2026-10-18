import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WA_NUMBER = "5511999999999";
const EMAIL = "contato@brisavinicola.com.br";
const PHONE = "(11) 9 9999-9999";

const faqItems = [
  { q: "Como faço para realizar uma compra?", a: "Navegue pela nossa seleção de vinhos, escolha o produto desejado e clique em 'Adicionar ao carrinho'. Finalize a compra com seus dados de entrega e pagamento." },
  { q: "Quais são as formas de pagamento?", a: "Aceitamos cartões de crédito (Visa, Mastercard), Pix e boleto bancário. Parcele em até 6x sem juros nos cartões participantes." },
  { q: "Vocês entregam em todo o Brasil?", a: "Sim! Realizamos entregas em todo o território nacional. O prazo e o frete variam conforme a sua região." },
  { q: "Qual é o prazo de entrega?", a: "O prazo varia de 3 a 10 dias úteis após a confirmação do pagamento, dependendo da localidade." },
  { q: "Posso acompanhar meu pedido?", a: "Sim. Após o despacho, você receberá um código de rastreio por e-mail para acompanhar o status da entrega." },
  { q: "Posso cancelar ou alterar meu pedido?", a: "Cancelamentos e alterações podem ser solicitados em até 24h após o pedido. Entre em contato pelo WhatsApp ou e-mail." },
  { q: "Como funciona a troca ou devolução?", a: "Caso o produto chegue com defeito ou diferente do pedido, entre em contato em até 7 dias após o recebimento. Cobrimos todos os custos da devolução." },
  { q: "Como posso entrar em contato com a loja?", a: "Você pode nos contatar via WhatsApp, e-mail ou pelo formulário nesta página. Respondemos em até 24 horas úteis." },
];

interface FormState { name: string; email: string; subject: string; message: string; }

export default function FaleConoscoPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero */}
      <section className="contact-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <h1 className="contact-hero-title font-serif">Fale Conosco</h1>
        <p className="contact-hero-sub">Estamos aqui para ajudar você.</p>
        <p className="contact-hero-text">
          Tem alguma dúvida, sugestão ou precisa de ajuda para escolher o vinho perfeito?<br />
          Nossa equipe está pronta para atendê-lo com todo o cuidado que você merece.
        </p>
      </section>

      {/* Main content */}
      <div className="contact-main">

        {/* Contact info + Form row */}
        <div className="contact-top-row">

          {/* Contact info */}
          <div className="contact-info-col">
            <h2 className="contact-section-title">Informações de Contato</h2>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div>
                <p className="contact-info-label">WhatsApp</p>
                <p className="contact-info-value">{PHONE}</p>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-wa-btn"
                >
                  Falar pelo WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="contact-info-label">E-mail</p>
                <a href={`mailto:${EMAIL}`} className="contact-info-link">{EMAIL}</a>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121 15l.92 1.92z"/>
                </svg>
              </div>
              <div>
                <p className="contact-info-label">Telefone</p>
                <p className="contact-info-value">{PHONE}</p>
              </div>
            </div>

            <div className="contact-info-block">
              <div className="contact-info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="contact-info-label">Horário de Atendimento</p>
                <p className="contact-info-value">Segunda a Sexta: 9h às 18h</p>
                <p className="contact-info-value">Sábado: 10h às 14h</p>
              </div>
            </div>

            {/* Social */}
            <div className="contact-social-row">
              <a href="#" className="contact-social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                Instagram
              </a>
              <a href="#" className="contact-social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-col">
            <h2 className="contact-section-title">Envie sua dúvida</h2>

            {sent ? (
              <div className="contact-success">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3 className="contact-success-title">Mensagem enviada com sucesso!</h3>
                <p className="contact-success-sub">Nossa equipe entrará em contato com você em breve.</p>
                <button className="contact-success-btn" onClick={() => setSent(false)}>Enviar outra mensagem</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label className="auth-label">Nome</label>
                  <input className="auth-input" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">E-mail</label>
                  <input className="auth-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Assunto</label>
                  <input className="auth-input" name="subject" value={form.subject} onChange={handleChange} placeholder="Sobre o que você quer falar?" required />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Mensagem</label>
                  <textarea className="auth-input contact-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Escreva sua mensagem aqui..." rows={5} required />
                </div>
                <button type="submit" className="auth-btn">ENVIAR MENSAGEM</button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="contact-faq-section">
          <h2 className="contact-section-title" style={{ textAlign: "center", marginBottom: 36 }}>Dúvidas frequentes</h2>
          <div className="contact-faq-list">
            {faqItems.map((item, i) => (
              <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="contact-wa-cta">
          <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
          <h3 className="contact-wa-cta-title font-serif">Ainda ficou com alguma dúvida?</h3>
          <p className="contact-wa-cta-sub">Nossa equipe está pronta para ajudar.</p>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-wa-big-btn"
          >
            Falar com a gente pelo WhatsApp
          </a>
        </div>

      </div>

      <Footer />
    </div>
  );
}
