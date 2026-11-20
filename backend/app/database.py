import ssl

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings

if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif settings.db_ssl:
    # TLS verificando o certificado do servidor (usa as autoridades do sistema)
    connect_args = {"ssl": ssl.create_default_context()}
else:
    connect_args = {}

# pool_pre_ping/pool_recycle: bancos na nuvem fecham conexões ociosas
engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=280,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


# Fornece uma sessão do banco para cada requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()