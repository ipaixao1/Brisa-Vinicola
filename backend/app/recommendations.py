"""Quiz, recomendação de vinhos e conteúdo personalizado.

Respostas do quiz (índices de 0 a 3):
  ocasiao:     0=Jantar especial 1=Celebração 2=Presente 3=Momento pessoal
  sabor:       0=Frutado 1=Seco 2=Equilibrado 3=Encorpado
  comida:      0=Carnes 1=Massas 2=Peixes 3=Queijos e aperitivos
  experiencia: 0=Começando 1=Já aprecio 2=Tenho experiência 3=Apaixonado
  preco:       0=Até R$80 1=R$80-130 2=Acima de R$130 3=Ainda não sei

As funções aqui não dependem do banco: recebem os vinhos já carregados.
"""
from math import inf

# ── pesos do cálculo de compatibilidade (somam 100) ──
SABOR_TIPOS = {
    0: ["Branco", "Espumante", "Rosé"],
    1: ["Tinto", "Branco"],
    2: ["Rosé", "Branco", "Espumante"],
    3: ["Tinto"],
}
COMIDA = {
    0: (["Tinto"], ["Syrah", "Marselan", "Bordô", "Blend"]),
    1: (["Tinto", "Branco"], ["Blend", "Sauvignon Blanc"]),
    2: (["Branco"], ["Sauvignon Blanc", "Moscato"]),
    3: (["Espumante", "Rosé"], ["Blend", "Marselan", "Moscato"]),
}
FAIXAS_PRECO = {0: (0, 80), 1: (80, 130), 2: (130, inf), 3: (0, inf)}
OCASIAO_TIPOS = {
    0: ["Tinto", "Branco"],
    1: ["Espumante", "Rosé"],
    2: ["Tinto", "Espumante"],
    3: ["Branco", "Rosé"],
}

PERFIS = {
    0: "Apreciador de Vinhos Frutados",
    1: "Amante de Vinhos Secos",
    2: "Buscador do Equilíbrio",
    3: "Entusiasta de Vinhos Encorpados",
}


def compatibilidade_do_vinho(answers: dict, wine) -> int:
    """Pontuação de 0 a 100 de um vinho para as respostas dadas."""
    score = 0
    tipo = wine.type
    preco = float(wine.price)

    if tipo in SABOR_TIPOS.get(answers["sabor"], []):
        score += 30

    tipos_comida, uvas_comida = COMIDA[answers["comida"]]
    if tipo in tipos_comida:
        score += 25
    if wine.grape in uvas_comida:
        score += 15

    minimo, maximo = FAIXAS_PRECO[answers["preco"]]
    if minimo <= preco <= maximo:
        score += 20

    if tipo in OCASIAO_TIPOS.get(answers["ocasiao"], []):
        score += 10

    return min(100, score)


def rotulo_compatibilidade(compat: int) -> str:
    if compat >= 85:
        return "Combina perfeitamente"
    if compat >= 65:
        return "Combina muito com você"
    if compat >= 45:
        return "Boa compatibilidade"
    return "Pode te surpreender"


def rank_wines(answers: dict, wines: list) -> list[tuple]:
    """Devolve [(vinho, compatibilidade, rótulo)] do mais ao menos compatível."""
    ranked = []
    for wine in wines:
        compat = compatibilidade_do_vinho(answers, wine)
        ranked.append((wine, compat, rotulo_compatibilidade(compat)))
    # sorted é estável: em empate, mantém a ordem original (por id)
    return sorted(ranked, key=lambda item: -item[1])


def profile_label(answers: dict) -> str:
    return PERFIS.get(answers["sabor"], "Explorador de Vinhos")


# ── conteúdo personalizado ──────────────────────────────────────────────
# Cada conteúdo leva a um vídeo do YouTube. O vídeo é o conteúdo principal;
# "learn" são pontos-chave do tema e "tipos"/"uvas" escolhem os vinhos da loja
# que combinam com o assunto (eles aparecem com botão de carrinho no site).

def _yt(video_id: str) -> str:
    return f"https://www.youtube.com/watch?v={video_id}"


