import { wines, type Wine } from "@/data/wines";
import type { QuizAnswers } from "@/context/AuthContext";

// Quiz answer indices:
// Q1 ocasiao:    0=Jantar especial 1=Celebração 2=Presente 3=Momento pessoal
// Q2 sabor:      0=Frutado 1=Seco 2=Equilibrado 3=Encorpado
// Q3 comida:     0=Carnes 1=Massas 2=Peixes 3=Queijos e aperitivos
// Q4 experiencia:0=Começando 1=Já aprecio 2=Tenho experiência 3=Apaixonado
// Q5 preco:      0=Até R$80 1=R$80-130 2=Acima R$130 3=Ainda não sei

export interface ScoredWine extends Wine {
  score: number;
  compatibility: number; // 0-100
  label: string;
}

export function scoreWines(answers: QuizAnswers): ScoredWine[] {
  return wines
    .map((wine) => {
      let score = 0;

      // ── sabor × type ──
      const saborTypeMap: Record<number, Wine["type"][]> = {
        0: ["Branco", "Espumante", "Rosé"],      // Frutado
        1: ["Tinto", "Branco"],                   // Seco
        2: ["Rosé", "Branco", "Espumante"],       // Equilibrado
        3: ["Tinto"],                             // Encorpado
      };
      if (saborTypeMap[answers.sabor]?.includes(wine.type)) score += 30;

      // ── comida × type + grape ──
      const comidaMap: Record<number, { types: Wine["type"][]; grapes: string[] }> = {
        0: { types: ["Tinto"], grapes: ["Syrah", "Marselan", "Bordô", "Blend"] },
        1: { types: ["Tinto", "Branco"], grapes: ["Blend", "Sauvignon Blanc"] },
        2: { types: ["Branco"], grapes: ["Sauvignon Blanc", "Moscato"] },
        3: { types: ["Espumante", "Rosé"], grapes: ["Blend", "Marselan", "Moscato"] },
      };
      const comida = comidaMap[answers.comida];
      if (comida.types.includes(wine.type)) score += 25;
      if (comida.grapes.includes(wine.grape)) score += 15;

      // ── preço ──
      const priceRanges: Record<number, [number, number]> = {
        0: [0, 80],
        1: [80, 130],
        2: [130, Infinity],
        3: [0, Infinity],
      };
      const [min, max] = priceRanges[answers.preco];
      if (wine.price >= min && wine.price <= max) score += 20;

      // ── ocasiao ──
      const ocasiaoMap: Record<number, Wine["type"][]> = {
        0: ["Tinto", "Branco"],           // Jantar especial
        1: ["Espumante", "Rosé"],         // Celebração
        2: ["Tinto", "Espumante"],        // Presente
        3: ["Branco", "Rosé"],            // Momento pessoal
      };
      if (ocasiaoMap[answers.ocasiao]?.includes(wine.type)) score += 10;

      const compatibility = Math.min(100, Math.round((score / 100) * 100));
      const label =
        compatibility >= 85 ? "Combina perfeitamente" :
        compatibility >= 65 ? "Combina muito com você" :
        compatibility >= 45 ? "Boa compatibilidade" :
        "Pode te surpreender";

      return { ...wine, score, compatibility, label };
    })
    .sort((a, b) => b.score - a.score);
}

export function getProfileLabel(answers: QuizAnswers): string {
  const profiles: Record<number, string> = {
    0: "Apreciador de Vinhos Frutados",
    1: "Amante de Vinhos Secos",
    2: "Buscador do Equilíbrio",
    3: "Entusiasta de Vinhos Encorpados",
  };
  return profiles[answers.sabor] ?? "Explorador de Vinhos";
}

export interface ContentItem {
  title: string;
  description: string;
  tag: string;
}

export function getPersonalizedContent(answers: QuizAnswers): ContentItem[] {
  const allContent: Record<Wine["type"], ContentItem[]> = {
    Tinto: [
      { title: "Como escolher um bom vinho tinto", description: "Descubra as principais características que definem a qualidade de um vinho tinto e como identificá-las na taça.", tag: "Guia" },
      { title: "Syrah vs Marselan: entenda as diferenças", description: "Dois tintos robustos com personalidades distintas. Saiba qual combina mais com o seu paladar.", tag: "Comparativo" },
      { title: "Vinhos tintos para acompanhar carnes", description: "Harmonizações clássicas e surpreendentes entre tintos encorpados e diferentes tipos de carne.", tag: "Harmonização" },
      { title: "O Bordô brasileiro: identidade e terroir", description: "Conheça a uva mais plantada do Brasil e sua expressão única em vinhos acessíveis e autênticos.", tag: "Uva" },
    ],
    Branco: [
      { title: "Sauvignon Blanc: frescor em cada taça", description: "Da Nova Zelândia à França, explore as nuances desta uva que encanta pelo frescor e pelos aromas cítricos.", tag: "Uva" },
      { title: "Vinhos brancos para frutos do mar", description: "As melhores harmonizações entre brancos frescos e minerais com peixes, ostras e camarões.", tag: "Harmonização" },
      { title: "Chardonnay: do leve ao encorpado", description: "Entenda como o terroir e o uso de barrica transformam completamente o perfil desta uva versátil.", tag: "Guia" },
      { title: "Moscato: doce, floral e irresistível", description: "O encanto dos vinhos de Moscato e como aproveitá-los em diferentes momentos.", tag: "Descoberta" },
    ],
    Espumante: [
      { title: "Espumante além das celebrações", description: "Espumantes são versáteis o ano todo. Veja como incluí-los no seu dia a dia com elegância.", tag: "Estilo de vida" },
      { title: "Brut, Extra Brut, Demi-Sec: entenda os rótulos", description: "O nível de doçura dos espumantes e como escolher o certo para cada momento.", tag: "Guia" },
      { title: "Harmonizações com espumantes", description: "Queijos, frutos do mar, sobremesas e até carnes — veja o que vai surpreendentemente bem com as borbulhas.", tag: "Harmonização" },
      { title: "Moscatel: o espumante favorito dos brasileiros", description: "Doce, aromático e accessível, o Moscatel conquista paladares em todo o Brasil.", tag: "Uva" },
    ],
    Rosé: [
      { title: "Rosé: o vinho que conquistou o mundo", description: "Como os vinhos rosé saíram da margem para se tornar tendência entre os melhores sommeliers.", tag: "Tendência" },
      { title: "Provence e além: terroirs do rosé", description: "Das regiões clássicas francesas aos rótulos brasileiros, explore o melhor do mundo rosé.", tag: "Terroir" },
      { title: "Harmonizações com rosé", description: "Do jantar à praia, descubra pratos e ocasiões que combinam perfeitamente com rosés.", tag: "Harmonização" },
      { title: "Rosé seco ou suave: como escolher?", description: "Entenda as diferenças de perfil e aprenda a identificar no rótulo qual rosé vai te agradar mais.", tag: "Guia" },
    ],
  };

  const saborTypeMap: Record<number, Wine["type"]> = {
    0: "Espumante",
    1: "Tinto",
    2: "Rosé",
    3: "Tinto",
  };

  const comidaTypeMap: Record<number, Wine["type"]> = {
    0: "Tinto",
    1: "Tinto",
    2: "Branco",
    3: "Espumante",
  };

  const primaryType = saborTypeMap[answers.sabor];
  const secondaryType = comidaTypeMap[answers.comida];

  const primary = allContent[primaryType] ?? [];
  const secondary = (allContent[secondaryType] ?? []).filter((c) => !primary.includes(c));

  return [...primary.slice(0, 3), ...secondary.slice(0, 2)];
}
