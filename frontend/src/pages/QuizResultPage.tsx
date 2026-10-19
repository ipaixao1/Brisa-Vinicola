import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { scoreWines, getProfileLabel } from "@/utils/recommendations";
import { Link } from "react-router-dom";

const GOLD = "#AE8648";

function CompatBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 6 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: GOLD, borderRadius: 2, transition: "width 0.8s ease" }} />
    </div>
  );
}

export default function QuizResultPage() {
  const { user } = useAuth();

  if (!user?.quizAnswers) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "Poppins", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Você ainda não respondeu ao quiz.
          </p>
          <Link to="/" style={{ fontFamily: "Poppins", fontSize: 12, color: "#AE8648", border: "1px solid #AE8648", padding: "10px 28px", textDecoration: "none" }}>
            Ir para o quiz
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const scored = scoreWines(user.quizAnswers);
  const top = scored.slice(0, 6);
  const profile = getProfileLabel(user.quizAnswers);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero */}
      <section className="qr-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 22px" }} />
        <p className="qr-greeting">Olá, {user.name}!</p>
        <h1 className="qr-title font-serif">Vinhos para você</h1>
        <p className="qr-sub">Com base nas suas respostas, selecionamos alguns vinhos que combinam com o seu perfil.</p>
        <span className="qr-profile-badge">{profile}</span>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px,4vw,48px) 80px", width: "100%" }}>
        <div className="qr-grid">
          {top.map((wine) => (
            <div key={wine.id} className="qr-card">
              <div className="qr-card-compat">
                <span className="qr-compat-pct">{wine.compatibility}%</span>
                <span className="qr-compat-label">{wine.label}</span>
              </div>
              <CompatBar pct={wine.compatibility} />

              <div className="qr-bottle-wrap">
                <img src={wine.img} alt={wine.name} className="qr-bottle" />
              </div>

              <div className="qr-card-body">
                <p className="qr-wine-type">{wine.type} · {wine.grape}</p>
                <h3 className="qr-wine-name">{wine.name}</h3>
                <p className="qr-wine-origin">{wine.origin}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "10px 0 14px" }}>
                  {wine.priceOld && (
                    <span style={{ fontFamily: "Poppins", fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>
                      R$ {wine.priceOld.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  <span style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#fff" }}>
                    R$ {wine.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <button className="qr-add-btn">Adicionar ao carrinho</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/vinhos" className="qr-explore-link">Ver todos os vinhos →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