def _item(id, category, title, description, tag, video_id, video_title, learn,
          tipos=None, uvas=None, article=None):
    return {
        "id": id,
        "category": category,
        "title": title,
        "description": description,
        "tag": tag,
        "videoUrl": _yt(video_id),
        "videoTitle": video_title,
        "learn": learn,
        "tipos": tipos or [],
        "uvas": uvas or [],
        "article": article,
    }


# 1) Por perfil de sabor (quiz: "sabor") — 4 conteúdos para cada perfil
CONTEUDO_PERFIL = {
    0: [  # Frutado
        _item("moscato-versatil", "Seu perfil", "Moscato: doce, floral e versátil",
              "A uva aromática que conquista quem gosta de vinhos frutados, leves e fáceis de beber.",
              "Uva", "N7RKBXSsetA", "Moscatel ou Moscato, o vinho mais versátil",
              ["Aromas de flor de laranjeira, pêssego e uva fresca", "Baixo teor alcoólico e final leve", "Combina com sobremesas, frutas e queijos suaves"],
              tipos=["Branco", "Espumante"], uvas=["Moscato"], article="Moscato: doce, floral e irresistível"),
        _item("vinho-doce-guia", "Seu perfil", "Vinho doce: como escolher e quando servir",
              "Um guia para entender os estilos de vinho doce, como servi-los e em que momentos eles brilham.",
              "Guia", "DHvUuKd_FfA", "Qual é o melhor vinho doce? Vinho doce como Escolher, como Beber e quando Usar",
              ["Doce não é sinônimo de simples: acidez equilibra a doçura", "Sirva bem gelado, entre 6 °C e 8 °C", "Ótimo para o fim da refeição"],
              tipos=["Branco", "Espumante", "Rosé"], uvas=["Moscato"]),
        _item("espumante-moscatel", "Seu perfil", "Espumante Moscatel: o queridinho dos brasileiros",
              "Borbulhas suaves, aroma de uva e doçura na medida: por que o Moscatel é tão amado no Brasil.",
              "Espumante", "b2-lfImKuJs", "Espumante Moscatel! Vem provar o vinho favorito dos brasileiros",
              ["Perfil frutado e aromático", "Perfeito para brindes descontraídos", "Combina com frutas, sobremesas leves e queijos frescos"],
              tipos=["Espumante"], uvas=["Moscato"], article="Moscatel: o espumante favorito dos brasileiros"),
        _item("vinhos-doces-harmonizar", "Seu perfil", "Vinhos doces: como beber e harmonizar",
              "Ideias práticas de harmonização para aproveitar vinhos doces e frutados do aperitivo à sobremesa.",
              "Harmonização", "djwYfH2Ms-E", "VINHOS DOCES - GUIA PARA BEBER E HARMONIZAR",
              ["Doce com salgado: um contraste que funciona", "Frutas, queijos azuis e sobremesas cremosas", "Menos é mais: sirva em taças pequenas"],
              tipos=["Branco", "Espumante", "Rosé"], uvas=["Moscato"]),
    ],
    1: [  # Seco
        _item("seco-demi-sec", "Seu perfil", "Seco, meio seco e suave: entenda a diferença",
              "O que realmente muda de um estilo para outro e como identificar o nível de doçura no rótulo.",
              "Guia", "nJtm7se1JRM", "Diferença entre Vinho Seco e Demi-Sec",
              ["Vinho seco tem pouquíssimo açúcar residual", "A sensação de 'doce' também vem da fruta e do álcool", "Procure termos como Brut, Seco, Demi-Sec e Suave"],
              tipos=["Tinto", "Branco"]),
        _item("sauvignon-blanc-guia", "Seu perfil", "Sauvignon Blanc: o branco seco por excelência",
              "Cítrico, herbáceo e refrescante: tudo sobre a uva que define o estilo dos brancos secos.",
              "Uva", "vzbRyWLmVU0", "Guia Completo da Sauvignon Blanc - Harmonizações, Dicas e Harmonizações",
              ["Aromas de maracujá, lima e capim-limão", "Acidez marcante e corpo leve", "Combina com frutos do mar, saladas e queijos de cabra"],
              tipos=["Branco"], uvas=["Sauvignon Blanc"], article="Sauvignon Blanc: frescor em cada taça"),
        _item("tanino-acidez", "Seu perfil", "Tanino, acidez e corpo na prática",
              "Aprenda a sentir na boca o que faz um vinho seco ser elegante, fresco ou estruturado.",
              "Degustação", "53jQ1aBI-iY", "Tanino, Acidez e Suavidade: Entenda na prática!",
              ["Tanino dá aquela sensação de boca 'seca'", "Acidez dá frescor e faz salivar", "Equilíbrio entre os dois é sinal de qualidade"],
              tipos=["Tinto", "Branco"]),
        _item("espumante-brut", "Seu perfil", "Brut, Demi-Sec e Doce: o rótulo dos espumantes",
              "Como decifrar o nível de doçura dos espumantes e escolher o seco ideal para você.",
              "Guia", "8retudDSVRM", "Brut, Demi-sec, Doce: Qual a diferença entre os espumantes?",
              ["Brut é o estilo seco mais popular", "Demi-Sec é perceptivelmente mais doce", "Extra Brut tem ainda menos açúcar"],
              tipos=["Espumante"], article="Brut, Extra Brut, Demi-Sec: entenda os rótulos"),
    ],
    2: [  # Equilibrado
        _item("rose-combina", "Seu perfil", "Rosé combina com quê?",
              "O vinho mais versátil à mesa: ideias de pratos para harmonizar com rosé o ano inteiro.",
              "Harmonização", "HFojNMsoThk", "Vinho Rosé combina com...",
              ["Frescor e fruta vermelha na medida", "Ótimo com saladas, massas leves e frutos do mar", "Sirva entre 8 °C e 10 °C"],
              tipos=["Rosé"], article="Harmonizações com rosé"),
        _item("rose-segredos", "Seu perfil", "O que ninguém conta sobre o vinho rosé",
              "Mitos e verdades sobre o rosé e por que ele deixou de ser 'vinho de verão' para virar estilo de vida.",
              "Descoberta", "sJD3_ykHY8Y", "O que nunca te contaram sobre o VINHO ROSÉ!",
              ["Rosé não é mistura de tinto e branco", "A cor vem do contato rápido com as cascas", "Existem rosés secos, frutados e espumantes"],
              tipos=["Rosé", "Espumante"], article="Rosé: o vinho que conquistou o mundo"),
        _item("blend-corte", "Seu perfil", "Blend e corte: o equilíbrio de várias uvas",
              "Como o enólogo combina uvas diferentes para chegar a um vinho harmônico e complexo.",
              "Uva", "yD5Ye6AIP2k", "103 Corte, Assemblage e Blend de Uvas",
              ["Cada uva contribui com uma qualidade", "O blend busca consistência e complexidade", "Muitos grandes vinhos do mundo são cortes"],
              tipos=["Tinto", "Branco", "Rosé", "Espumante"], uvas=["Blend"]),
        _item("rose-elaboracao", "Seu perfil", "Como se elabora um vinho rosé",
              "Do vinhedo à taça: entenda os métodos que dão ao rosé sua cor e seu equilíbrio.",
              "Processo", "kZyT0yiptkE", "Como se elabora um vinho rosé - Desvendando o Universo dos Vinhos #3",
              ["Maceração curta das uvas tintas", "Fermentação em temperatura controlada", "Frescor e aromas preservados"],
              tipos=["Rosé"], article="Provence e além: terroirs do rosé"),
    ],
    3: [  # Encorpado
        _item("syrah-tudo", "Seu perfil", "Syrah: força, especiarias e frutas negras",
              "A uva que dá origem a tintos intensos, com pimenta, ameixa e taninos presentes.",
              "Uva", "GYd1cS6AjQ0", "TUDO SOBRE VINHO SYRAH #vinhoem2minutos",
              ["Notas de frutas negras, pimenta preta e especiarias", "Corpo médio a pleno e final longo", "Combina com carnes grelhadas e queijos curados"],
              tipos=["Tinto"], uvas=["Syrah"], article="Syrah vs Marselan: entenda as diferenças"),
        _item("tanino-sensacao", "Seu perfil", "Tanino: a sensação dos tintos encorpados",
              "O que é o tanino, de onde ele vem e como ele muda a forma de sentir um vinho tinto.",
              "Degustação", "CnzEJw3vidI", "TANINO DO VINHO: O QUE É? QUAL A SENSAÇÃO DO TANINO EM BOCA?",
              ["Vem das cascas, sementes e da madeira", "Gordura e proteínas suavizam o tanino", "Taninos firmes pedem pratos mais robustos"],
              tipos=["Tinto"]),
        _item("decantar", "Seu perfil", "Como decantar e aerar o vinho",
              "Quando vale decantar, como fazer sem erro e o que a oxigenação muda em um tinto encorpado.",
              "Prática", "6V1pGY49Ptc", "COMO DECANTAR E AERAR O VINHO",
              ["Oxigenar abre os aromas e arredonda taninos", "Tintos jovens e estruturados ganham mais", "Sirva entre 16 °C e 18 °C"],
              tipos=["Tinto"]),
        _item("malbec-cabernet", "Seu perfil", "Duelo de tintos: Malbec x Cabernet",
              "Dois estilos clássicos de tinto frente a frente para você entender o que prefere.",
              "Comparativo", "Ry7-SNLa-8A", "Vinho Chilano é Bom Mesmo? O Duelo: Malbec x Cabernet",
              ["Compare corpo, fruta e taninos", "Treine o paladar provando lado a lado", "Anote o que mais agradou"],
              tipos=["Tinto"], uvas=["Marselan", "Syrah", "Blend"]),
    ],
}

