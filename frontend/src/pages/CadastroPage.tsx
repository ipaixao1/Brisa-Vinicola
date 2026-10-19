import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function CadastroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    const ok = register(name, email, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError("Este e-mail já está cadastrado.");
    }
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-deco-line" />
          <h1 className="auth-title font-serif">Crie sua conta</h1>
          <p className="auth-sub">Crie seu perfil e descubra vinhos e conteúdos selecionados para você.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Nome</label>
              <input className="auth-input" type="text" placeholder="Seu nome" value={name}
                onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">E-mail</label>
              <input className="auth-input" type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Senha</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirmar senha</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit">CRIAR CONTA</button>
          </form>

          <p className="auth-switch">
            Já possui uma conta?{" "}
            <Link to="/login" state={{ from }} className="auth-link">Entrar</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
