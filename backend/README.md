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
| `GET /addresses` | Endereços do usuário logado |
| `POST /addresses` | Cadastra endereço (o primeiro vira principal) |
| `PUT /addresses/{id}` | Edita endereço |
| `DELETE /addresses/{id}` | Exclui endereço |
| `POST /addresses/{id}/primary` | Define endereço principal |
| `GET /cards` | Cartões salvos do usuário logado (só bandeira e 4 últimos dígitos) |
| `POST /cards` | Salva cartão (o número completo não é armazenado) |
| `DELETE /cards/{id}` | Exclui cartão |
| `POST /cards/{id}/primary` | Define cartão principal |
| `PUT /users/me` | Atualiza nome e e-mail do usuário logado |
| `PUT /users/me/password` | Troca a senha |
| `DELETE /users/me` | Exclui a conta (anonimiza os dados e mantém os pedidos) |
| `POST /admin/wines` | (admin) Cadastra vinho |
| `PUT /admin/wines/{id}` | (admin) Edita vinho |
| `DELETE /admin/wines/{id}` | (admin) Exclui vinho (só se nunca foi vendido) |
| `POST /contact` | Envia mensagem do Fale Conosco (público) |
| `GET /admin/contact` | (admin) Lista mensagens (filtro `answered=true/false`) |
| `PUT /admin/contact/{id}` | (admin) Marca como respondida |
| `DELETE /admin/contact/{id}` | (admin) Exclui mensagem |

## Primeiro administrador

Quem pode cadastrar vinhos e ver as mensagens do Fale Conosco é o usuário com `is_admin = 1`. O primeiro admin é criado direto no banco, depois de cadastrar a conta:

```sql
UPDATE users SET is_admin = 1 WHERE email = 'seu-email@exemplo.com';
```