# 2) Pelo nível de experiência (quiz: "experiencia")
CONTEUDO_NIVEL = {
    0: _item("nivel-iniciante", "Para o seu nível", "Primeiros passos no mundo do vinho",
             "Qual vinho escolher quando você está começando: dicas simples para acertar de primeira.",
             "Para iniciantes", "hn5Fx9d6KVQ", "Qual é o MELHOR VINHO Para INICIANTES",
             ["Comece por vinhos leves e frutados", "Descubra seu gosto provando estilos diferentes", "Não existe escolha errada: o melhor vinho é o que você gosta"]),
    1: _item("nivel-aprecio", "Para o seu nível", "Como escolher um bom vinho sem errar",
             "Um guia prático para ler o rótulo, comparar opções e comprar com mais segurança.",
             "Guia", "ZBvAd8WU9Yc", "COMO ESCOLHER UM BOM VINHO: GUIA PRÁTICO PARA NÃO ERRAR",
             ["Uva, país e safra contam muito sobre o estilo", "Compare produtores, não só preços", "Guarde o que gostou para repetir"],
             article="Como escolher um bom vinho tinto"),
    2: _item("nivel-experiente", "Para o seu nível", "Os 7 princípios da harmonização",
             "Uma base sólida para combinar vinhos e pratos com critério, indo além das regras decoradas.",
             "Harmonização", "0OkjeSp7_aM", "7 PRINCÍPIOS Essenciais da HARMONIZAÇÃO de VINHOS",
             ["Peso do prato x corpo do vinho", "Acidez, gordura, doçura e tanino se influenciam", "Harmonizar por semelhança ou por contraste"]),
    3: _item("nivel-apaixonado", "Para o seu nível", "Terroir: o que faz cada vinho único",
             "Clima, solo e mão humana: o conceito que explica por que a mesma uva muda de lugar para lugar.",
             "Terroir", "Dyr-32SgRbE", "O que é Terroir? Entenda de uma vez por todas!",
             ["Solo, clima, relevo e cultura de cada região", "Por que o vinho é a bebida do lugar", "Compare a mesma uva de regiões diferentes"],
             article="O Bordô brasileiro: identidade e terroir"),
}

