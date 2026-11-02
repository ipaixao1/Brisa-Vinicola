def test_lista_paginada(client):
    dados = client.get("/wines").json()
    assert dados["total"] == 12
    assert len(dados["items"]) == 9
    assert dados["pages"] == 2
    assert len(client.get("/wines?page=2").json()["items"]) == 3


def test_filtro_por_tipo(client):
    dados = client.get("/wines?type=Tinto&page_size=50").json()
    assert dados["total"] == 5
    assert all(v["type"] == "Tinto" for v in dados["items"])


def test_busca_por_nome(client):
    dados = client.get("/wines?q=primitivo&page_size=50").json()
    assert dados["total"] >= 1
    assert all("primitivo" in v["name"].lower() for v in dados["items"])


def test_filtro_por_faixa_de_preco(client):
    dados = client.get("/wines?min_price=100&max_price=130&page_size=50").json()
    assert dados["total"] >= 1
    assert all(100 <= v["price"] <= 130 for v in dados["items"])


def test_ordenacao_por_menor_preco(client):
    precos = [v["price"] for v in client.get("/wines?sort=menor&page_size=50").json()["items"]]
    assert precos == sorted(precos)


def test_detalhe_do_vinho(client):
    resp = client.get("/wines/1")
    assert resp.status_code == 200
    dados = resp.json()
    assert dados["id"] == 1
    assert isinstance(dados["traits"], list)
    assert "servingTemp" in dados


def test_vinho_inexistente_retorna_404(client):
    assert client.get("/wines/9999").status_code == 404


def test_vinhos_relacionados(client):
    vinho = client.get("/wines/1").json()
    relacionados = client.get("/wines/1/related").json()
    assert 1 <= len(relacionados) <= 3
    assert all(v["type"] == vinho["type"] and v["id"] != 1 for v in relacionados)


def test_filtros_disponiveis(client):
    dados = client.get("/wines/filters").json()
    assert set(dados["types"]) == {"Tinto", "Branco", "Espumante", "Rosé"}
    assert len(dados["grapes"]) >= 1
