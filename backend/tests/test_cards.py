CARTAO = {"number": "4111 1111 1111 1111", "name": "maria silva", "expiry": "12/30"}


def test_salvar_cartao_guarda_so_bandeira_e_final(client, auth_header):
    resp = client.post("/cards", json=CARTAO, headers=auth_header)
    assert resp.status_code == 201
    dados = resp.json()
    assert dados["brand"] == "Visa"
    assert dados["last4"] == "1111"
    assert dados["holderName"] == "MARIA SILVA"
    assert dados["isPrimary"] is True
    # o número completo nunca volta na resposta
    assert "number" not in dados
    assert "4111111111111111" not in resp.text
    assert "4111 1111 1111 1111" not in resp.text


def test_numero_completo_nao_aparece_na_listagem(client, auth_header):
    client.post("/cards", json=CARTAO, headers=auth_header)
    texto = client.get("/cards", headers=auth_header).text
    assert "4111111111111111" not in texto
    assert "4111 1111 1111 1111" not in texto


def test_detecta_mastercard(client, auth_header):
    resp = client.post(
        "/cards",
        json={"number": "5555 5555 5555 4444", "name": "Maria", "expiry": "01/29"},
        headers=auth_header,
    )
    assert resp.json()["brand"] == "Mastercard"
    assert resp.json()["last4"] == "4444"


def test_validade_invalida_retorna_422(client, auth_header):
    resp = client.post("/cards", json={**CARTAO, "expiry": "13/30"}, headers=auth_header)
    assert resp.status_code == 422


def test_numero_curto_retorna_422(client, auth_header):
    resp = client.post("/cards", json={**CARTAO, "number": "4111"}, headers=auth_header)
    assert resp.status_code == 422


def test_trocar_e_excluir_cartao_principal(client, auth_header):
    primeiro = client.post("/cards", json=CARTAO, headers=auth_header).json()
    segundo = client.post(
        "/cards",
        json={"number": "5555 5555 5555 4444", "name": "Maria", "expiry": "01/29"},
        headers=auth_header,
    ).json()
    assert segundo["isPrimary"] is False

    client.post(f"/cards/{segundo['id']}/primary", headers=auth_header)
    lista = client.get("/cards", headers=auth_header).json()
    assert lista[0]["id"] == segundo["id"] and lista[0]["isPrimary"] is True

    client.delete(f"/cards/{segundo['id']}", headers=auth_header)
    lista = client.get("/cards", headers=auth_header).json()
    assert len(lista) == 1
    assert lista[0]["id"] == primeiro["id"] and lista[0]["isPrimary"] is True


def test_usuario_nao_mexe_no_cartao_de_outro(client, auth_header, outro_header):
    criado = client.post("/cards", json=CARTAO, headers=auth_header).json()
    assert client.get("/cards", headers=outro_header).json() == []
    assert client.delete(f"/cards/{criado['id']}", headers=outro_header).status_code == 404