# 3) Pelo que você vai comer (quiz: "comida")
CONTEUDO_COMIDA = {
    0: _item("comida-carnes", "Para o seu prato", "Vinho para cada tipo de carne",
             "Do churrasco ao assado: o tinto certo para cada corte e cada ponto.",
             "Harmonização", "IQvszKqkJtM", "VINHOS PERFEITOS para cada TIPO DE CARNE no CHURRASCO",
             ["Carnes gordas pedem tintos com tanino", "Cortes magros combinam com tintos mais leves", "Sirva o tinto levemente fresco"],
             tipos=["Tinto"], uvas=["Syrah", "Marselan", "Bordô", "Blend"], article="Vinhos tintos para acompanhar carnes"),
    1: _item("comida-massas", "Para o seu prato", "Qual vinho combina com massas",
             "Molho de tomate, creme ou pesto: o vinho muda conforme o molho, não a massa.",
             "Harmonização", "aKasjaK9sf4", "QUAL VINHO COMBINA COM MASSA: HARMONIZAÇÃO VINHO E PASTA",
             ["Molho de tomate pede acidez", "Molhos cremosos combinam com brancos encorpados", "Rosé é um curinga para massas leves"],
             tipos=["Tinto", "Branco", "Rosé"], uvas=["Blend", "Sauvignon Blanc"]),
    2: _item("comida-peixes", "Para o seu prato", "Vinhos para peixes, frutos do mar e carnes brancas",
             "Brancos frescos, rosés e espumantes: como acertar nas receitas leves.",
             "Harmonização", "v4qRSVAFt-c", "Vinhos com Peixes, Aves e outras Carnes Brancas - Como Harmonizar?",
             ["Acidez do vinho realça o frescor do prato", "Brancos secos e minerais são os mais seguros", "Evite tintos muito tânicos"],
             tipos=["Branco", "Rosé"], uvas=["Sauvignon Blanc", "Moscato"], article="Vinhos brancos para frutos do mar"),
    3: _item("comida-queijos", "Para o seu prato", "Queijos e vinhos: o guia para não errar",
             "Monte uma tábua e combine cada queijo com o estilo de vinho ideal.",
             "Harmonização", "_FYi6mLoaqY", "Como Combinar Vinhos e Queijos: O Guia Para Não Errar",
             ["Queijos frescos pedem brancos e espumantes", "Curados combinam com tintos estruturados", "Doçura equilibra queijos salgados"],
             tipos=["Espumante", "Rosé", "Branco"], uvas=["Blend", "Marselan", "Moscato"], article="Harmonizações com espumantes"),
}

