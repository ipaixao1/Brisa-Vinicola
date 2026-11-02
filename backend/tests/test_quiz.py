QUIZ_TINTO_CARNES = {"ocasiao": 0, "sabor": 3, "comida": 0, "experiencia": 2, "preco": 1}


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
    assert len(dados["content"]) == 3  # sabor e comida apontam para Tinto


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
    assert resp.json()["wines"][0]["type"] == "Tinto"


def test_recomendacoes_sem_quiz_retorna_404(client, auth_header):
    resp = client.get("/users/me/recommendations", headers=auth_header)
    assert resp.status_code == 404


def test_recomendacoes_exigem_login(client):
    resp = client.get("/users/me/recommendations")
    assert resp.status_code in (401, 403)
    resp = client.put("/users/me/quiz", json=QUIZ_TINTO_CARNES)
    assert resp.status_code in (401, 403)
