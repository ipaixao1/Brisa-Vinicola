from tests.test_orders import fazer_pedido

NOVO_VINHO = {
    "name": "Vinho de Teste",
    "producer": "Brisa Vinícola",
    "type": "Tinto",
    "grape": "Merlot",
    "origin": "Brasil",
    "price": 99.9,
    "description": "Vinho criado pelos testes automáticos.",
    "alcohol": "13%",
    "acidity": "5 g/L",
    "volume": "750ml",
    "servingTemp": "16°C",
}


def test_admin_cadastra_vinho(client, admin_header):
    resp = client.post("/admin/wines", json=NOVO_VINHO, headers=admin_header)
    assert resp.status_code == 201
    assert resp.json()["name"] == "Vinho de Teste"
    assert client.get("/wines").json()["total"] == 13


def test_cliente_comum_nao_cadastra_vinho(client, auth_header):
    assert client.post("/admin/wines", json=NOVO_VINHO, headers=auth_header).status_code == 403
    assert client.post("/admin/wines", json=NOVO_VINHO).status_code in (401, 403)


def test_admin_edita_preco(client, admin_header):
    resp = client.put("/admin/wines/1", json={"price": 150.0}, headers=admin_header)
    assert resp.status_code == 200
    assert client.get("/wines/1").json()["price"] == 150.0


def test_vinho_ja_vendido_nao_pode_ser_excluido(client, auth_header, admin_header):
    fazer_pedido(client, auth_header, itens=[{"wine_id": 1, "qty": 1}])
    assert client.delete("/admin/wines/1", headers=admin_header).status_code == 409


def test_vinho_nunca_vendido_pode_ser_excluido(client, admin_header):
    assert client.delete("/admin/wines/1", headers=admin_header).status_code == 204
    assert client.get("/wines/1").status_code == 404
