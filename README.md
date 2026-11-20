# Brisa Vinícola

E-commerce de vinhos com **quiz de perfil**, **recomendações** e **conteúdo personalizado** (vídeos do YouTube) para cada tipo de apreciador. Trabalho de finalização das matérias de **POO** e **Gerenciamento de Banco de Dados**.

**Site publicado:** https://brisa-vinicola.vercel.app
**API publicada:** https://brisa-vinicola-api.onrender.com (documentação interativa em `/docs`)

> A API roda no plano gratuito do Render e "dorme" depois de uns 15 minutos sem acesso. O primeiro acesso depois disso pode levar cerca de 1 minuto; os seguintes são rápidos.

## O que o site faz

- **Catálogo** com busca, filtros (tipo, uva, preço), ordenação, paginação, detalhe do vinho e vinhos parecidos.
- **Conta**: cadastro, login (JWT), perfil, troca de senha e exclusão da conta.
- **Quiz** de 5 perguntas (ocasião, sabor, comida, experiência e faixa de preço) que descobre o perfil do usuário e calcula a **compatibilidade (%)** de cada vinho. O resultado fica salvo na conta.
- **Conteúdo personalizado**: cada perfil recebe uma trilha própria (vídeo em destaque e conteúdos por nível, comida e ocasião). Cada conteúdo leva a um vídeo no YouTube, e os vinhos relacionados podem ser adicionados ao **carrinho** na própria página.
- **Compra**: carrinho, endereço com busca por CEP, frete por estado, pagamento (PIX ou cartão, simulado), confirmação e acompanhamento do pedido.
- **Minha conta**: pedidos, endereços e cartões (só bandeira e 4 últimos dígitos são guardados).
- **Fale Conosco** e rotas de **administração** na API (cadastro de vinhos e leitura das mensagens).
- Layout **responsivo** (celular, tablet e computador), transições suaves ao rolar e seta de voltar para a Home nas telas internas.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | React 19, TypeScript, Vite, React Router, Tailwind CSS |
| Back-end | Python, FastAPI, SQLAlchemy 2, Pydantic, JWT, bcrypt |
| Banco de dados | MySQL (TiDB Cloud em produção) · SQLite no desenvolvimento |
| Testes | pytest (68 testes automatizados da API) |
| Hospedagem | Vercel (site) · Render (API) · TiDB Cloud (banco) |

## Estrutura do repositório

```
Brisa-Vinicola/
├── frontend/   Site em React (páginas, componentes, contextos, hooks)
├── backend/    API FastAPI (rotas, modelos, recomendações, testes)
├── database/   DER, dicionário de dados, scripts SQL e modelo do Workbench
└── docs/       Roteiro de testes e guia de deploy
```

## Como rodar no seu computador

Você precisa de **Python 3.12+**, **Node.js 20+** e **Git LFS** (as imagens e os vídeos do site usam Git LFS).

```powershell
git lfs install
git clone https://github.com/ipaixao1/Brisa-Vinicola.git
cd Brisa-Vinicola
```

**1. API** (terminal 1)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload
```

A API abre em http://127.0.0.1:8000 e a documentação em http://127.0.0.1:8000/docs. Sem configuração extra ela usa um banco SQLite local (`brisa.db`). Para usar MySQL, veja `backend/README.md`.

**2. Site** (terminal 2)

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

O site abre em http://localhost:5173 e fala com a API em `http://127.0.0.1:8000`. Para apontar para outra API, crie `frontend/.env` com `VITE_API_URL=https://endereco-da-api`.

## Testes

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
python -m pytest
```

Os testes usam um banco SQLite temporário e não tocam no MySQL. O roteiro de testes manuais do site completo está em [`docs/roteiro-de-testes.md`](docs/roteiro-de-testes.md).

## Banco de dados

O modelo (DER), o dicionário de dados e os scripts SQL estão em [`database/`](database/README.md). Tabelas: `users`, `wines`, `orders`, `order_items`, `addresses`, `cards` e `contact_messages`.

## Deploy

O site, a API e o banco estão publicados em serviços gratuitos e o deploy é automático a cada push na branch `main`. O passo a passo completo, com as variáveis de ambiente e os problemas conhecidos, está em [`docs/deploy.md`](docs/deploy.md).
