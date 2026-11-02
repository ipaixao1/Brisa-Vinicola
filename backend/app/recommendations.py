"""Quiz e recomendação de vinhos.

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


# ── conteúdo personalizado ──
CONTEUDO = {
    "Tinto": [
        {"title": "Como escolher um bom vinho tinto", "description": "Descubra as principais características que definem a qualidade de um vinho tinto e como identificá-las na taça.", "tag": "Guia"},
        {"title": "Syrah vs Marselan: entenda as diferenças", "description": "Dois tintos robustos com personalidades distintas. Saiba qual combina mais com o seu paladar.", "tag": "Comparativo"},
        {"title": "Vinhos tintos para acompanhar carnes", "description": "Harmonizações clássicas e surpreendentes entre tintos encorpados e diferentes tipos de carne.", "tag": "Harmonização"},
        {"title": "O Bordô brasileiro: identidade e terroir", "description": "Conheça a uva mais plantada do Brasil e sua expressão única em vinhos acessíveis e autênticos.", "tag": "Uva"},
    ],
    "Branco": [
        {"title": "Sauvignon Blanc: frescor em cada taça", "description": "Da Nova Zelândia à França, explore as nuances desta uva que encanta pelo frescor e pelos aromas cítricos.", "tag": "Uva"},
        {"title": "Vinhos brancos para frutos do mar", "description": "As melhores harmonizações entre brancos frescos e minerais com peixes, ostras e camarões.", "tag": "Harmonização"},
        {"title": "Chardonnay: do leve ao encorpado", "description": "Entenda como o terroir e o uso de barrica transformam completamente o perfil desta uva versátil.", "tag": "Guia"},
        {"title": "Moscato: doce, floral e irresistível", "description": "O encanto dos vinhos de Moscato e como aproveitá-los em diferentes momentos.", "tag": "Descoberta"},
    ],
    "Espumante": [
        {"title": "Espumante além das celebrações", "description": "Espumantes são versáteis o ano todo. Veja como incluí-los no seu dia a dia com elegância.", "tag": "Estilo de vida"},
        {"title": "Brut, Extra Brut, Demi-Sec: entenda os rótulos", "description": "O nível de doçura dos espumantes e como escolher o certo para cada momento.", "tag": "Guia"},
        {"title": "Harmonizações com espumantes", "description": "Queijos, frutos do mar, sobremesas e até carnes — veja o que vai surpreendentemente bem com as borbulhas.", "tag": "Harmonização"},
        {"title": "Moscatel: o espumante favorito dos brasileiros", "description": "Doce, aromático e acessível, o Moscatel conquista paladares em todo o Brasil.", "tag": "Uva"},
    ],
    "Rosé": [
        {"title": "Rosé: o vinho que conquistou o mundo", "description": "Como os vinhos rosé saíram da margem para se tornar tendência entre os melhores sommeliers.", "tag": "Tendência"},
        {"title": "Provence e além: terroirs do rosé", "description": "Das regiões clássicas francesas aos rótulos brasileiros, explore o melhor do mundo rosé.", "tag": "Terroir"},
        {"title": "Harmonizações com rosé", "description": "Do jantar à praia, descubra pratos e ocasiões que combinam perfeitamente com rosés.", "tag": "Harmonização"},
        {"title": "Rosé seco ou suave: como escolher?", "description": "Entenda as diferenças de perfil e aprenda a identificar no rótulo qual rosé vai te agradar mais.", "tag": "Guia"},
    ],
}

TIPO_PRINCIPAL_POR_SABOR = {0: "Espumante", 1: "Tinto", 2: "Rosé", 3: "Tinto"}
TIPO_SECUNDARIO_POR_COMIDA = {0: "Tinto", 1: "Tinto", 2: "Branco", 3: "Espumante"}


def personalized_content(answers: dict) -> list[dict]:
    """3 conteúdos do tipo principal (pelo sabor) + 2 do secundário (pela comida)."""
    principal_tipo = TIPO_PRINCIPAL_POR_SABOR[answers["sabor"]]
    secundario_tipo = TIPO_SECUNDARIO_POR_COMIDA[answers["comida"]]

    principal = CONTEUDO[principal_tipo]
    # se os dois tipos forem iguais, não repete conteúdo
    secundario = [] if secundario_tipo == principal_tipo else CONTEUDO[secundario_tipo]
    return principal[:3] + secundario[:2]
