import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "@/imports/logo_png.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const GOLD = "#AE8648";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const dropRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState("");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    navigate(q ? `/vinhos?q=${encodeURIComponent(q)}` : "/vinhos");
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const navItems = [
    { label: "Início", to: "/" },
    { label: "Vinhos", to: "/vinhos" },
    { label: "Fale Conosco", to: "/fale-conosco" },
    ...(user ? [{ label: "Conteúdo Personalizado", to: "/conteudo-personalizado" }] : []),
  ];

  function handleUserClick() {
    if (user) {
      setDropdownOpen((o) => !o);
    } else {
      navigate("/login");
    }
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate("/");
  }

  return (
    <header style={{
      background: scrolled ? "rgba(18,15,12,0.97)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(42,37,32,0.6)" : "none",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      position: "fixed",
      top: 0,
      zIndex: 100,
      width: "100%",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        height: 72,
        display: "flex",
        alignItems: "center",
        gap: 32,
      }}>
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <img src={logoImg} alt="Brisa Vinícola" style={{ height: 54, width: "auto", objectFit: "contain" }} />
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 28, flex: 1, justifyContent: "flex-start", marginLeft: 8, overflow: "hidden" }}>
          {navItems.map(({ label, to }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            const isPersonal = label === "Conteúdo Personalizado";
            return (
              <Link key={label} to={to} style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: isPersonal ? 11 : 13,
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: isPersonal
                  ? (active ? GOLD : "rgba(174,134,72,0.7)")
                  : (active ? "#fff" : "rgba(255,255,255,0.65)"),
                textDecoration: "none",
                borderBottom: active
                  ? `1.5px solid ${isPersonal ? GOLD : "rgba(255,255,255,0.5)"}`
                  : "none",
                paddingBottom: active ? 2 : 0,
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}>{label}</Link>
            );
          })}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 6,
          padding: "6px 12px",
          gap: 8,
          flex: "0 0 180px",
        }}>
          <input
            type="text"
            placeholder="Buscar vinhos..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontFamily: "Poppins",
              fontSize: 13,
              flex: 1,
              width: "100%",
            }}
          />
          <button type="submit" aria-label="Buscar" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Cart & User */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <Link to="/carrinho" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <div style={{ position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: GOLD, color: "#0e0d0c",
                  fontFamily: "Poppins", fontSize: 10, fontWeight: 700,
                  width: 17, height: 17, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{totalItems > 99 ? "99+" : totalItems}</span>
              )}
            </div>
            <span style={{ fontFamily: "Poppins", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.03em" }}>Carrinho</span>
          </Link>

          {/* User button */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <button
              onClick={handleUserClick}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                gap: 2,
                padding: 0,
              }}
              aria-label={user ? "Menu do usuário" : "Entrar"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={user ? GOLD : "rgba(255,255,255,0.75)"} strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span style={{
                fontFamily: "Poppins",
                fontSize: 10,
                color: user ? GOLD : "rgba(255,255,255,0.6)",
                letterSpacing: "0.03em",
                textAlign: "center",
                lineHeight: 1.3,
              }}>
                {user ? user.name.split(" ")[0] : "Entrar/\nCadastrar"}
              </span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && user && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                background: "#181512",
                border: `1px solid rgba(174,134,72,0.2)`,
                minWidth: 200,
                zIndex: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "Poppins", fontSize: 13, fontWeight: 600, color: "#fff", margin: 0 }}>{user.name}</p>
                  <p style={{ fontFamily: "Poppins", fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>{user.email}</p>
                </div>
                {[
                  { label: "Minha conta", to: "/minha-conta" },
                  { label: "Meus pedidos", to: "/meus-pedidos" },
                  { label: "Conteúdo personalizado", to: "/conteudo-personalizado" },
                  { label: "Minhas preferências", to: "/quiz-resultado" },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} onClick={() => setDropdownOpen(false)} style={{
                    display: "block",
                    padding: "11px 16px",
                    fontFamily: "Poppins",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    transition: "color 0.2s, background 0.2s",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.background = "rgba(174,134,72,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >{label}</Link>
                ))}
                <button onClick={handleLogout} style={{
                  display: "block",
                  width: "100%",
                  padding: "11px 16px",
                  fontFamily: "Poppins",
                  fontSize: 12,
                  color: "rgba(255,100,100,0.7)",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}>Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
