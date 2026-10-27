from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from . import models  # noqa: F401  (registra as tabelas)
from .database import Base, engine, get_db
from .routers import auth, orders, wines

# Cria as tabelas que ainda não existem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Brisa Vinícola API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wines.router)
app.include_router(auth.router)
app.include_router(orders.router)


@app.get("/")
def raiz():
    return {"mensagem": "API da Brisa Vinícola funcionando"}


@app.get("/saude")
def saude(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"banco": "conectado"}