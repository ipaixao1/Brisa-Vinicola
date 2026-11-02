import pytest


def fazer_pedido(client, header, itens=None, uf="SP", pagamento="pix", parcelas=1):
    corpo = {
        "items": itens if itens is not None else [{"wine_id": 1, "qty": 2}],
        "address": {
            "cep": "01001-000",
            "street": "Praça da Sé",
            "number": "10",
            "complement": "",
            "district": "Sé",
            "city": "São Paulo",
            "state": uf,
        },
        "payMethod": pagamento,
        "installments": parcelas,
    }
    return client.post("/orders", json=corpo, headers=header)


def test_pedido_calcula_subtotal_frete_e_total_no_servidor(client, auth_header):
    preco = client.get("/wines/1").json()["price"]
    resp = fazer_pedido(client, auth_header)
    assert resp.status_code == 201
    pedido = resp.json()

    assert pedido["id"].startswith("BV-")
    assert pedido["subtotal"] == pytest.approx(preco * 2, abs=0.01)
    assert pedido["frete"] == pytest.approx(14.9)  # SP
    assert pedido["total"] == pytest.approx(preco * 2 + 14.9, abs=0.01)
    assert pedido["statusIndex"] == 0
    assert pedido["userEmail"] == "teste@brisa.com"
    assert pedido["items"][0]["qty"] == 2
    assert pedido["items"][0]["wine"]["id"] == 1
    assert pedido["address"]["state"] == "SP"


def test_frete_depende_do_estado(client, auth_header):
    assert fazer_pedido(client, auth_header, uf="RJ").json()["frete"] == pytest.approx(19.9)
    assert fazer_pedido(client, auth_header, uf="xx").json()["frete"] == pytest.approx(29.9)  # padrão


def test_itens_repetidos_sao_somados(client, auth_header):
    itens = [{"wine_id": 1, "qty": 1}, {"wine_id": 1, "qty": 2}]
    pedido = fazer_pedido(client, auth_header, itens=itens).json()
    assert len(pedido["items"]) == 1
    assert pedido["items"][0]["qty"] == 3


def test_parcelas_so_valem_no_credito(client, auth_header):
    credito = fazer_pedido(client, auth_header, pagamento="cartao-credito", parcelas=3).json()
    assert credito["installments"] == 3
    pix = fazer_pedido(client, auth_header, pagamento="pix", parcelas=5).json()
    assert pix["installments"] == 1


def test_vinho_inexistente_retorna_400(client, auth_header):
    resp = fazer_pedido(client, auth_header, itens=[{"wine_id": 9999, "qty": 1}])
    assert resp.status_code == 400


def test_pedido_vazio_ou_quantidade_invalida_retorna_422(client, auth_header):
    assert fazer_pedido(client, auth_header, itens=[]).status_code == 422
    assert fazer_pedido(client, auth_header, itens=[{"wine_id": 1, "qty": 0}]).status_code == 422


def test_forma_de_pagamento_invalida_retorna_422(client, auth_header):
    assert fazer_pedido(client, auth_header, pagamento="boleto").status_code == 422


def test_pedido_exige_login(client):
    assert fazer_pedido(client, {}).status_code in (401, 403)


def test_lista_do_mais_novo_para_o_mais_antigo(client, auth_header):
    primeiro = fazer_pedido(client, auth_header).json()["id"]
    segundo = fazer_pedido(client, auth_header).json()["id"]
    lista = client.get("/orders", headers=auth_header).json()
    assert [p["id"] for p in lista] == [segundo, primeiro]


def test_usuario_so_ve_os_proprios_pedidos(client, auth_header, outro_header):
    codigo = fazer_pedido(client, auth_header).json()["id"]
    assert client.get("/orders", headers=outro_header).json() == []
    assert client.get(f"/orders/{codigo}", headers=outro_header).status_code == 404
    assert client.get(f"/orders/{codigo}", headers=auth_header).status_code == 200


def test_status_avanca_ate_entregue(client, auth_header):
    codigo = fazer_pedido(client, auth_header).json()["id"]
    resp = client.post(f"/orders/{codigo}/advance", headers=auth_header)
    assert resp.json()["statusIndex"] == 1
    for _ in range(10):
        resp = client.post(f"/orders/{codigo}/advance", headers=auth_header)
    assert resp.json()["statusIndex"] == 6  # "Entregue" é o último


def test_nao_avanca_pedido_de_outro_usuario(client, auth_header, outro_header):
    codigo = fazer_pedido(client, auth_header).json()["id"]
    assert client.post(f"/orders/{codigo}/advance", headers=outro_header).status_code == 404
