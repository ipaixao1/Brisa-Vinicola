// Formato de um vinho (os dados vêm da API, veja WinesContext).
export interface Wine {
  id: number;
  name: string;
  producer: string;
  type: "Tinto" | "Branco" | "Espumante" | "Rosé";
  grape: string;
  origin: string;
  price: number;
  priceOld?: number;
  img: string;
  badge?: string;
  featured?: boolean;
  date: number; // for "Mais recentes" sort
  // ── campos usados na página do vinho ──
  description: string;
  alcohol: string;       // teor alcoólico, ex. "13,5%"
  acidity: string;       // acidez total, ex. "5,4 g/L"
  volume: string;        // volume da garrafa, ex. "750ml"
  servingTemp: string;   // temperatura de serviço
  traits: string[];      // características em destaque
  pairings: string[];    // sugestões de harmonização
}
