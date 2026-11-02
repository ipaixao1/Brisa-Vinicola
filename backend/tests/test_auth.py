def test_cadastro_retorna_token_e_usuario(client):
    resp = client.post(
        "/auth/register",
        json={"name": "Maria Silva", "email": "Maria@Brisa.com", "password": "123456"},
    )
    assert resp.status_code == 201
    dados = resp.json()
    assert dados["token_type"] == "bearer"
    assert dados["access_token"]
    assert dados["user"]["email"] == "maria@brisa.com"  # e-mail é guardado em minúsculas
    assert dados["user"]["isAdmin"] is False
    assert dados["user"]["quizAnswers"] is None


def test_cadastro_nao_devolve_senha(client):
    resp = client.post(
        "/auth/register",
        json={"name": "Maria Silva", "email": "maria@brisa.com", "password": "123456"},
    )
    assert "password" not in resp.text
    assert "123456" not in resp.text


def test_email_duplicado_retorna_409(client):
    corpo = {"name": "Maria Silva", "email": "maria@brisa.com", "password": "123456"}
    assert client.post("/auth/register", json=corpo).status_code == 201
    resp = client.post("/auth/register", json={**corpo, "email": "MARIA@brisa.com"})
    assert resp.status_code == 409


def test_senha_curta_retorna_422(client):
    resp = client.post(
        "/auth/register",
        json={"name": "Maria Silva", "email": "maria@brisa.com", "password": "123"},
    )
    assert resp.status_code == 422


def test_email_invalido_retorna_422(client):
    resp = client.post(
        "/auth/register",
        json={"name": "Maria Silva", "email": "isso-nao-e-email", "password": "123456"},
    )
    assert resp.status_code == 422


def test_login_correto(client, auth_header):
    resp = client.post("/auth/login", json={"email": "teste@brisa.com", "password": "123456"})
    assert resp.status_code == 200
    assert resp.json()["user"]["email"] == "teste@brisa.com"


def test_login_senha_errada_retorna_401(client, auth_header):
    resp = client.post("/auth/login", json={"email": "teste@brisa.com", "password": "errada"})
    assert resp.status_code == 401


def test_login_email_inexistente_retorna_401(client):
    resp = client.post("/auth/login", json={"email": "ninguem@brisa.com", "password": "123456"})
    assert resp.status_code == 401


def test_me_com_token(client, auth_header):
    resp = client.get("/auth/me", headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["email"] == "teste@brisa.com"


def test_me_sem_token_ou_token_invalido(client):
    assert client.get("/auth/me").status_code in (401, 403)
    resp = client.get("/auth/me", headers={"Authorization": "Bearer token-falso"})
    assert resp.status_code == 401
