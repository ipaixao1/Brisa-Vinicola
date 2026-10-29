from pathlib import Path

from sqlalchemy.dialects import mysql
from sqlalchemy.schema import CreateIndex, CreateTable

from . import models  # noqa: F401  (registra as tabelas)
from .database import Base


def run():
    dialect = mysql.dialect()
    partes = []
    for table in Base.metadata.sorted_tables:
        partes.append(str(CreateTable(table).compile(dialect=dialect)).strip() + ";")
        for index in table.indexes:
            partes.append(str(CreateIndex(index).compile(dialect=dialect)).strip() + ";")

    cabecalho = (
        "-- Script gerado a partir dos modelos da API (backend/app/models.py)\n"
        "CREATE DATABASE IF NOT EXISTS brisa_vinicola\n"
        "  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n"
        "USE brisa_vinicola;\n\n"
    )
    sql = cabecalho + "\n\n".join(partes) + "\n"

    destino = Path(__file__).resolve().parents[1] / "schema_mysql.sql"
    destino.write_text(sql, encoding="utf-8")
    print(f"Script salvo em: {destino}")


if __name__ == "__main__":
    run()