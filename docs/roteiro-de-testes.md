# Roteiro de testes — Brisa Vinícola

Testes manuais de ponta a ponta (front-end + API + MySQL). Rode com a API em `http://127.0.0.1:8000`
e o front em `http://localhost:5173`. Marque a coluna **OK** ao executar.

Os testes automáticos da API ficam em `backend/tests` (`python -m pytest` dentro de `backend`).

## 1. Conta e login

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 1.1 | Cadastro | Entrar/Cadastrar → Criar conta com nome, e-mail e senha (6+ caracteres) | Conta criada; nome aparece no topo | ☐ |
| 1.2 | E-mail repetido | Cadastrar de novo o mesmo e-mail | Mensagem "Este e-mail já está cadastrado" | ☐ |
| 1.3 | Senhas diferentes | Cadastro com confirmação diferente | Mensagem "As senhas não coincidem" | ☐ |
| 1.4 | Login correto | Sair e entrar com e-mail e senha | Entra na conta | ☐ |
| 1.5 | Login incorreto | Entrar com senha errada | "E-mail ou senha incorretos" | ☐ |
| 1.6 | Sessão | Entrar e recarregar a página (F5) | Continua logada | ☐ |
| 1.7 | Sair | Menu do usuário → Sair | Volta ao estado deslogado | ☐ |

## 2. Catálogo

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 2.1 | Listagem | Menu Vinhos | 12 vinhos, 9 por página, com paginação | ☐ |
| 2.2 | Filtros | Filtrar por tipo, uva e faixa de preço | Lista reflete os filtros; "Limpar" restaura | ☐ |
| 2.3 | Busca | Digitar "primitivo" na busca do topo | Mostra o vinho correspondente | ☐ |
| 2.4 | Ordenação | Ordenar por menor e maior preço | Preços em ordem | ☐ |
| 2.5 | Detalhe | Clicar em um vinho | Página com descrição, características e vinhos parecidos | ☐ |
| 2.6 | Vinho inexistente | Abrir `/vinhos/9999` | "Vinho não encontrado" | ☐ |

## 3. Quiz e conteúdo personalizado

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 3.1 | Quiz deslogada | Fazer o quiz sem login | Pede para entrar ou criar conta para ver o resultado | ☐ |
| 3.2 | Respostas preservadas | Após 3.1, criar conta | Vai para o resultado com as respostas já feitas | ☐ |
| 3.3 | Resultado | Fazer o quiz logada | Lista de vinhos com % de compatibilidade, do maior para o menor | ☐ |
| 3.4 | Perfil salvo | Sair, entrar de novo e abrir o resultado | O resultado continua lá (salvo no banco) | ☐ |
| 3.5 | Conteúdo | Menu Conteúdo Personalizado | Artigos e vinhos de acordo com o perfil; "Ler mais" abre o artigo | ☐ |
| 3.6 | Sem quiz | Entrar com uma conta nova que não fez o quiz | Convite para fazer o quiz | ☐ |

## 4. Carrinho, endereço e compra

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 4.1 | Carrinho | Adicionar 2 vinhos, alterar quantidade, remover um | Totais atualizam | ☐ |
| 4.2 | Compra sem login | Tentar finalizar deslogada | Pede login | ☐ |
| 4.3 | Endereço por CEP | Checkout → novo endereço → CEP `01001000` | Rua, bairro, cidade e UF preenchidos; cursor vai para Número | ☐ |
| 4.4 | CEP inexistente | CEP `99999999` | "CEP não encontrado"; preenchimento manual possível | ☐ |
| 4.5 | Frete | Escolher endereço de SP e de outro estado | Frete muda conforme a UF (SP = R$ 14,90) | ☐ |
| 4.6 | Pagamento PIX | Pagar com PIX e esperar | Pedido confirmado com código `BV-xxxxxx` | ☐ |
| 4.7 | Pagamento cartão | Cartão de crédito (marcar "salvar cartão"), 3x | Pedido confirmado; parcelas gravadas | ☐ |
| 4.8 | Valores | Conferir total do pedido com o carrinho | Subtotal + frete = total | ☐ |

## 5. Pedidos e conta

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 5.1 | Meus pedidos | Menu Meus Pedidos | Pedidos listados do mais novo ao mais antigo | ☐ |
| 5.2 | Acompanhar | Abrir um pedido | Status avança a cada 5 s até "Entregue" | ☐ |
| 5.3 | Endereços | Minha conta → Endereços: adicionar, editar, excluir, definir principal | Alterações persistem após recarregar | ☐ |
| 5.4 | Cartões | Minha conta → Cartões: adicionar, definir principal, excluir | Só bandeira e final aparecem | ☐ |
| 5.5 | Isolamento | Entrar com outra conta | Não vê pedidos, endereços nem cartões da primeira | ☐ |

## 6. Fale conosco

| # | Cenário | Passos | Resultado esperado | OK |
|---|---|---|---|---|
| 6.1 | Envio | Preencher e enviar o formulário | Confirmação na tela; mensagem no banco (`contact_messages`) | ☐ |

## 7. Banco de dados

| # | Cenário | Como verificar | Resultado esperado | OK |
|---|---|---|---|---|
| 7.1 | Persistência | `SELECT code, total, frete FROM orders;` | Pedidos feitos no site aparecem | ☐ |
| 7.2 | Senha protegida | `SELECT email, password_hash FROM users;` | Senhas aparecem criptografadas (bcrypt) | ☐ |
| 7.3 | Cartão protegido | `SELECT * FROM cards;` | Só bandeira e 4 últimos dígitos, nunca o número completo | ☐ |

## 8. Após o deploy

Repita os grupos 1 a 6 no endereço público do site (Vercel) com a API no Railway, e confirme também:

| # | Cenário | Resultado esperado | OK |
|---|---|---|---|
| 8.1 | Site abre pelo link público e carrega os vinhos | Catálogo aparece | ☐ |
| 8.2 | Cadastro, login e compra no site publicado | Tudo funciona como localmente | ☐ |
| 8.3 | Recarregar uma página interna (ex.: `/vinhos`) | Abre normalmente, sem erro 404 | ☐ |
| 8.4 | Console do navegador (F12) | Sem erros de CORS | ☐ |
