import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useOrders, DELIVERY_STATUSES } from "@/context/OrderContext";

export default function MinhaContaPage() {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();

  if (!user) { navigate("/login", { state: { from: "/minha-conta" } }); return null; }

  const orders = getUserOrders(user.email);
  const lastOrder = orders[0];

  const menuItems = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      title: "Meus Pedidos",
      desc: orders.length > 0 ? `${orders.length} pedido${orders.length !== 1 ? "s" : ""}` : "Nenhum pedido ainda",
      to: "/meus-pedidos",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: "Meus Endereços",
      desc: "Gerencie seus endereços de entrega",
      to: "/meus-enderecos",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      title: "Meus Cartões",
      desc: "Métodos de pagamento salvos",
      to: "/meus-cartoes",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      title: "Meus Vinhos",
      desc: user.quizAnswers ? "Recomendações personalizadas" : "Faça o quiz para receber recomendações",
      to: "/quiz-resultado",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 105.93 19.07 10 10 0 0019.07 4.93z"/>
        </svg>
      ),
      title: "Conteúdo Personalizado",
      desc: "Artigos e dicas baseados no seu perfil",
      to: "/conteudo-personalizado",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AE8648" strokeWidth="1.6">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      title: "Minhas Preferências",
      desc: user.quizAnswers ? "Perfil de vinho configurado" : "Configure seu perfil de vinho",
      to: "/quiz-resultado",
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Profile hero */}
      <section className="account-hero">
        <div className="account-avatar">
          <span className="account-avatar-letter">{user.name[0].toUpperCase()}</span>
        </div>
        <h1 className="account-name font-serif">{user.name}</h1>
        <p className="account-email">{user.email}</p>
        {user.quizAnswers && (
          <span className="qr-profile-badge" style={{ marginTop: 12 }}>Perfil personalizado ativo</span>
        )}
      </section>

      <div className="account-main">

        {/* Last order quick link */}
        {lastOrder && (
          <div className="account-last-order" onClick={() => navigate(`/meus-pedidos/${lastOrder.id}`)}>
            <div>
              <p className="account-lo-label">Último pedido</p>
              <p className="account-lo-id">{lastOrder.id}</p>
              <p className="account-lo-status">{`${(DELIVERY_STATUSES as readonly string[])[lastOrder.statusIndex] ?? ""}`}</p>
            </div>
            <div className="account-lo-right">
              <p className="account-lo-total">R$ {lastOrder.total.toFixed(2).replace(".", ",")}</p>
              <span className="account-lo-arrow">→</span>
            </div>
          </div>
        )}

        {/* Menu grid */}
        <div className="account-menu-grid">
          {menuItems.map(({ icon, title, desc, to }) => (
            <button key={title} className="account-menu-item" onClick={() => navigate(to)}>
              <div className="account-menu-icon">{icon}</div>
              <div className="account-menu-text">
                <p className="account-menu-title">{title}</p>
                <p className="account-menu-desc">{desc}</p>
              </div>
              <span className="account-menu-arrow">→</span>
            </button>
          ))}
        </div>

        <button className="account-logout-btn" onClick={() => { logout(); navigate("/"); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair da conta
        </button>
      </div>

      <div style={{ flex: 1 }} />
      <Footer />
    </div>
  );
}
