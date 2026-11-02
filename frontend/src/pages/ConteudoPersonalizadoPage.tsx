import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleModal, { ARTICLE_DB } from "@/components/ArticleModal";
import { useAuth } from "@/context/AuthContext";
import { useRecommendations, type ContentItem } from "@/hooks/useRecommendations";
import { useCart } from "@/context/CartContext";
import { useWines } from "@/context/WinesContext";
import type { Wine } from "@/data/wines";

const GOLD = "#AE8648";

// Ordem e textos de cada grupo de vídeos
const GRUPOS: { categoria: string; titulo: string; subtitulo: string }[] = [
  { categoria: "Seu perfil", titulo: "Para o seu perfil de sabor", subtitulo: "Conteúdos escolhidos pelo seu jeito de gostar de vinho." },
  { categoria: "Para o seu nível", titulo: "Para o seu nível", subtitulo: "Do básico ao avançado, no seu ritmo." },
  { categoria: "Para o seu prato", titulo: "Para o que você vai comer", subtitulo: "Harmonizações para o prato que você escolheu." },
  { categoria: "Para a sua ocasião", titulo: "Para a sua ocasião", subtitulo: "Escolhas certas para o momento que você descreveu." },
];

function idDoVideo(url: string): string {
  try {
    return new URL(url).searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

function Miniatura({ item, grande = false }: { item: ContentItem; grande?: boolean }) {
  const [falhou, setFalhou] = useState(false);
  const id = idDoVideo(item.videoUrl);
  return (
    <a
      href={item.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`cpv-thumb${grande ? " cpv-thumb-big" : ""}`}
      aria-label={`Assistir no YouTube: ${item.videoTitle}`}
    >
      {!falhou && id && (
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={() => setFalhou(true)}
        />
      )}
      <span className="cpv-play" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span className="cpv-yt-badge">YouTube</span>
    </a>
  );
}

interface CartaoProps {
  item: ContentItem;
  vinhos: Wine[];
  adicionados: Record<number, boolean>;
  onAdd: (w: Wine) => void;
  onArtigo: (titulo: string) => void;
  destaque?: boolean;
}

function CartaoDeVideo({ item, vinhos, adicionados, onAdd, onArtigo, destaque = false }: CartaoProps) {
  const temArtigo = !!item.article && !!ARTICLE_DB[item.article];
  return (
    <article className={`cpv-card${destaque ? " cpv-card-feature" : ""}`}>
      <Miniatura item={item} grande={destaque} />
      <div className="cpv-card-body">
        <div className="cpv-tags">
          <span className="cpv-chip">{item.tag}</span>
          {destaque && <span className="cpv-chip cpv-chip-gold">Comece por aqui</span>}
        </div>
        <h3 className="cpv-card-title">{item.title}</h3>
        <p className="cpv-card-desc">{item.description}</p>

        <p className="cpv-video-title">▶ {item.videoTitle}</p>

        <p className="cpv-label">Pontos-chave</p>
        <ul className="cpv-learn">
          {item.learn.map((l) => <li key={l}>{l}</li>)}
        </ul>

        <div className="cpv-actions">
          <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="cpv-btn-primary">
            Assistir no YouTube ↗
          </a>
          {temArtigo && (
            <button type="button" className="cpv-btn-ghost" onClick={() => onArtigo(item.article!)}>
              Ler artigo
            </button>
          )}
        </div>

        {vinhos.length > 0 && (
          <div className="cpv-products">
            <p className="cpv-label">Vinhos para este assunto</p>
            <div className="cpv-products-list">
              {vinhos.map((w) => (
                <div key={w.id} className="cpv-product">
                  <Link to={`/vinhos/${w.id}`} className="cpv-product-img">
                    <img src={w.img} alt={w.name} />
                  </Link>
                  <div className="cpv-product-info">
                    <Link to={`/vinhos/${w.id}`} className="cpv-product-name">{w.name}</Link>
                    <span className="cpv-product-meta">{w.type} · {w.grape}</span>
                    <span className="cpv-product-price">R$ {w.price.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <button
                    type="button"
                    className={`cpv-add${adicionados[w.id] ? " cpv-add-ok" : ""}`}
                    onClick={() => onAdd(w)}
                  >
                    {adicionados[w.id] ? "Adicionado ✓" : "Adicionar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ConteudoPersonalizadoPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wines } = useWines();
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [adicionados, setAdicionados] = useState<Record<number, boolean>>({});
  const { data, error } = useRecommendations();

  function adicionar(wine: Wine) {
    addToCart(wine);
    setAdicionados((a) => ({ ...a, [wine.id]: true }));
    window.setTimeout(() => setAdicionados((a) => ({ ...a, [wine.id]: false })), 1800);
  }

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
          <p className="cp-no-quiz-sub">Responda ao nosso quiz e criaremos uma seleção personalizada de vinhos e vídeos para você.</p>
          <Link to="/" className="cp-quiz-btn">FAZER O QUIZ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "Poppins", color: "rgba(255,255,255,0.5)" }}>
            {error ?? "Carregando seu conteúdo..."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const scored = data.wines.slice(0, 3);
  const content = data.content;
  const destaque = content[0];
  const resto = content.slice(1);

  // vinhos do catálogo (com imagem e preço) que combinam com cada vídeo
  const vinhosDe = (item: ContentItem): Wine[] =>
    item.wineIds.map((id) => wines.find((w) => w.id === id)).filter((w): w is Wine => !!w);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero */}
      <section className="cp-hero">
        <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
        <p className="cp-greeting">Olá, {user.name}!</p>
        <h1 className="cp-title font-serif">Conteúdo Personalizado</h1>
        <p className="cp-sub">Vídeos e vinhos escolhidos para o seu jeito de gostar de vinho.</p>
      </section>

      <div className="cp-main">

        {/* Perfil */}
        <section className="cpv-profile">
          <div>
            <p className="cpv-label">Seu perfil</p>
            <h2 className="cpv-profile-name font-serif">{data.profile}</h2>
            <p className="cpv-profile-desc">{data.profileDescription}</p>
            <div className="cpv-traits">
              {data.traits.map((t) => <span key={t} className="cpv-trait">{t}</span>)}
            </div>
          </div>
          <div className="cpv-level">
            <p className="cpv-label">Seu nível</p>
            <p className="cpv-level-name">{data.level}</p>
            <p className="cpv-level-tip">{data.levelTip}</p>
            <p className="cpv-level-count"><strong>{content.length}</strong> vídeos selecionados para você</p>
            <Link to="/" className="cpv-retake">Refazer o quiz</Link>
          </div>
        </section>

        {/* Destaque */}
        {destaque && (
          <section className="cp-section">
            <h2 className="cp-section-title">Para começar</h2>
            <CartaoDeVideo item={destaque} vinhos={vinhosDe(destaque)} adicionados={adicionados} onAdd={adicionar} onArtigo={setOpenArticle} destaque />
          </section>
        )}

        {/* Demais vídeos, agrupados */}
        {GRUPOS.map((g) => {
          const itens = resto.filter((c) => c.category === g.categoria);
          if (itens.length === 0) return null;
          return (
            <section key={g.categoria} className="cp-section">
              <h2 className="cp-section-title">{g.titulo}</h2>
              <p className="cpv-section-sub">{g.subtitulo}</p>
              <div className="cpv-grid">
                {itens.map((item) => (
                  <CartaoDeVideo key={item.id} item={item} vinhos={vinhosDe(item)} adicionados={adicionados} onAdd={adicionar} onArtigo={setOpenArticle} />
                ))}
              </div>
            </section>
          );
        })}

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
                    <button className="vcard-btn" style={{ width: "auto", padding: "8px 18px" }} onClick={() => { const w = wines.find((x) => x.id === wine.id); if (w) adicionar(w); }}>
                      {adicionados[wine.id] ? "Adicionado ✓" : "Adicionar ao carrinho"}
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
          allTitles={Object.keys(ARTICLE_DB)}
        />
      )}
    </div>
  );
}
