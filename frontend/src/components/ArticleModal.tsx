import { useEffect } from "react";
import { wines } from "@/data/wines";

const GOLD = "#AE8648";

export interface ArticleDetail {
  tag: string;
  title: string;
  subtitle?: string;
  heroImg?: string;
  sections: ArticleSection[];
  downloadLabel?: string;
  videoUrl?: string;
  videoCaption?: string;
  relatedTitles: string[];
}

type ArticleSection =
  | { type: "text"; heading?: string; body: string }
  | { type: "tips"; heading: string; items: string[] }
  | { type: "curiosity"; heading: string; body: string }
  | { type: "wines"; heading: string; ids: number[] }
  | { type: "image"; src: string; caption?: string }
  | { type: "pairings"; heading: string; items: { food: string; wine: string }[] };

// ── Full article database ──────────────────────────────────────────────────────
export const ARTICLE_DB: Record<string, ArticleDetail> = {
  "Como escolher um bom vinho tinto": {
    tag: "Guia",
    title: "Como escolher um bom vinho tinto",
    subtitle: "Tudo o que você precisa saber antes de levar uma garrafa para casa",
    heroImg: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
    sections: [
      { type: "text", heading: "Por onde começar?", body: "Escolher um bom vinho tinto pode parecer intimidador diante de tantas opções, mas alguns critérios simples tornam a decisão muito mais fácil. O primeiro passo é entender sua ocasião: um jantar íntimo pede algo diferente de uma celebração em família." },
      { type: "tips", heading: "5 dicas essenciais", items: [
        "Leia o rótulo: país de origem e uva já dizem muito sobre o vinho",
        "Prefira vinhos com denominação de origem controlada (DOC, AOC, DOCa)",
        "Para carnes grelhadas, escolha tintos encorpados como Syrah ou Malbec",
        "Vinhos com mais de 3 anos de guarda tendem a ser mais complexos",
        "Confie no seu paladar — não existe escolha errada se você gostou",
      ]},
      { type: "text", heading: "Corpo e taninos: o que isso significa?", body: "O corpo de um vinho refere-se à sensação de peso e volume na boca. Vinhos encorpados como Syrah e Blend Premium têm taninos mais presentes, criando aquela sensação aveludada ou levemente adstringente que vai bem com proteínas. Já tintos mais leves combinam com pratos mais delicados." },
      { type: "curiosity", heading: "Você sabia?", body: "A cor de um vinho tinto não indica necessariamente sua qualidade. Tintos muito escuros e opacos não são obrigatoriamente melhores que os de cor rubi translúcida — tudo depende da uva e do estilo de produção." },
      { type: "wines", heading: "Recomendações para você", ids: [1, 4, 8] },
    ],
    downloadLabel: "Baixar Guia Completo de Vinhos Tintos",
    relatedTitles: ["Syrah vs Marselan: entenda as diferenças", "Vinhos tintos para acompanhar carnes", "O Bordô brasileiro: identidade e terroir"],
  },

  "Syrah vs Marselan: entenda as diferenças": {
    tag: "Comparativo",
    title: "Syrah vs Marselan",
    subtitle: "Dois tintos robustos com personalidades completamente distintas",
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      { type: "text", heading: "Dois gigantes da viticultura", body: "Syrah e Marselan são duas uvas tintas de caráter forte, mas com histórias e perfis completamente diferentes. Enquanto a Syrah tem raízes históricas no vale do Ródano, na França, e brilha em climas quentes do mundo inteiro, a Marselan é uma criação recente — um cruzamento entre Cabernet Sauvignon e Grenache, desenvolvida na França na década de 1960." },
      { type: "pairings", heading: "Com o que harmonizar cada um?", items: [
        { food: "Picanha na brasa", wine: "Syrah" },
        { food: "Costela assada lentamente", wine: "Marselan" },
        { food: "Queijo gouda curado", wine: "Syrah" },
        { food: "Massa ao molho de carne", wine: "Marselan" },
      ]},
      { type: "tips", heading: "Como identificar no copo", items: [
        "Syrah: cor profunda, quase violeta; aromas de pimenta-preta, defumado e frutas escuras",
        "Marselan: cor rubi intensa; aromas florais, amora, cereja madura e um toque vegetal sutil",
        "Syrah no paladar: taninos firmes, acidez média, final longo e especiado",
        "Marselan no paladar: estrutura elegante, frescor surpreendente, final frutado",
      ]},
      { type: "wines", heading: "Experimente os dois", ids: [1, 4] },
    ],
    relatedTitles: ["Como escolher um bom vinho tinto", "O Bordô brasileiro: identidade e terroir", "Vinhos tintos para acompanhar carnes"],
  },

  "Vinhos tintos para acompanhar carnes": {
    tag: "Harmonização",
    title: "Vinhos tintos para acompanhar carnes",
    subtitle: "Do churrasco ao file: a dupla perfeita para cada corte",
    heroImg: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    sections: [
      { type: "text", heading: "A ciência da harmonização", body: "A harmonização entre vinho e carne não é mágica — é química. Os taninos do vinho tinto reagem com as proteínas da carne, suavizando a adstringência do vinho e realçando o sabor da proteína. Por isso vinhos mais tânicos combinam melhor com carnes gordurosas e bem temperadas." },
      { type: "pairings", heading: "Guia de harmonização por corte", items: [
        { food: "Picanha", wine: "Syrah Reserva Especial" },
        { food: "Costela bovina", wine: "Blend Premium" },
        { food: "Filé mignon", wine: "Marselan Reserva" },
        { food: "Cordeiro", wine: "Primitivo di Manduria" },
        { food: "Linguiça artesanal", wine: "Bordô Clássico" },
      ]},
      { type: "tips", heading: "Regras práticas", items: [
        "Carnes gordurosas pedem taninos firmes para equilibrar",
        "Carnes brancas como frango aceitam tintos mais leves",
        "Molhos cremosos pedem vinhos com boa acidez",
        "Serve o vinho ligeiramente abaixo da temperatura ambiente (16–18°C)",
        "Deixe o vinho respirar 20–30 minutos antes de servir",
      ]},
      { type: "wines", heading: "Nossa seleção para o churrasco", ids: [1, 4, 6, 8, 11] },
    ],
    downloadLabel: "Baixar Tabela de Harmonização",
    relatedTitles: ["Como escolher um bom vinho tinto", "Syrah vs Marselan: entenda as diferenças", "Como degustar um vinho corretamente"],
  },

  "O Bordô brasileiro: identidade e terroir": {
    tag: "Uva",
    title: "O Bordô brasileiro",
    subtitle: "A uva mais plantada do Brasil e sua identidade única",
    heroImg: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80",
    sections: [
      { type: "text", heading: "Uma uva genuinamente brasileira", body: "A uva Bordô — ou Isabella, como é conhecida em outras regiões — chegou ao Brasil com os imigrantes italianos no final do século XIX. Adaptou-se tão bem ao clima da Serra Gaúcha que hoje é a variedade de uva tinta mais cultivada no país, respondendo por grande parte da produção de vinhos nacionais." },
      { type: "curiosity", heading: "Curiosidade histórica", body: "O nome 'Bordô' no Brasil é uma homenagem corrupta a 'Bordeaux', a famosa região vinícola francesa. Porém, a uva Bordô brasileira não tem relação com as uvas de Bordeaux — ela pertence à espécie Vitis labrusca, enquanto as francesas pertencem à Vitis vinifera." },
      { type: "text", heading: "Terroir da Serra Gaúcha", body: "O frescor das noites na Serra Gaúcha, os solos basálticos e a alta altitude criam condições únicas para a maturação lenta da Bordô. O resultado são vinhos de cor intensa, aromas de frutas silvestres e sabor que remete à memória afetiva de muitos brasileiros — o vinho de colono, agora reinterpretado com técnica e sofisticação." },
      { type: "wines", heading: "Experimente o Bordô da Brisa", ids: [6] },
      { type: "image", src: "https://images.unsplash.com/photo-1564671174651-f7b55a44e1f4?w=800&q=80", caption: "Vinhedos na Serra Gaúcha durante a colheita" },
    ],
    videoUrl: "https://videos.pexels.com/video-files/2394220/2394220-hd_1920_1080_25fps.mp4",
    videoCaption: "O terroir único da Brisa Vinícola",
    relatedTitles: ["Como escolher um bom vinho tinto", "Syrah vs Marselan: entenda as diferenças", "Como degustar um vinho corretamente"],
  },

  "Sauvignon Blanc: frescor em cada taça": {
    tag: "Uva",
    title: "Sauvignon Blanc",
    subtitle: "A uva do frescor, da mineralidade e dos aromas marcantes",
    heroImg: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80",
    sections: [
      { type: "text", heading: "O que torna o Sauvignon Blanc único?", body: "Poucos vinhos brancos são tão imediatamente reconhecíveis quanto o Sauvignon Blanc. Seus aromas característicos de maracujá, grama cortada, toranja e até aspargo são resultado de compostos chamados tiols, presentes naturalmente na casca da uva." },
      { type: "tips", heading: "Regiões que você precisa conhecer", items: [
        "Loire (França): minerais, cítricos e floral — os clássicos Sancerre e Pouilly-Fumé",
        "Marlborough (Nova Zelândia): tropical e intenso, o estilo que conquistou o mundo",
        "Chile: frutado e acessível, excelente custo-benefício",
        "Brasil: produções emergentes na Serra Gaúcha com estilo fresco e herbáceo",
      ]},
      { type: "pairings", heading: "Harmonizações ideais", items: [
        { food: "Ceviche", wine: "Sauvignon Blanc jovem" },
        { food: "Salada caprese", wine: "Sauvignon Blanc mineral" },
        { food: "Frango ao limão", wine: "Sauvignon Blanc tropical" },
        { food: "Queijo de cabra", wine: "Sancerre (Sauvignon Blanc)" },
      ]},
      { type: "wines", heading: "Nosso Sauvignon Blanc", ids: [2, 10] },
    ],
    relatedTitles: ["Vinhos brancos para frutos do mar", "Chardonnay: do leve ao encorpado", "Como degustar um vinho corretamente"],
  },

  "Vinhos brancos para frutos do mar": {
    tag: "Harmonização",
    title: "Vinhos brancos para frutos do mar",
    subtitle: "A parceria mais elegante da gastronomia",
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      { type: "text", heading: "Por que branco com frutos do mar?", body: "A acidez dos vinhos brancos funciona como o limão espremido sobre o peixe — realça os sabores, limpa o paladar e equilibra a delicadeza dos frutos do mar. Vinhos com muita tanino ou corpo excessivo dominariam esses pratos sutis." },
      { type: "pairings", heading: "O guia definitivo", items: [
        { food: "Ostras", wine: "Branco muito seco e mineral (Chablis, Sauvignon Blanc)" },
        { food: "Camarão na manteiga", wine: "Chardonnay levemente amadeirado" },
        { food: "Salmão grelhado", wine: "Chardonnay ou Sauvignon Blanc" },
        { food: "Bacalhau", wine: "Vinho verde ou branco seco português" },
        { food: "Lagosta", wine: "Chardonnay premium ou espumante Brut" },
      ]},
      { type: "tips", heading: "Dicas de serviço", items: [
        "Sirva brancos entre 8 e 12°C — nunca gelados demais",
        "Taças menores concentram os aromas florais e cítricos",
        "Brancos jovens e frescos para frutos do mar crus",
        "Brancos com mais corpo para preparações com molho",
      ]},
      { type: "wines", heading: "Nossa seleção de brancos", ids: [2, 5, 10] },
    ],
    downloadLabel: "Baixar Guia de Harmonização com Frutos do Mar",
    relatedTitles: ["Sauvignon Blanc: frescor em cada taça", "Chardonnay: do leve ao encorpado", "Moscato: doce, floral e irresistível"],
  },

  "Chardonnay: do leve ao encorpado": {
    tag: "Guia",
    title: "Chardonnay: do leve ao encorpado",
    subtitle: "A uva mais versátil do mundo branco",
    heroImg: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80",
    sections: [
      { type: "text", heading: "A uva camaleão", body: "Poucas uvas são tão moldáveis quanto a Chardonnay. Plantada em quase todos os países produtores de vinho, ela assume personalidades completamente diferentes dependendo do clima, do solo e da decisão do winemaker: fermentação em inox ou barrica de carvalho, com ou sem malolática, jovem ou com guarda." },
      { type: "curiosity", heading: "Borgonha ou Novo Mundo?", body: "Na Borgonha francesa, o Chardonnay é magro, mineral e tenso — vinho de meditação. Na Califórnia ou Austrália, pode ser gordo, amanteigado e com aromas de baunilha vindos do carvalho novo. Prefira especificar 'estilo Borgonha' ou 'estilo Novo Mundo' ao pedir indicação." },
      { type: "tips", heading: "Como ler o rótulo", items: [
        "'Unoaked' ou 'sem carvalho': fresco, cítrico e leve",
        "'Barrique' ou 'Carvalho': encorpado, amanteigado, baunilha",
        "Temperatura de serviço ideal: 10–14°C",
        "Quanto mais fresco o clima da região, mais tenso e mineral o vinho",
      ]},
      { type: "wines", heading: "Chardonnay da Brisa", ids: [2] },
    ],
    relatedTitles: ["Sauvignon Blanc: frescor em cada taça", "Vinhos brancos para frutos do mar", "Moscato: doce, floral e irresistível"],
  },

  "Moscato: doce, floral e irresistível": {
    tag: "Descoberta",
    title: "Moscato: doce, floral e irresistível",
    subtitle: "O encanto dos vinhos aromáticos e sua versatilidade surpreendente",
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      { type: "text", heading: "A família Moscato", body: "Moscato, Moscatel, Muscat — diferentes nomes para uma das uvas mais antigas do mundo. Cultivada há mais de 3.000 anos no Mediterrâneo, a família Moscato produz vinhos com um perfil aromático inconfundível: pêssego, laranja, rosas, flor de laranjeira e mel." },
      { type: "pairings", heading: "Harmonizações inusitadas", items: [
        { food: "Brie com mel e nozes", wine: "Moscato seco" },
        { food: "Sobremesas com frutas", wine: "Moscato d'Asti" },
        { food: "Foie gras", wine: "Moscato licoroso" },
        { food: "Sushi de salmão", wine: "Moscato fresco" },
      ]},
      { type: "curiosity", heading: "Moscato além do doce", body: "Embora seja famoso nos vinhos doces, o Moscato também aparece em versões secas e até espumantes secos. O Moscato d'Asti italiano, por exemplo, tem apenas 5,5% de álcool e açúcar residual moderado — perfeito como aperitivo ou com sobremesas leves." },
      { type: "wines", heading: "Experimente nosso Moscato", ids: [5, 7] },
    ],
    relatedTitles: ["Espumante além das celebrações", "Moscatel: o espumante favorito dos brasileiros", "Vinhos brancos para frutos do mar"],
  },

  "Espumante além das celebrações": {
    tag: "Estilo de vida",
    title: "Espumante além das celebrações",
    subtitle: "Como incluir as borbulhas no seu dia a dia com elegância",
    heroImg: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1200&q=80",
    sections: [
      { type: "text", heading: "Espumante é para todos os momentos", body: "Por muito tempo, espumante foi associado exclusivamente a brinde de Ano Novo e casamentos. Essa visão está mudando rapidamente. Sommeliers e amantes de vinho ao redor do mundo já perceberam que as borbulhas são, na verdade, o estilo de vinho mais versátil à mesa." },
      { type: "tips", heading: "Ocasiões perfeitas para espumante", items: [
        "Aperitivo antes do jantar: Brut ou Extra Brut com frios e queijos",
        "Almoço leve de domingo: Rosé espumante com saladas e grelhados",
        "Pós-trabalho: uma taça de Moscatel com petiscos",
        "Sobremesa: Demi-Sec com tortas de frutas ou sorvete",
        "Por que não? Uma taça no dia a dia, porque você merece",
      ]},
      { type: "wines", heading: "Nossa linha de espumantes", ids: [3, 7] },
      { type: "curiosity", heading: "Sabotagem no rolhamento?", body: "O famoso sabre para abrir espumantes com um golpe na garrafa chama-se 'sabrage' e tem origem napoleônica. Os soldados abriam as garrafas com suas sabres a cavalo durante as celebrações de vitória. Hoje é uma arte que qualquer sommelier domina." },
    ],
    videoUrl: "https://videos.pexels.com/video-files/2098859/2098859-hd_1920_1080_25fps.mp4",
    videoCaption: "A elegância dos espumantes em qualquer momento",
    relatedTitles: ["Brut, Extra Brut, Demi-Sec: entenda os rótulos", "Harmonizações com espumantes", "Moscatel: o espumante favorito dos brasileiros"],
  },

  "Brut, Extra Brut, Demi-Sec: entenda os rótulos": {
    tag: "Guia",
    title: "Brut, Extra Brut, Demi-Sec",
    subtitle: "Decifre os rótulos e escolha o espumante certo para cada momento",
    heroImg: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1200&q=80",
    sections: [
      { type: "text", heading: "O nível de doçura em espumantes", body: "A classificação dos espumantes pelo açúcar residual é regulamentada internacionalmente e aparece obrigatoriamente no rótulo. Entender esses termos muda completamente sua experiência de compra e consumo." },
      { type: "tips", heading: "Tabela de classificação", items: [
        "Nature / Zero Dosage: menos de 3g/L de açúcar — muito seco e mineral",
        "Extra Brut: 3–6g/L — seco, fresco, ideal para aperitivo",
        "Brut: 6–12g/L — o estilo mais popular, equilibrado",
        "Extra Seco: 12–17g/L — levemente adocicado",
        "Seco: 17–32g/L — começa a ficar doce",
        "Demi-Sec: 32–50g/L — claramente doce, ideal com sobremesas",
        "Doce / Dulce: acima de 50g/L — muito doce, estilo sobremesa",
      ]},
      { type: "curiosity", heading: "Por que 'Brut' é o mais vendido?", body: "O Brut se tornou o padrão do mercado porque equilibra perfeitamente o frescor das borbulhas com uma suavidade agradável ao paladar não acostumado ao vinho. Não é muito seco, nem muito doce — é o meio-termo perfeito." },
      { type: "wines", heading: "Experimente a diferença", ids: [3, 7, 9] },
    ],
    downloadLabel: "Baixar Guia de Espumantes",
    relatedTitles: ["Espumante além das celebrações", "Harmonizações com espumantes", "Moscatel: o espumante favorito dos brasileiros"],
  },

  "Harmonizações com espumantes": {
    tag: "Harmonização",
    title: "Harmonizações com espumantes",
    subtitle: "Descubra combinações surpreendentes com as borbulhas",
    heroImg: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=1200&q=80",
    sections: [
      { type: "text", heading: "A versatilidade das borbulhas", body: "A carbonatação dos espumantes age como um 'reset' do paladar a cada gole, tornando-os ideais para acompanhar uma grande variedade de pratos. A acidez elevada e as borbulhas limpam a gordura, realçam frescor e criam contrastes deliciosos." },
      { type: "pairings", heading: "Combinações clássicas e ousadas", items: [
        { food: "Ostras e frutos do mar crus", wine: "Brut ou Nature" },
        { food: "Pizza margherita", wine: "Prosecco ou Brut" },
        { food: "Frituras em geral", wine: "Extra Brut (corta a gordura perfeitamente)" },
        { food: "Queijo brie e camembert", wine: "Rosé espumante" },
        { food: "Brigadeiro e doces brasileiros", wine: "Moscatel" },
        { food: "Sushi e sashimi", wine: "Brut ou Extra Brut" },
      ]},
      { type: "tips", heading: "Dicas de serviço", items: [
        "Temperatura ideal: 6–8°C",
        "Taça flûte para preservar as borbulhas",
        "Taça tulipa para espumantes complexos e premium",
        "Evite deixar gelar demais — perde aroma",
      ]},
      { type: "wines", heading: "Nossa seleção de espumantes", ids: [3, 7] },
    ],
    relatedTitles: ["Espumante além das celebrações", "Brut, Extra Brut, Demi-Sec: entenda os rótulos", "Rosé: o vinho que conquistou o mundo"],
  },

  "Moscatel: o espumante favorito dos brasileiros": {
    tag: "Uva",
    title: "Moscatel: o espumante favorito dos brasileiros",
    subtitle: "Por que o Brasil ama tanto esse vinho doce e aromático",
    heroImg: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80",
    sections: [
      { type: "text", heading: "O fenômeno brasileiro", body: "Nenhum outro país consome tanto espumante Moscatel quanto o Brasil. O vinho que em outros países seria visto como simples e pouco sofisticado aqui ganhou status de celebração, virando sinônimo de festa junina, Reveillon e confraternizações familiares." },
      { type: "curiosity", heading: "De onde vem esse amor?", body: "A explicação é cultural e histórica. Os imigrantes italianos que vieram para a Serra Gaúcha trouxeram a tradição de beber Moscato d'Asti nas festas. Com o tempo, esse costume se popularizou e ganhou versão espumante adaptada ao gosto brasileiro — mais doce e abundante em borbulhas." },
      { type: "tips", heading: "Como apreciar melhor o Moscatel", items: [
        "Sirva bem gelado, entre 4 e 6°C",
        "Combine com sobremesas não muito doces",
        "Ótimo com frutas frescas, especialmente morango",
        "Use taça flûte para realçar as borbulhas finas",
        "Beba jovem — não precisa de guarda",
      ]},
      { type: "wines", heading: "Nosso Espumante Moscatel", ids: [7] },
    ],
    relatedTitles: ["Espumante além das celebrações", "Brut, Extra Brut, Demi-Sec: entenda os rótulos", "Moscato: doce, floral e irresistível"],
  },

  "Rosé: o vinho que conquistou o mundo": {
    tag: "Tendência",
    title: "Rosé: o vinho que conquistou o mundo",
    subtitle: "De tendência de verão a estilo de vida durante todo o ano",
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      { type: "text", heading: "A revolução rosé", body: "Nos anos 2000, o rosé era frequentemente visto com desconfiança por apreciadores mais sérios. Em menos de duas décadas, transformou-se em um fenômeno global. O mercado de rosé cresceu mais de 40% em volume na última década, liderado pela explosão do Provence rosé francês." },
      { type: "text", heading: "Como é feito o rosé?", body: "Ao contrário do que muitos pensam, rosé não é mistura de vinho tinto com branco (exceto em champanhes rosé). O método mais comum é a maceração curta: as uvas tintas ficam em contato com as cascas por horas — não dias — e a cor resultante vai do salmão clarinho ao rosa profundo." },
      { type: "curiosity", heading: "Provence: o berço do rosé moderno", body: "A região de Provence, no sul da França, é responsável por mais de 40% da produção mundial de rosé premium. O estilo Provence — cor palha rosada, seco, fresco, mineral — tornou-se o padrão internacional de qualidade para o segmento." },
      { type: "wines", heading: "Nossos rosés", ids: [9, 12] },
    ],
    videoUrl: "https://videos.pexels.com/video-files/2098859/2098859-hd_1920_1080_25fps.mp4",
    videoCaption: "A sofisticação do rosé em cada taça",
    relatedTitles: ["Provence e além: terroirs do rosé", "Harmonizações com rosé", "Rosé seco ou suave: como escolher?"],
  },

  "Provence e além: terroirs do rosé": {
    tag: "Terroir",
    title: "Provence e além: terroirs do rosé",
    subtitle: "Uma viagem pelos melhores terroirs de vinhos rosé do mundo",
    heroImg: "https://images.unsplash.com/photo-1564671174651-f7b55a44e1f4?w=1200&q=80",
    sections: [
      { type: "text", heading: "Terroir: mais que solo, é identidade", body: "O conceito de terroir — conjunto de solo, clima, relevo e mão humana — define profundamente o caráter de um vinho rosé. Dois rosés de regiões diferentes, mesmo feitos com uvas similares, terão personalidades completamente distintas." },
      { type: "tips", heading: "Terroirs que você precisa conhecer", items: [
        "Provence (França): o estilo referência — pálido, seco, floral e mineral",
        "Tavel (Ródano): rosé mais encorpado, com taninos e estrutura",
        "Rioja (Espanha): Rosados com frutas vermelhas e frescor mediterrâneo",
        "Serra Gaúcha (Brasil): emergente, com expressão tropical e acidez vibrante",
        "Mendoza (Argentina): rosés de altitude, com boa estrutura e frescor",
      ]},
      { type: "image", src: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80", caption: "Vinhedos de Provence ao entardecer" },
      { type: "wines", heading: "Rosés da Brisa Vinícola", ids: [9, 12] },
    ],
    relatedTitles: ["Rosé: o vinho que conquistou o mundo", "Harmonizações com rosé", "Rosé seco ou suave: como escolher?"],
  },

  "Harmonizações com rosé": {
    tag: "Harmonização",
    title: "Harmonizações com rosé",
    subtitle: "Do jantar à praia, o vinho para todos os momentos",
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    sections: [
      { type: "text", heading: "O vinho mais versátil", body: "O rosé tem a acidez do branco e os aromas frutados do tinto — essa combinação única o torna incrivelmente versátil à mesa. É o vinho mais democrático: combina com quase tudo sem dominar o prato." },
      { type: "pairings", heading: "Combinações que funcionam", items: [
        { food: "Salada niçoise", wine: "Rosé de Provence seco" },
        { food: "Pizza de rúcula e presunto", wine: "Rosé Brut Extra" },
        { food: "Camarão na manteiga", wine: "Rosé seco" },
        { food: "Tábua de frios", wine: "Rosé Provence" },
        { food: "Frango grelhado com ervas", wine: "Rosé encorpado" },
        { food: "Sobremesas de frutas vermelhas", wine: "Rosé mais adocicado" },
      ]},
      { type: "wines", heading: "Nossa seleção de rosés", ids: [9, 12] },
    ],
    downloadLabel: "Baixar Guia de Harmonização com Rosé",
    relatedTitles: ["Rosé: o vinho que conquistou o mundo", "Provence e além: terroirs do rosé", "Rosé seco ou suave: como escolher?"],
  },

  "Rosé seco ou suave: como escolher?": {
    tag: "Guia",
    title: "Rosé seco ou suave: como escolher?",
    subtitle: "Aprenda a identificar o estilo certo para o seu paladar",
    heroImg: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=80",
    sections: [
      { type: "text", heading: "A diferença que faz toda a diferença", body: "Muita gente pede um 'rosé' sem saber que está num espectro enorme de estilos — do completamente seco e mineral ao semi-doce e frutado. Entender essa diferença evita decepções e abre um mundo de possibilidades." },
      { type: "tips", heading: "Como identificar no rótulo", items: [
        "Brut ou Seco: menos de 10g/L de açúcar, ideal para quem gosta de branco seco",
        "Demi-Sec: entre 10 e 30g/L, levemente adocicado",
        "Suave: acima de 30g/L, claramente doce",
        "A cor mais pálida geralmente indica estilo mais seco",
        "Origem em Provence = quase sempre muito seco",
        "Moscato Rosé = quase sempre adocicado",
      ]},
      { type: "curiosity", heading: "O rótulo pode enganar?", body: "Sim! As nomenclaturas variam por país. 'Seco' na Itália pode ter mais açúcar que 'Brut' na França. A dica é: procure o teor de açúcar residual em g/L, quando disponível — essa é a informação mais objetiva." },
      { type: "wines", heading: "Para todos os gostos", ids: [9, 12] },
    ],
    relatedTitles: ["Rosé: o vinho que conquistou o mundo", "Harmonizações com rosé", "Provence e além: terroirs do rosé"],
  },
};

