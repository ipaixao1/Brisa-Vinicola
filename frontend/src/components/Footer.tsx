export default function Footer() {
  const benefits = [
    {
      label: "Pagamento seguro",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
          <line x1="6" y1="15" x2="10" y2="15"/>
        </svg>
      ),
    },
    {
      label: "Embalagem personalizada",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      label: "Enviado diretamente para sua casa",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      label: "Entrega com garantia",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
    },
  ];

  const navLinks = [
    "Sobre",
    "Contato",
    "Parcerias de marca",
    "Mapa do site",
    "Carreiras",
    "Política de conteúdo",
  ];

  return (
    <footer className="site-footer">

      {/* ── 1. Benefits strip ── */}
      <div className="footer-benefits">
        <div className="footer-inner">
          {benefits.map((b) => (
            <div key={b.label} className="benefit-item">
              <span className="benefit-icon">{b.icon}</span>
              <span className="benefit-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Social & payments strip ── */}
      <div className="footer-social-pay">
        <div className="footer-inner footer-social-pay-inner">
          {/* Social icons */}
          <div className="footer-socials">
            <a href="#" aria-label="Instagram" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>

          {/* Payment badges */}
          <div className="footer-payments">
            {/* Visa */}
            <div className="pay-badge" title="Visa">
              <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
                <rect width="38" height="22" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                <text x="50%" y="15" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="#AE8648" letterSpacing="1">VISA</text>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="pay-badge" title="Mastercard">
              <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
                <rect width="38" height="22" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                <circle cx="14" cy="11" r="5.5" fill="rgba(235,0,27,0.5)"/>
                <circle cx="24" cy="11" r="5.5" fill="rgba(255,130,0,0.5)"/>
              </svg>
            </div>
            {/* Pix */}
            <div className="pay-badge" title="Pix">
              <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
                <rect width="38" height="22" rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
                <text x="50%" y="15" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#AE8648" letterSpacing="0.5">PIX</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Nav links & copyright ── */}
      <div className="footer-nav-area">
        <div className="footer-inner">
          <nav className="footer-nav">
            {navLinks.map((link, i) => (
              <span key={link} className="footer-nav-item">
                <a href="#" className="footer-nav-link">{link}</a>
                {i < navLinks.length - 1 && <span className="footer-nav-sep">·</span>}
              </span>
            ))}
          </nav>
          <p className="footer-copy">© {new Date().getFullYear()} Brisa Vinícola. Todos os direitos reservados.</p>
        </div>
      </div>

    </footer>
  );
}
