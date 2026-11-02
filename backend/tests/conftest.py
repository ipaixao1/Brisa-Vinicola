import os

# Os testes usam um banco SQLite descartável, nunca o MySQL do .env.
# Isto precisa vir ANTES de importar a aplicação.
os.environ["DATABASE_URL"] = "sqlite:///./test_brisa.db"
os.environ["SECRET_KEY"] = "chave-de-teste-com-mais-de-trinta-e-dois-caracteres"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app import seed
from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import User


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


def criar_usuario(client, email, nome="Teste"):
    resp = client.post(
        "/auth/register",
        json={"name": nome, "email": email, "password": "123456"},
    )
    assert resp.status_code == 201
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}


@pytest.fixture()
def auth_header(client):
    return criar_usuario(client, "teste@brisa.com")


@pytest.fixture()
def outro_header(client):
    return criar_usuario(client, "outro@brisa.com", "Outro Usuário")


@pytest.fixture()
def admin_header(client):
    header = criar_usuario(client, "admin@brisa.com", "Administrador")
    with SessionLocal() as db:
        admin = db.scalar(select(User).where(User.email == "admin@brisa.com"))
        admin.is_admin = True
        db.commit()
    return header
