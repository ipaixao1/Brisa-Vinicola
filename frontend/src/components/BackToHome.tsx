import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Seta fixa no topo-esquerdo das telas internas que leva de volta à Home.
// Não aparece na própria Home. Fica logo abaixo do cabeçalho e rola junto com a página.
export default function BackToHome() {
  const { pathname } = useLocation();
  const visivel = pathname !== "/";
  // no celular, abre um espacinho no topo para a seta não ficar em cima do título
  useEffect(() => {
    document.body.classList.toggle("has-back", visivel);
    return () => document.body.classList.remove("has-back");
  }, [visivel]);
  if (!visivel) return null;
  return (
    <Link to="/" className="back-home" aria-label="Voltar para a Home" title="Voltar para a Home">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      <span className="back-home-label">Home</span>
    </Link>
  );
}