# 4) Pela ocasião (quiz: "ocasiao")
CONTEUDO_OCASIAO = {
    0: _item("ocasiao-jantar", "Para a sua ocasião", "Jantar especial: como escolher o vinho",
             "Impressione sem errar: critérios simples para escolher o vinho de um jantar a dois ou com convidados.",
             "Ocasião", "DWpG8zgav9c", "Fui convidada para jantar: como escolho o vinho sem errar",
             ["Considere o menu antes do vinho", "Leve algo versátil se não conhece o gosto dos convidados", "Atenção à temperatura de serviço"],
             tipos=["Tinto", "Branco"]),
    1: _item("ocasiao-celebracao", "Para a sua ocasião", "Celebração: como escolher um bom espumante",
             "Dicas de sommelier para acertar no espumante da festa, do brinde ao fim de ano.",
             "Ocasião", "zUzEfNMwlYo", "Dicas para escolher um bom espumante",
             ["Brut é o mais versátil para brindes", "Sirva bem gelado, entre 6 °C e 8 °C", "Abra a garrafa devagar, segurando a rolha"],
             tipos=["Espumante", "Rosé"], article="Espumante além das celebrações"),
    2: _item("ocasiao-presente", "Para a sua ocasião", "Como escolher um vinho para presentear",
             "O que levar de presente: estilos seguros, apresentação e como acertar o gosto de quem recebe.",
             "Ocasião", "cr3R7BNcU04", "COMO ESCOLHER um VINHO para PRESENTE?",
             ["Prefira estilos universais e bem avaliados", "Capriche na embalagem", "Um rótulo com história agrada"],
             tipos=["Tinto", "Espumante"]),
    3: _item("ocasiao-pessoal", "Para a sua ocasião", "Que vinho abrir hoje? Dicas para o dia a dia",
             "Um vinho para o seu momento: escolhas simples para o almoço, o jantar ou a pausa no fim do dia.",
             "Ocasião", "d9lN3RKM5qY", "Que vinho abrir hoje? Dicas simples para o almoço e jantar do dia a dia - Podcast Vinhos de Corte",
             ["Vinho do dia a dia pode ser simples e bom", "Garrafas abertas duram alguns dias bem fechadas", "Escolha pelo humor e pelo prato"],
             tipos=["Branco", "Rosé"]),
}

