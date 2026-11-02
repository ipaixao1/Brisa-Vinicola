ENDERECO = {
    "recipient": "Maria Silva",
    "cep": "01001-000",
    "street": "Praça da Sé",
    "number": "10",
    "complement": "",
    "neighborhood": "Sé",
    "city": "São Paulo",
    "state": "sp",
    "reference": "",
}


def test_primeiro_endereco_vira_principal_e_uf_em_maiusculas(client, auth_header):
    resp = client.post("/addresses", json=ENDERECO, headers=auth_header)
    assert resp.status_code == 201
    dados = resp.json()
    assert dados["isPrimary"] is True
    assert dados["state"] == "SP"


def test_segundo_endereco_nao_e_principal(client, auth_header):
    client.post("/addresses", json=ENDERECO, headers=auth_header)
    resp = client.post("/addresses", json={**ENDERECO, "number": "20"}, headers=auth_header)
    assert resp.json()["isPrimary"] is False


def test_trocar_endereco_principal(client, auth_header):
    primeiro = client.post("/addresses", json=ENDERECO, headers=auth_header).json()
    segundo = client.post("/addresses", json={**ENDERECO, "number": "20"}, headers=auth_header).json()

    resp = client.post(f"/addresses/{segundo['id']}/primary", headers=auth_header)
    assert resp.status_code == 200

    lista = client.get("/addresses", headers=auth_header).json()
    assert [a["id"] for a in lista] == [segundo["id"], primeiro["id"]]  # principal vem primeiro
    assert [a["isPrimary"] for a in lista] == [True, False]


def test_excluir_principal_passa_para_outro(client, auth_header):
    primeiro = client.post("/addresses", json=ENDERECO, headers=auth_header).json()
    segundo = client.post("/addresses", json={**ENDERECO, "number": "20"}, headers=auth_header).json()

    assert client.delete(f"/addresses/{primeiro['id']}", headers=auth_header).status_code == 204

    lista = client.get("/addresses", headers=auth_header).json()
    assert len(lista) == 1
    assert lista[0]["id"] == segundo["id"]
    assert lista[0]["isPrimary"] is True


def test_editar_endereco(client, auth_header):
    criado = client.post("/addresses", json=ENDERECO, headers=auth_header).json()
    resp = client.put(f"/addresses/{criado['id']}", json={"city": "Campinas"}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["city"] == "Campinas"
    assert resp.json()["street"] == "Praça da Sé"  # o resto não muda


def test_cep_curto_retorna_422(client, auth_header):
    resp = client.post("/addresses", json={**ENDERECO, "cep": "123"}, headers=auth_header)
    assert resp.status_code == 422


def test_enderecos_exigem_login(client):
    assert client.get("/addresses").status_code in (401, 403)


def test_usuario_nao_acessa_endereco_de_outro(client, auth_header, outro_header):
    criado = client.post("/addresses", json=ENDERECO, headers=auth_header).json()

    assert client.get("/addresses", headers=outro_header).json() == []
    assert client.put(f"/addresses/{criado['id']}", json={"city": "X"}, headers=outro_header).status_code == 404
    assert client.delete(f"/addresses/{criado['id']}", headers=outro_header).status_code == 404
    assert client.post(f"/addresses/{criado['id']}/primary", headers=outro_header).status_code == 404
