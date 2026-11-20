# Deploy — Brisa Vinícola

O projeto está publicado na internet, dividido em três partes:

| Parte | Serviço | Endereço |
|---|---|---|
| Site (React + Vite) | Vercel | https://brisa-vinicola.vercel.app |
| API (FastAPI) | Render | https://brisa-vinicola-api.onrender.com (documentação em `/docs`) |
| Banco de dados (MySQL) | TiDB Cloud (Starter, grátis) | acessado só pela API |

O deploy é automático: cada push na branch `main` publica de novo o site (Vercel) e a API (Render).

## Como as partes se conectam

```
Navegador -> Vercel (site) -> Render (API FastAPI) -> TiDB Cloud (MySQL)
```

- O site descobre onde está a API pela variável `VITE_API_URL`.
- A API só aceita pedidos vindos dos endereços listados em `CORS_ORIGINS`.
- A API conecta ao banco pela `DATABASE_URL`, com conexão segura (SSL) ligada por `DB_SSL=true`.
- Ao iniciar, a API cria as tabelas e carrega os 12 vinhos iniciais (o seed ignora o que já existe, então é seguro repetir).

## Variáveis de ambiente

**Render (serviço da API)**

| Variável | Valor |
|---|---|
| `PYTHON_VERSION` | `3.12.8` |
| `DB_SSL` | `true` |
| `DATABASE_URL` | `mysql+pymysql://USUARIO:SENHA@HOST:4000/brisa_vinicola` (dados da janela **Connect** do TiDB) |
| `SECRET_KEY` | chave aleatória longa, gerada só para produção (nunca colocar no Git) |
| `CORS_ORIGINS` | endereços do site, separados por vírgula, sem espaços |

- Configuração do serviço: Root Directory `backend`, Build Command `pip install -r requirements.txt`, Start Command `python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT`, plano **Free**, região Virginia.
- Se a senha do banco tiver caracteres especiais (`@`, `:`, `/`, `#`, `?`, `%`), eles precisam ser convertidos na `DATABASE_URL` (por exemplo, `@` vira `%40`).
- Gerar uma `SECRET_KEY` nova: `python -c "import secrets; print(secrets.token_urlsafe(48))"`.

**Vercel (projeto do site, Root Directory `frontend`)**

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://brisa-vinicola-api.onrender.com` (sem `/` no final) |

Criar com o tipo **Config** (o valor é um endereço público e começa com `VITE_`, então vai para o navegador de qualquer forma). O arquivo `frontend/vercel.json` faz as páginas internas (como `/vinhos`) abrirem normalmente ao atualizar a página.

## Passo a passo para refazer o deploy

1. **TiDB Cloud** (https://tidbcloud.com): criar uma instância **Starter**, modo **MySQL Compatible**, provedor AWS, região **N. Virginia (us-east-1)**, spending limit `0` (grátis).
2. Em **Connect**, gerar a senha e guardar (ela só aparece uma vez). Anotar Host, Porta (`4000`) e Usuário (termina em `.root`).
3. No **SQL Editor**, criar o banco: `CREATE DATABASE IF NOT EXISTS brisa_vinicola;`
4. **Render** (https://render.com): **New + > Web Service**, conectar o repositório, preencher os campos e as variáveis da tabela acima (digitar o nome de cada variável à mão) e criar o serviço.
5. Esperar o deploy ficar **Live** e abrir `https://SEU-SERVICO.onrender.com/wines`: deve listar os 12 vinhos.
6. **Vercel**: importar o repositório, Root Directory `frontend`, preset Vite, variável `VITE_API_URL` com o endereço da API.
7. Na Vercel, em Settings > Git, ativar **Git Large File Storage (LFS)**: as imagens e os vídeos do site usam Git LFS.
8. Colocar o endereço final do site em `CORS_ORIGINS` no Render e salvar (o Render faz o deploy de novo).
9. Se mudar a `VITE_API_URL`, fazer **Redeploy** na Vercel: as variáveis `VITE_` só entram no site na hora do build.

## Problemas conhecidos e soluções

- **Primeiro acesso demora até 1 minuto:** o plano grátis do Render coloca a API para dormir após cerca de 15 minutos sem uso. Antes de uma apresentação, abra o site e a página de Vinhos uma vez para acordá-la.
- **Lista de vinhos vazia e erro de CORS no console:** o endereço do site não está em `CORS_ORIGINS`. Cada deploy da Vercel tem um endereço próprio; use o endereço de produção (`brisa-vinicola.vercel.app`) ou o da branch.
- **Site continua chamando a API antiga:** a `VITE_API_URL` foi trocada, mas faltou o Redeploy na Vercel.
- **Erro de conexão com o banco nos logs do Render:** conferir `DB_SSL=true`, o usuário completo (com o prefixo antes de `.root`), a senha e o nome do banco `brisa_vinicola` na `DATABASE_URL`.
- **Variável não é lida:** o nome tem um caractere invisível por ter sido colado. Apagar e recriar digitando o nome.
- **Imagens ou vídeos não aparecem na Vercel:** o Git LFS está desativado nas configurações do projeto.
- **Limites do plano grátis do TiDB:** 5 GiB de armazenamento e 50 milhões de Request Units por mês, mais do que suficiente para este projeto.

## Testes antes de publicar

- Testes automatizados da API: `cd backend` e `python -m pytest` (68 testes).
- Roteiro de testes manuais: `docs/roteiro-de-testes.md`.
- Em produção, conferir: cadastro, login, quiz, conteúdo personalizado, carrinho, endereço com busca por CEP, pedido e "Meus pedidos".
