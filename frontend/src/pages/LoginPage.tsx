import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError("E-mail ou senha incorretos. Tente novamente.");
    }
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-deco-line" />
          <h1 className="auth-title font-serif">Bem-vindo de volta</h1>
          <p className="auth-sub">Entre na sua conta para descobrir uma seleção de vinhos feita para você.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">E-mail</label>
              <input
                className="auth-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">Senha</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit">ENTRAR</button>
          </form>

          <a href="#" className="auth-forgot">Esqueceu sua senha?</a>

          <p className="auth-switch">
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" state={{ from }} className="auth-link">Cadastre-se</Link>
          </p>

          <div className="auth-demo">
            <p className="auth-demo-label">Contas de demonstração</p>
            <p className="auth-demo-item">isabel@brisa.com / 123456</p>
            <p className="auth-demo-item">carlos@brisa.com / 123456 (com quiz)</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
