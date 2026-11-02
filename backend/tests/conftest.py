import os

# Os testes usam um banco SQLite descartável, nunca o MySQL do .env.
# Isto precisa vir ANTES de importar a aplicação.
os.environ["DATABASE_URL"] = "sqlite:///./test_brisa.db"
os.environ.setdefault("SECRET_KEY", "chave-de-teste")

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app
from app import seed


@pytest.fixture(autouse=True)
def banco_limpo():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed.run()  # carrega os 12 vinhos
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def auth_header(client):
    resp = client.post(
        "/auth/register",
        json={"name": "Teste", "email": "teste@brisa.com", "password": "123456"},
    )
    assert resp.status_code == 201
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}
