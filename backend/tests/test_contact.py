MENSAGEM = {
    "name": "Maria Silva",
    "email": "maria@brisa.com",
    "subject": "Dúvida sobre entrega",
    "message": "Vocês entregam em Campinas?",
}


def test_qualquer_visitante_envia_mensagem(client):
    resp = client.post("/contact", json=MENSAGEM)
    assert resp.status_code == 201
    assert "id" in resp.json()


def test_mensagem_com_email_invalido_retorna_422(client):
    resp = client.post("/contact", json={**MENSAGEM, "email": "invalido"})
    assert resp.status_code == 422


def test_mensagem_vazia_retorna_422(client):
    resp = client.post("/contact", json={**MENSAGEM, "message": ""})
    assert resp.status_code == 422


def test_cliente_comum_nao_le_mensagens(client, auth_header):
    client.post("/contact", json=MENSAGEM)
    assert client.get("/admin/contact", headers=auth_header).status_code == 403
    assert client.get("/admin/contact").status_code in (401, 403)


def test_admin_lista_marca_respondida_e_exclui(client, admin_header):
    id_msg = client.post("/contact", json=MENSAGEM).json()["id"]

    lista = client.get("/admin/contact", headers=admin_header).json()
    assert len(lista) == 1
    assert lista[0]["subject"] == "Dúvida sobre entrega"
    assert lista[0]["answered"] is False

    resp = client.put(f"/admin/contact/{id_msg}", json={"answered": True}, headers=admin_header)
    assert resp.json()["answered"] is True
    assert client.get("/admin/contact?answered=false", headers=admin_header).json() == []

    assert client.delete(f"/admin/contact/{id_msg}", headers=admin_header).status_code == 204
    assert client.get("/admin/contact", headers=admin_header).json() == []