# ── apresentação do perfil ──
PERFIS_INFO = {
    0: {
        "description": "Você gosta de vinhos que chegam com fruta, aroma e leveza. A doçura natural das uvas, o frescor e a facilidade de beber são o seu forte: Moscato, espumantes aromáticos e rosés frutados são o seu território.",
        "traits": ["Frutado", "Aromático", "Leve", "Fácil de beber"],
    },
    1: {
        "description": "Você aprecia precisão: vinhos secos, com acidez viva e pouca doçura. Brancos minerais e cítricos, tintos elegantes e espumantes brut combinam com o seu paladar.",
        "traits": ["Seco", "Fresco", "Mineral", "Elegante"],
    },
    2: {
        "description": "Você busca harmonia: nem tão leve, nem tão intenso. Rosés, blends e brancos versáteis acompanham bem de tudo e se adaptam a qualquer momento.",
        "traits": ["Equilibrado", "Versátil", "Harmônico", "Para todas as ocasiões"],
    },
    3: {
        "description": "Você gosta de vinhos com presença: corpo, estrutura e final longo. Tintos de Syrah, Marselan e blends intensos, ideais com carnes e pratos robustos, são a sua praia.",
        "traits": ["Encorpado", "Intenso", "Estruturado", "Final longo"],
    },
}

NIVEIS = {
    0: ("Iniciante curioso", "Você está começando: vamos de passos simples e vinhos fáceis de gostar."),
    1: ("Apreciador", "Você já sabe do que gosta: hora de afinar a escolha e ler melhor os rótulos."),
    2: ("Conhecedor", "Você tem repertório: vale aprofundar harmonizações e comparar estilos."),
    3: ("Entusiasta apaixonado", "Você vive o vinho: terroir, uvas e detalhes são o seu terreno."),
}


def perfil_detalhado(answers: dict) -> dict:
    info = PERFIS_INFO.get(answers["sabor"], PERFIS_INFO[2])
    nivel, dica = NIVEIS.get(answers["experiencia"], NIVEIS[0])
    return {
        "profile": profile_label(answers),
        "profileDescription": info["description"],
        "traits": info["traits"],
        "level": nivel,
        "levelTip": dica,
    }


def vinhos_do_conteudo(item: dict, ranking: list, limite: int = 3) -> list[int]:
    """Escolhe, entre os vinhos já ranqueados, os que combinam com o assunto do conteúdo.

    Prioriza a uva citada pelo conteúdo, depois a compatibilidade com o quiz.
    """
    tipos, uvas = item["tipos"], item["uvas"]
    candidatos = [
        (wine, compat) for wine, compat, _ in ranking
        if not tipos or wine.type in tipos
    ]
    if not candidatos:  # sem tipo em comum: usa os mais compatíveis
        candidatos = [(wine, compat) for wine, compat, _ in ranking]
    # sorted é estável: em empate mantém a ordem do ranking
    candidatos = sorted(candidatos, key=lambda c: (0 if c[0].grape in uvas else 1, -c[1]))
    return [wine.id for wine, _ in candidatos[:limite]]


def personalized_content(answers: dict, ranking: list | None = None) -> list[dict]:
    """7 conteúdos em vídeo: 4 do perfil + nível + prato + ocasião.

    Se 'ranking' (saída de rank_wines) for informado, cada conteúdo também
    leva 'wineIds': os vinhos da loja relacionados ao assunto.
    """
    itens = list(CONTEUDO_PERFIL[answers["sabor"]])
    itens.append(CONTEUDO_NIVEL[answers["experiencia"]])
    itens.append(CONTEUDO_COMIDA[answers["comida"]])
    itens.append(CONTEUDO_OCASIAO[answers["ocasiao"]])

    saida = []
    for item in itens:
        pronto = {k: v for k, v in item.items() if k not in ("tipos", "uvas")}
        pronto["wineIds"] = vinhos_do_conteudo(item, ranking) if ranking is not None else []
        saida.append(pronto)
    return saida
