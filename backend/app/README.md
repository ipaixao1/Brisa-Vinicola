# Brisa Vinícola: API (back-end)

API em Python com FastAPI e SQLAlchemy.

## Como rodar

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000
- Documentação e testes: http://127.0.0.1:8000/docs

## Configuração

Crie um arquivo `.env` na pasta `backend` (não vai pro Git):

```
SECRET_KEY=uma-chave-secreta-longa
# Opcional. Por padrão usa SQLite local (brisa.db). Para MySQL:
# DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/brisa_vinicola
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `GET /wines` | Lista com busca, filtros (`q`, `type`, `grape`, `min_price`, `max_price`), ordenação (`sort`) e paginação |
| `GET /wines/filters` | Tipos e uvas disponíveis |
| `GET /wines/{id}` | Detalhe de um vinho |
| `GET /wines/{id}/related` | Vinhos parecidos |
| `POST /auth/register` | Cadastro (devolve token) |
| `POST /auth/login` | Login (devolve token) |
| `GET /auth/me` | Dados do usuário logado |
| `POST /orders` | Cria pedido (logado) |
| `GET /orders` | Pedidos do usuário logado |
| `GET /orders/{id}` | Detalhe de um pedido |
| `POST /orders/{id}/advance` | Avança o status da entrega (simulação) |