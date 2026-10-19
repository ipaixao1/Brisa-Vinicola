import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleModal from "@/components/ArticleModal";
import { useAuth } from "@/context/AuthContext";
import { scoreWines, getPersonalizedContent, getProfileLabel } from "@/utils/recommendations";
import { useCart } from "@/context/CartContext";
import { wines } from "@/data/wines";

const GOLD = "#AE8648";

export default function ConteudoPersonalizadoPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  if (!user) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 24 }}>
          <p style={{ fontFamily: "Poppins", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
            Faça login para acessar seu conteúdo personalizado.
          </p>
          <Link to="/login" style={{ fontFamily: "Poppins", fontSize: 12, fontWeight: 600, color: "#0e0d0c", background: GOLD, padding: "12px 32px", textDecoration: "none", letterSpacing: "0.08em" }}>
            ENTRAR
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user.quizAnswers) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="cp-no-quiz">
          <div className="auth-deco-line" style={{ margin: "0 auto 24px" }} />
          <h2 className="cp-no-quiz-title font-serif">Quer descobrir seus vinhos ideais?</h2>
          <p className="cp-no-quiz-sub">Responda ao nosso quiz e criaremos uma seleção personalizada de vinhos e conteúdos para você.</p>
          <Link to="/" className="cp-quiz-btn">FAZER O QUIZ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const scored = scoreWines(user.quizAnswers).slice(0, 3);
  const content = getPersonalizedContent(user.quizAnswers);
  const profile = getProfileLabel(user.quizAnswers);
  const allTitles = content.map(c => c.title);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero */}
      <section className="cp-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <p className="cp-greeting">Olá, {user.name}!</p>
        <h1 className="cp-title font-serif">Conteúdo Personalizado</h1>
        <p className="cp-sub">Selecionamos conteúdos e vinhos com base no seu perfil: <strong style={{ color: GOLD }}>{profile}</strong></p>
      </section>

      <div className="cp-main">

        {/* Content articles */}
        <section className="cp-section">
          <h2 className="cp-section-title">Conteúdos para você</h2>
          <div className="cp-articles">
            {content.map((item, i) => (
              <article key={i} className="cp-article">
                <span className="cp-article-tag">{item.tag}</span>
                <h3 className="cp-article-title">{item.title}</h3>
                <p className="cp-article-desc">{item.description}</p>
                <button
                  className="cp-article-link"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
                  onClick={() => setOpenArticle(item.title)}
                >
                  Ler mais →
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Recommended wines */}
        <section className="cp-section">
          <h2 className="cp-section-title">Selecionados para você</h2>
          <div className="cp-wines">
            {scored.map((wine) => (
              <div key={wine.id} className="cp-wine-card">
                <div className="cp-wine-compat">
                  <span style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 700, color: GOLD }}>{wine.compatibility}%</span>
                  <span style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 6 }}>de compatibilidade</span>
                </div>
                <div style={{ height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 1, marginBottom: 16 }}>
                  <div style={{ width: `${wine.compatibility}%`, height: "100%", background: GOLD, borderRadius: 1 }} />
                </div>
                <div className="cp-wine-body">
                  <div className="cp-wine-img-wrap">
                    <img src={wine.img} alt={wine.name} className="cp-wine-img" />
                  </div>
                  <div>
                    <p className="cp-wine-type">{wine.type} · {wine.grape}</p>
                    <h3 className="cp-wine-name">{wine.name}</h3>
                    <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.38)", margin: "4px 0 12px" }}>{wine.origin}</p>
                    <p style={{ fontFamily: "Poppins", fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
                      R$ {wine.price.toFixed(2).replace(".", ",")}
                    </p>
                    <button className="vcard-btn" style={{ width: "auto", padding: "8px 18px" }} onClick={() => addToCart(wines.find(w => w.id === wine.id)!)}>
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/quiz-resultado" className="cp-article-link" style={{ fontSize: 13 }}>Ver todos os meus vinhos recomendados →</Link>
          </div>
        </section>

      </div>

      <Footer />

      {/* Article modal */}
      {openArticle && (
        <ArticleModal
          title={openArticle}
          onClose={() => setOpenArticle(null)}
          onNavigate={(t) => setOpenArticle(t)}
          allTitles={allTitles}
        />
      )}
    </div>
  );
}
