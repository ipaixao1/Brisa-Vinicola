import itertools

from app.recommendations import (
    CONTEUDO_COMIDA,
    CONTEUDO_NIVEL,
    CONTEUDO_OCASIAO,
    CONTEUDO_PERFIL,
)

QUIZ_TINTO_CARNES = {"ocasiao": 0, "sabor": 3, "comida": 0, "experiencia": 2, "preco": 1}
QUIZ_FRUTADO_DOCE = {"ocasiao": 1, "sabor": 0, "comida": 3, "experiencia": 0, "preco": 0}


def test_recomendacao_publica_ordena_por_compatibilidade(client):
    resp = client.post("/quiz/recommend", json=QUIZ_TINTO_CARNES)
    assert resp.status_code == 200
    dados = resp.json()

    assert dados["profile"] == "Entusiasta de Vinhos Encorpados"
    assert len(dados["wines"]) == 12
    compat = [w["compatibility"] for w in dados["wines"]]
    assert compat == sorted(compat, reverse=True)
    assert dados["wines"][0]["type"] == "Tinto"
    assert all(0 <= c <= 100 for c in compat)


def test_perfil_traz_descricao_nivel_e_caracteristicas(client):
    dados = client.post("/quiz/recommend", json=QUIZ_TINTO_CARNES).json()
    assert dados["profileDescription"]
    assert len(dados["traits"]) >= 3
    assert dados["level"] == "Conhecedor"
    assert dados["levelTip"]


def test_conteudo_tem_sete_videos_do_youtube(client):
    conteudo = client.post("/quiz/recommend", json=QUIZ_TINTO_CARNES).json()["content"]
    assert len(conteudo) == 7
    assert len({c["id"] for c in conteudo}) == 7
    for c in conteudo:
        assert c["videoUrl"].startswith("https://www.youtube.com/watch?v=")
        assert c["videoTitle"] and c["title"] and c["description"]
        assert len(c["learn"]) >= 3


def test_conteudo_traz_vinhos_da_loja_que_existem(client):
    dados = client.post("/quiz/recommend", json=QUIZ_TINTO_CARNES).json()
    ids_da_loja = {w["id"] for w in dados["wines"]}
    for c in dados["content"]:
        assert 1 <= len(c["wineIds"]) <= 3
        assert set(c["wineIds"]) <= ids_da_loja


def test_perfis_diferentes_recebem_conteudos_diferentes(client):
    tinto = client.post("/quiz/recommend", json=QUIZ_TINTO_CARNES).json()
    frutado = client.post("/quiz/recommend", json=QUIZ_FRUTADO_DOCE).json()

    assert tinto["profile"] != frutado["profile"]
    assert tinto["profileDescription"] != frutado["profileDescription"]
    ids_tinto = {c["id"] for c in tinto["content"]}
    ids_frutado = {c["id"] for c in frutado["content"]}
    assert ids_tinto.isdisjoint(ids_frutado)
    # o conteúdo de perfil muda conforme o sabor escolhido
    assert frutado["content"][0]["id"] in {c["id"] for c in CONTEUDO_PERFIL[0]}
    assert tinto["content"][0]["id"] in {c["id"] for c in CONTEUDO_PERFIL[3]}


def test_catalogo_de_conteudos_esta_completo():
    ids = []
    for grupo in CONTEUDO_PERFIL.values():
        assert len(grupo) == 4
        ids += [c["id"] for c in grupo]
    for catalogo in (CONTEUDO_NIVEL, CONTEUDO_COMIDA, CONTEUDO_OCASIAO):
        assert set(catalogo) == {0, 1, 2, 3}
        ids += [c["id"] for c in catalogo.values()]
    assert len(ids) == len(set(ids)) == 28
    videos = [
        c["videoUrl"]
        for grupo in list(CONTEUDO_PERFIL.values()) + [list(CONTEUDO_NIVEL.values()), list(CONTEUDO_COMIDA.values()), list(CONTEUDO_OCASIAO.values())]
        for c in grupo
    ]
    assert len(set(videos)) == 28  # nenhum vídeo repetido


def test_todas_as_combinacoes_do_quiz_funcionam(client):
    # 4^5 = 1024 combinações é muito para HTTP; testa uma por perfil/nível/comida/ocasião
    for sabor, exp, comida, ocasiao in itertools.product(range(4), repeat=4):
        if (sabor + exp + comida + ocasiao) % 3:
            continue
        resp = client.post(
            "/quiz/recommend",
            json={"ocasiao": ocasiao, "sabor": sabor, "comida": comida, "experiencia": exp, "preco": 1},
        )
        assert resp.status_code == 200
        assert len(resp.json()["content"]) == 7


def test_resposta_invalida_retorna_422(client):
    resp = client.post("/quiz/recommend", json={**QUIZ_TINTO_CARNES, "sabor": 5})
    assert resp.status_code == 422


def test_salvar_quiz_e_ler_no_login(client, auth_header):
    resp = client.put("/users/me/quiz", json=QUIZ_TINTO_CARNES, headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["quizAnswers"] == QUIZ_TINTO_CARNES

    login = client.post("/auth/login", json={"email": "teste@brisa.com", "password": "123456"})
    assert login.json()["user"]["quizAnswers"] == QUIZ_TINTO_CARNES


def test_minhas_recomendacoes(client, auth_header):
    client.put("/users/me/quiz", json=QUIZ_TINTO_CARNES, headers=auth_header)
    resp = client.get("/users/me/recommendations", headers=auth_header)
    assert resp.status_code == 200
    dados = resp.json()
    assert dados["wines"][0]["type"] == "Tinto"
    assert len(dados["content"]) == 7


def test_recomendacoes_sem_quiz_retorna_404(client, auth_header):
    resp = client.get("/users/me/recommendations", headers=auth_header)
    assert resp.status_code == 404


def test_recomendacoes_exigem_login(client):
    resp = client.get("/users/me/recommendations")
    assert resp.status_code in (401, 403)
    resp = client.put("/users/me/quiz", json=QUIZ_TINTO_CARNES)
    assert resp.status_code in (401, 403)
