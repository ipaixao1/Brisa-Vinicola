import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Quiz from "@/components/Quiz";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { scoreWines, getPersonalizedContent } from "@/utils/recommendations";
import { wines } from "@/data/wines";
import heroImg from "@/imports/ChatGPT_Image_12_de_set._de_2026__15_41_42.png";
import videoTerroir from "@/imports/WhatsApp_Video_2026-09-12_at_16.34.47.mp4";
import videoPaixao from "@/imports/WhatsApp_Video_2026-09-12_at_16.34.53.mp4";
import videoArtesanal from "@/imports/WhatsApp_Video_2026-09-12_at_16.34.43.mp4";

const GOLD = "#AE8648";

const heroSlides = [
  {
    bg: heroImg,
    title: "Nossos Vinhos",
    text: "Cada garrafa carrega a essência do nosso terroir único — vinhos que expressam personalidade, qualidade e a paixão artesanal de quem ama o que faz em cada colheita.",
  },
  {
    bg: "https://images.unsplash.com/photo-1776066361933-84b7096a68ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    title: "Nossos Vinhos",
    text: "Do terroir único ao cuidado artesanal, selecionamos os melhores rótulos para que cada taça seja uma experiência memorável.",
  },
  {
    bg: "https://images.unsplash.com/photo-1697115355150-46dd3a5df633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    title: "Nossos Vinhos",
    text: "Tradição e inovação em harmonia — descubra nossa seleção cuidadosamente curada de vinhos premium de todo o mundo.",
  },
  {
    bg: "https://images.unsplash.com/photo-1781622196320-24a458a02660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=80",
    title: "Nossos Vinhos",
    text: "Uma experiência sensorial completa. Encontre o vinho perfeito para cada momento, para cada paladar, para cada história.",
  },
];

const categories = [
  { name: "Tinto", slug: "Tinto", img: "https://images.unsplash.com/photo-1759971408697-a0ae9a906e4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80" },
  { name: "Branco", slug: "Branco", img: "https://images.unsplash.com/photo-1780963135006-22a5bc0ec637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80" },
  { name: "Espumante", slug: "Espumante", img: "https://images.unsplash.com/photo-1761095596653-8dc3802a1323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80" },
];


