import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Transições suaves ao rolar: os blocos da página aparecem com um leve
// "fade + subida" quando entram na tela. Vale para TODAS as páginas.
// - Só anima o que está abaixo da dobra (o que já está visível não pisca).
// - Respeita "reduzir movimento" do sistema operacional.
// - Se algo falhar, o conteúdo continua visível (a classe só é aplicada via JS).
const SELECTOR = [
  "section",
  "footer",
  '[class$="-card"]',
  ".vcard",
  ".cart-item",
  ".orders-item",
].join(",");

function insideFixed(el: HTMLElement): boolean {
  for (let p: HTMLElement | null = el; p && p !== document.body; p = p.parentElement) {
    const pos = getComputedStyle(p).position;
    if (pos === "fixed" || pos === "sticky") return true;
  }
  return false;
}

export default function ScrollReveal() {
  const { pathname } = useLocation();

  // Troca de página: volta ao topo e faz um fade suave
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const root = document.getElementById("root");
    if (!root) return;
    root.classList.remove("page-fade");
    void root.offsetWidth; // reinicia a animação
    root.classList.add("page-fade");
    const t = window.setTimeout(() => root.classList.remove("page-fade"), 600);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Aparecer ao rolar
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.style.transitionDelay = `${Math.min(n++, 5) * 70}ms`;
          el.classList.add("reveal-in");
          window.setTimeout(() => {
            el.classList.remove("reveal", "reveal-in");
            el.style.transitionDelay = "";
          }, 1200);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    function scan() {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) return; // já visível: não anima
        if (insideFixed(el)) return;
        el.classList.add("reveal");
        io.observe(el);
      });
    }

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    };
    schedule();
    const mo = new MutationObserver(schedule); // conteúdo que chega depois (API)
    mo.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      document.querySelectorAll(".reveal").forEach((el) => el.classList.remove("reveal", "reveal-in"));
    };
  }, [pathname]);

  return null;
}