// ── Render helpers ─────────────────────────────────────────────────────────────
function SectionBlock({ section }: { section: ArticleSection }) {
  const wineList = wines;

  if (section.type === "text") return (
    <div style={{ marginBottom: 32 }}>
      {section.heading && <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, color: "#fff", margin: "0 0 12px" }}>{section.heading}</h3>}
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.72)", margin: 0 }}>{section.body}</p>
    </div>
  );

  if (section.type === "tips") return (
    <div style={{ marginBottom: 32, background: "rgba(174,134,72,0.06)", border: "1px solid rgba(174,134,72,0.18)", padding: "24px 28px" }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 500, color: GOLD, margin: "0 0 16px" }}>{section.heading}</h3>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {section.items.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ color: GOLD, flexShrink: 0, marginTop: 2 }}>→</span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (section.type === "curiosity") return (
    <div style={{ marginBottom: 32, borderLeft: `3px solid ${GOLD}`, paddingLeft: 24 }}>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, margin: "0 0 8px" }}>{section.heading}</p>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", margin: 0, fontStyle: "italic" }}>{section.body}</p>
    </div>
  );

  if (section.type === "image") return (
    <div style={{ marginBottom: 32 }}>
      <img src={section.src} alt={section.caption ?? ""} style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
      {section.caption && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "8px 0 0", textAlign: "center" }}>{section.caption}</p>}
    </div>
  );

  if (section.type === "pairings") return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 500, color: "#fff", margin: "0 0 16px" }}>{section.heading}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {section.items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 18px" }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{item.food}</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: GOLD, margin: 0 }}>🍷 {item.wine}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === "wines") {
    const featured = section.ids.map(id => wineList.find(w => w.id === id)).filter(Boolean) as typeof wineList;
    return (
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 500, color: "#fff", margin: "0 0 16px" }}>{section.heading}</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {featured.map(wine => (
            <div key={wine.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", gap: 14, alignItems: "center", flex: "1 1 220px" }}>
              <img src={wine.img} alt={wine.name} style={{ width: 48, height: 120, objectFit: "contain", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: GOLD, margin: "0 0 4px" }}>{wine.type}</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{wine.name}</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>R$ {wine.price.toFixed(2).replace(".", ",")}</p>
                <button style={{ background: GOLD, color: "#0e0d0c", border: "none", padding: "6px 14px", fontFamily: "Poppins", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                  COMPRAR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ── Main Modal component ───────────────────────────────────────────────────────
interface Props {
  title: string;
  onClose: () => void;
  onNavigate: (title: string) => void;
  allTitles: string[];
}

export default function ArticleModal({ title, onClose, onNavigate, allTitles }: Props) {
  const article = ARTICLE_DB[title];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // scroll to top on article change
  useEffect(() => {
    const el = document.getElementById("article-modal-scroll");
    if (el) el.scrollTop = 0;
  }, [title]);

  if (!article) {
    return (
      <div style={backdropStyle} onClick={onClose}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={closeStyle}>✕</button>
          <p style={{ color: "#fff", fontFamily: "Poppins", padding: 40 }}>Conteúdo em breve.</p>
        </div>
      </div>
    );
  }

  const related = article.relatedTitles.filter(t => allTitles.includes(t)).slice(0, 4);

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div id="article-modal-scroll" style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button onClick={onClose} style={closeStyle} aria-label="Fechar">✕</button>

        {/* Hero image */}
        {article.heroImg && (
          <div style={{ position: "relative", width: "100%", height: 260, overflow: "hidden", flexShrink: 0 }}>
            <img src={article.heroImg} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
            <div style={{ position: "absolute", bottom: 28, left: 40, right: 80 }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: 8 }}>{article.tag}</span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, color: "#fff", margin: "0 0 6px", lineHeight: 1.1 }}>{article.title}</h1>
              {article.subtitle && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>{article.subtitle}</p>}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "40px 40px 60px", overflowY: "auto", flex: 1 }}>

          {/* Sections */}
          {article.sections.map((section, i) => <SectionBlock key={i} section={section} />)}

          {/* Video */}
          {article.videoUrl && (
            <div style={{ marginBottom: 40 }}>
              <video src={article.videoUrl} controls style={{ width: "100%", maxHeight: 360, background: "#000" }} poster="" />
              {article.videoCaption && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.38)", margin: "8px 0 0", textAlign: "center" }}>{article.videoCaption}</p>}
            </div>
          )}

          {/* Download */}
          {article.downloadLabel && (
            <div style={{ marginBottom: 40, padding: "20px 24px", border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "#fff" }}>{article.downloadLabel}</span>
              <button style={{ background: GOLD, color: "#0e0d0c", border: "none", padding: "10px 24px", fontFamily: "Poppins", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer", whiteSpace: "nowrap" }}>
                ↓ BAIXAR
              </button>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 20 }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, color: "#fff", margin: "0 0 20px" }}>Você também pode gostar</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {related.map(t => {
                  const art = ARTICLE_DB[t];
                  return (
                    <button key={t} onClick={() => onNavigate(t)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "18px 20px", textAlign: "left", cursor: "pointer", transition: "border-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(174,134,72,0.4)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    >
                      {art && <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: 8 }}>{art.tag}</span>}
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 500, color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}>{t}</p>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: GOLD }}>Ler mais →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px 16px",
};

const modalStyle: React.CSSProperties = {
  background: "#141210",
  border: "1px solid rgba(174,134,72,0.2)",
  width: "100%",
  maxWidth: 860,
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflowY: "auto",
};

const closeStyle: React.CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  background: "rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  width: 36,
  height: 36,
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: 14,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