export default function App() {
  const [slide, setSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState(1);
  const [quizOpen, setQuizOpen] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const personalizedWines = user?.quizAnswers ? scoreWines(user.quizAnswers).slice(0, 3) : [];
  const personalizedContent = user?.quizAnswers ? getPersonalizedContent(user.quizAnswers).slice(0, 2) : [];

  const prevSlide = () => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setSlide((s) => (s + 1) % heroSlides.length);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      <Header />

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: 560, maxHeight: 840, overflow: "hidden" }}>
        {heroSlides.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === slide ? 1 : 0,
              transition: "opacity 0.8s ease",
              backgroundImage: `url(${s.bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.48)" }} />
          </div>
        ))}

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center", maxWidth: 1200, margin: "0 auto", padding: "0 60px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, maxWidth: 440 }}>
            {/* Vertical gold line */}
            <div style={{ width: 3, minHeight: 120, background: GOLD, borderRadius: 2, marginTop: 4, flexShrink: 0 }} />
            <div>
              <h1 className="font-script" style={{ fontSize: 56, color: "#fff", margin: "0 0 14px 0", lineHeight: 1.1, fontWeight: 400 }}>
                {heroSlides[slide].title}
              </h1>
              <p style={{ fontFamily: "Poppins", fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, margin: 0 }}>
                {heroSlides[slide].text}
              </p>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={prevSlide} style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 32, zIndex: 3, padding: "8px 12px",
          opacity: 0.7,
        }}>‹</button>
        <button onClick={nextSlide} style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 32, zIndex: 3, padding: "8px 12px",
          opacity: 0.7,
        }}>›</button>

        {/* Dots */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`dot ${i === slide ? "active" : ""}`}
              style={{ border: "none", cursor: "pointer", padding: 0 }}
            />
          ))}
        </div>

      </section>

      {/* ── PRODUTOS ── */}
      <section style={{
        position: "relative",
        padding: "56px 24px 64px",
        background: "var(--bg)",
        overflow: "visible",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="font-serif" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(56px, 10vw, 110px)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#8B6530",
            margin: "0 0 4px 0",
            lineHeight: 1,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            borderStyle: "none",
            borderColor: "transparent",
          }}>Produtos</h2>
          <p className="font-serif" style={{
            fontSize: "clamp(15px, 1.8vw, 20px)",
            color: "rgba(255,255,255,0.88)",
            margin: "0 0 52px 0",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.01em",
          }}>
            Qual tipo de vinho você está procurando?
          </p>

          {/* Category grid — overflow visible so bottles can pop out */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 0,
            overflow: "visible",
            position: "relative",
            zIndex: 1,
          }}>
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className={`category-card${i === activeCategory ? " active" : ""}`}
                onClick={() => {
                  setActiveCategory(i);
                  navigate(`/vinhos?tipo=${encodeURIComponent(cat.slug)}`);
                }}
                style={{ width: 260, cursor: "pointer" }}
              >
                {/* Bottle area — overflow:visible so image can break out on hover */}
                <div className="bottle-wrap">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="bottle-img"
                  />
                </div>
                <span className="cat-label">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILARES — 3 tall cards ── */}
      <section className="pilares-section">
        {/* Centered heading */}
        <div className="pilares-heading">
          <span className="pilares-label font-serif">Brisa Vinícola.</span>
          <h2 className="pilares-title font-serif">
            Onde Cada Vinho<br />Conta uma História.
          </h2>
          <p className="pilares-sub">
            Mais do que vinhos, engarrafamos paixão, tradição e o cuidado<br className="pilares-br" />
            artesanal de quem ama o que faz em cada colheita.
          </p>
        </div>

        {/* 3 portrait cards — video backgrounds */}
        <div className="pilares-cards">
          {[
            {
              video: videoTerroir,
              poster: "",
              caption: "O clima ameno e o solo fértil proporcionam maturação lenta e complexidade única às uvas.",
              title: "Terroir Único",
            },
            {
              video: videoArtesanal,
              poster: "",
              caption: "Cada barrica é selecionada manualmente. Respeitamos o tempo da natureza para garantir a máxima expressão do vinho.",
              title: "O Cuidado Artesanal",
            },
            {
              video: videoPaixao,
              poster: "",
              caption: "Receitas e paixão pelo vinho passam de geração em geração, agora em cada taça.",
              title: "A Paixão em Cada Taça",
            },
          ].map((card) => (
            <div key={card.title} className="pilar-card">
              <video
                src={card.video}
                poster={card.poster}
                className="pilar-card-img"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="pilar-card-overlay">
                <p className="pilar-card-caption">{card.caption}</p>
                <h3 className="pilar-card-title font-serif">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA ── */}
      <section className="historia-section">
        <div className="historia-inner">
          {/* Left — editorial image */}
          <div className="historia-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1534655882117-f9eff36a1574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
              alt="Adega Brisa Vinícola"
              className="historia-img"
            />
            <div className="historia-img-border" />
          </div>

          {/* Right — text */}
          <div className="historia-text">
            <div className="historia-deco" />
            <h2 className="historia-title">Nossa História</h2>
            <h3 className="historia-subtitle font-serif">
              Uma história engarrafada em cada vinho
            </h3>
            <p className="historia-body">
              Na Brisa Vinícola, acreditamos que cada garrafa carrega muito mais do que vinho. Ela guarda histórias, encontros, descobertas e momentos que merecem ser lembrados.
            </p>
            <p className="historia-body">
              Nossa paixão nasceu da união entre tradição e inovação, buscando transformar cada experiência em torno do vinho em algo especial.
            </p>
            <p className="historia-body">
              Do cuidado com cada detalhe à escolha de nossos rótulos, buscamos oferecer vinhos que expressem personalidade, qualidade e autenticidade.
            </p>
            <a href="#" className="historia-btn">Conheça nossa história</a>
          </div>
        </div>
      </section>

      {/* ── RECOMENDAÇÃO DO MELHOR VINHO ── */}
      <section className="rec-section">
        {/* Left — bottle visual */}
        <div className="rec-left">
          <div className="rec-watermark font-script">Brisa</div>
          <img
            src="https://images.unsplash.com/photo-1775144313163-9361d25189c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80"
            alt="Primitivo di Manduria"
            className="rec-bottle"
          />
        </div>

        {/* Right — info */}
        <div className="rec-right">
          <p className="rec-eyebrow">Descubra o vinho ideal para você</p>
          <h2 className="rec-wine-name">Primitivo<br />di Manduria</h2>

          <div className="rec-specs">
            <div className="rec-spec">
              <span className="rec-spec-val">14%</span>
              <span className="rec-spec-key">Teor Alcoólico</span>
            </div>
            <div className="rec-spec-divider" />
            <div className="rec-spec">
              <span className="rec-spec-val">5,8 g/L</span>
              <span className="rec-spec-key">Acidez Total</span>
            </div>
          </div>

          <p className="rec-desc">
            Um vinho de corpo pleno e personalidade marcante, com notas de ameixa madura, chocolate amargo e especiarias finas. Cor rubi profunda, límpido e brilhante.
          </p>
          <p className="rec-desc">
            Em boca apresenta taninos maduros, acidez equilibrada e retrogosto longo e persistente. Ideal para harmonizar com carnes grelhadas, massas robustas e queijos curados.
          </p>

          <div className="rec-traits">
            {["Encorpado", "Frutado intenso", "Taninos firmes", "Longa persistência"].map((t) => (
              <span key={t} className="rec-trait">{t}</span>
            ))}
          </div>

          <p className="rec-price">R$ 119,90</p>
          <button className="rec-btn" onClick={() => navigate("/vinhos/1")}>Comprar Agora</button>
        </div>

        {/* Decorative grapes top-right */}
        <img
          src="https://images.unsplash.com/photo-1602170284347-f9c28856f149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=260&q=80"
          alt=""
          className="rec-grapes-deco"
          aria-hidden="true"
        />
      </section>

      {/* ── DESCUBRA SEU VINHO IDEAL ── */}
      <section className="quiz-section">
        <div className="quiz-section-inner">
          <div className="quiz-deco-line" />
          <h2 className="quiz-section-title font-serif">Descubra seu vinho ideal</h2>
          <p className="quiz-section-sub">
            Responda algumas perguntas e encontre o vinho que combina com você.
          </p>
          <button className="quiz-section-btn" onClick={() => setQuizOpen(true)}>
            Encontrar meu vinho
          </button>
          <p className="quiz-section-meta">
            5 perguntas&nbsp;•&nbsp;2 minutos&nbsp;•&nbsp;Resultado personalizado
          </p>
        </div>
      </section>

      {quizOpen && <Quiz onClose={() => setQuizOpen(false)} />}

      {/* ── PERSONALIZED HOME SECTION ── */}
      {user && (
        <section className="home-personal-section">
          <div className="home-personal-inner">
            <div className="home-personal-header">
              <h2 className="home-personal-greeting font-serif">Olá, {user.name}!</h2>
              <p className="home-personal-sub">Selecionamos algumas coisas que podem interessar a você.</p>
            </div>

            {!user.quizAnswers ? (
              /* No quiz yet */
              <div className="home-no-quiz">
                <div className="auth-deco-line" style={{ margin: "0 auto 20px" }} />
                <h3 className="home-no-quiz-title font-serif">Quer descobrir seus vinhos ideais?</h3>
                <p className="home-no-quiz-sub">Responda ao nosso quiz e criaremos uma seleção personalizada de vinhos e conteúdos para você.</p>
                <button className="home-quiz-cta" onClick={() => setQuizOpen(true)}>FAZER O QUIZ</button>
              </div>
            ) : (
              <>
                {/* Selecionados para você */}
                <div className="home-personal-block">
                  <h3 className="home-personal-block-title">Selecionados para você</h3>
                  <div className="home-personal-wines">
                    {personalizedWines.map((w) => (
                      <div key={w.id} className="home-pw-card">
                        <Link to={`/vinhos/${w.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <div className="home-pw-compat">{w.compatibility}% compatível</div>
                          <div className="home-pw-img-wrap">
                            <img src={w.img} alt={w.name} className="home-pw-img" />
                          </div>
                          <p className="home-pw-type">{w.type} · {w.grape}</p>
                          <p className="home-pw-name">{w.name}</p>
                          <p className="home-pw-price">R$ {w.price.toFixed(2).replace(".", ",")}</p>
                        </Link>
                        <button
                          className="vcard-btn"
                          style={{ padding: "7px 0" }}
                          onClick={() => {
                            const full = wines.find((x) => x.id === w.id);
                            if (full) addToCart(full);
                          }}
                        >
                          Adicionar ao carrinho
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/quiz-resultado" className="cp-article-link" style={{ fontSize: 13, display: "inline-block", marginTop: 20 }}>
                    Ver todos os meus vinhos →
                  </Link>
                </div>

                {/* Conteúdos para você */}
                <div className="home-personal-block">
                  <h3 className="home-personal-block-title">Conteúdos para você</h3>
                  <div className="home-personal-articles">
                    {personalizedContent.map((c, i) => (
                      <div key={i} className="home-pa-card">
                        <span className="cp-article-tag">{c.tag}</span>
                        <h4 className="home-pa-title">{c.title}</h4>
                        <p className="home-pa-desc">{c.description}</p>
                        <a href="#" className="cp-article-link">Ler mais →</a>
                      </div>
                    ))}
                  </div>
                  <Link to="/conteudo-personalizado" className="cp-article-link" style={{ fontSize: 13, display: "inline-block", marginTop: 20 }}>
                    Ver todo o conteúdo personalizado →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <Footer />

    </div>
  );
}
