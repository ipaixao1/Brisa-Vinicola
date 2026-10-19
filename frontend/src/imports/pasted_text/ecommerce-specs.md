Perfeito. Agora vamos fechar a estrutura principal do e-commerce: **Início → Vinhos → Fale Conosco → Conteúdo Personalizado**, além do **Carrinho integrado ao login**.

Para o Figma Make, eu passaria um prompt único assim:

---

# IMPLEMENTAÇÃO — FALE CONOSCO, MENU, CARRINHO E FINALIZAÇÃO DA COMPRA

Continuar o desenvolvimento do e-commerce de vinhos utilizando **toda a estrutura e identidade visual já criada no protótipo**.

**Não alterar o design existente do Header e Footer.**

Todas as novas páginas devem utilizar os mesmos componentes globais.

---

## 1. MENU PRINCIPAL — NOMES EM PORTUGUÊS

Atualizar o menu principal para utilizar os seguintes nomes:

**Início**
**Vinhos**
**Fale Conosco**

Não utilizar mais:

* Home
* Products
* About Us
* Contact
* outras nomenclaturas em inglês.

O menu deve permanecer em português em todo o projeto.

### Usuário não logado

Exibir:

**Início | Vinhos | Fale Conosco**

* ícone de usuário
* ícone do carrinho

### Usuário logado

Exibir:

**Início | Vinhos | Fale Conosco | Conteúdo Personalizado**

* ícone de usuário
* ícone do carrinho

A opção **Conteúdo Personalizado** deve aparecer somente quando o usuário estiver autenticado.

---

# 2. PÁGINA "FALE CONOSCO"

Substituir completamente a antiga página **“About Us”** por uma página chamada:

# **Fale Conosco**

A página deve manter a identidade visual do e-commerce:

* fundo escuro;
* #AE8648 como cor principal;
* Pinyon Script nos títulos;
* Poppins nos textos e elementos gerais;
* Open Sans nos títulos de categorias;
* estética sofisticada e premium.

Utilizar o mesmo Header e Footer global.

---

## 3. ESTRUTURA DA PÁGINA FALE CONOSCO

Criar uma página organizada em seções.

### Cabeçalho

Título:

**Fale Conosco**

Subtítulo:

**Estamos aqui para ajudar você.**

Criar uma apresentação curta convidando o cliente a entrar em contato.

---

# 4. INFORMAÇÕES DE CONTATO

Criar uma seção com as principais formas de contato da loja.

Exibir:

### WhatsApp

Número da loja.

Adicionar um botão:

**Falar pelo WhatsApp**

Esse botão deve ser funcional e direcionar para o WhatsApp da loja.

Utilizar o formato de link:

`https://wa.me/NUMERO`

Substituir `NUMERO` pelo número configurado posteriormente.

---

### E-mail

Exibir o e-mail oficial da loja.

O endereço deve ser clicável e abrir o aplicativo de e-mail do usuário.

---

### Telefone

Exibir o telefone da loja, caso disponível.

---

### Horário de atendimento

Adicionar o horário de funcionamento/atendimento.

---

### Redes sociais

Adicionar os links das redes sociais oficiais da loja.

Manter o mesmo estilo minimalista utilizado no Footer.

---

# 5. FORMULÁRIO DE CONTATO

Criar uma seção:

## **Envie sua dúvida**

Criar um formulário elegante contendo:

**Nome**

**E-mail**

**Assunto**

**Mensagem**

Botão:

**ENVIAR MENSAGEM**

Os campos devem seguir a identidade visual do projeto.

Não utilizar componentes brancos genéricos.

Utilizar:

* fundo escuro;
* bordas discretas;
* detalhes #AE8648;
* Poppins;
* estados de foco elegantes.

Ao enviar:

mostrar uma mensagem de confirmação:

**Mensagem enviada com sucesso!**

**Nossa equipe entrará em contato com você em breve.**

---

# 6. DÚVIDAS FREQUENTES — FAQ

Adicionar uma seção:

# **Dúvidas frequentes**

Utilizar um sistema de acordeão.

Cada pergunta pode ser expandida ao clicar.

Exemplos:

**Como faço para realizar uma compra?**

**Quais são as formas de pagamento?**

**Vocês entregam em todo o Brasil?**

**Qual é o prazo de entrega?**

**Posso acompanhar meu pedido?**

**Posso cancelar ou alterar meu pedido?**

**Como funciona a troca ou devolução?**

**Como posso entrar em contato com a loja?**

Quando o usuário clicar em uma pergunta:

→ abrir a resposta abaixo dela.

Quando clicar novamente:

→ fechar a resposta.

O efeito deve ser suave.

---

# 7. WHATSAPP EM DESTAQUE

Criar também uma chamada visual próxima ao final da página:

### **Ainda ficou com alguma dúvida?**

**Nossa equipe está pronta para ajudar.**

Botão:

**Falar com a gente pelo WhatsApp**

Esse botão deve direcionar diretamente para o WhatsApp da loja.

O botão deve utilizar **#AE8648** como destaque.

---

# 8. CARRINHO

Implementar agora o **Carrinho de compras**.

O ícone de carrinho já existente no Header deve ser funcional.

Ao clicar:

**→ abrir a página do Carrinho.**

---

# 9. PÁGINA DO CARRINHO

Criar uma página:

# **Meu Carrinho**

O usuário deve conseguir visualizar todos os produtos adicionados.

Cada item deve mostrar:

* imagem do vinho;
* nome;
* tipo;
* uva;
* preço unitário;
* quantidade;
* subtotal;
* botão para remover.

---

## CONTROLE DE QUANTIDADE

Permitir:

**− 1 +**

O usuário pode aumentar ou diminuir a quantidade.

O subtotal deve ser atualizado automaticamente.

Exemplo:

```text
Vinho Syrah
R$ 89,90

−   2   +

Subtotal: R$ 179,80
```

---

# 10. RESUMO DA COMPRA

No lado direito, no desktop, criar:

## **Resumo do pedido**

Mostrar:

**Subtotal**
R$ XXX,XX

**Frete**
R$ XX,XX

**Total**
**R$ XXX,XX**

Botão:

**FINALIZAR COMPRA**

---

# 11. CARRINHO VAZIO

Se não houver produtos:

Mostrar uma composição elegante:

### **Seu carrinho está vazio**

**Que tal encontrar um vinho especial para você?**

Botão:

**VER VINHOS**

O botão deve direcionar para:

**Vinhos**

---

# 12. PRODUTOS → CARRINHO

Na página de Vinhos, cada produto deve possuir um botão:

**Adicionar ao carrinho**

Ao clicar:

1. adicionar o produto ao carrinho;
2. atualizar o contador do ícone do carrinho;
3. manter o usuário na página;
4. mostrar uma confirmação discreta.

Exemplo:

**Vinho adicionado ao carrinho.**

---

# 13. CONTADOR DO CARRINHO

O ícone do carrinho no Header deve apresentar um pequeno contador com a quantidade de itens.

Exemplo:

🛒 **2**

Esse contador deve ser atualizado automaticamente quando:

* adicionar produto;
* remover produto;
* aumentar quantidade;
* diminuir quantidade.

O carrinho deve persistir durante a navegação entre páginas.

---

# 14. REGRA DE LOGIN PARA FINALIZAR A COMPRA

Existe uma regra fundamental:

## O usuário NÃO pode finalizar a compra sem estar logado.

Ele pode:

* navegar pelos produtos;
* adicionar produtos ao carrinho;
* visualizar o carrinho;
* alterar quantidades;
* remover produtos;

**sem estar autenticado.**

Porém, quando clicar:

**FINALIZAR COMPRA**

verificar se o usuário está logado.

---

## SE NÃO ESTIVER LOGADO

Não permitir acesso ao checkout.

Mostrar uma tela/modal:

# **Entre para continuar**

Texto:

**Para finalizar sua compra, você precisa entrar na sua conta.**

Botões:

**ENTRAR**

**CRIAR CONTA**

---

# 15. REDIRECIONAMENTO DO CARRINHO

Se o usuário clicar em **ENTRAR**:

→ direcionar para Login.

Depois que realizar o login:

→ retornar automaticamente para o **Carrinho/Checkout**.

Não fazer o usuário procurar novamente os produtos.

O carrinho deve continuar exatamente como estava antes do login.

---

# 16. USUÁRIO LOGADO

Se o usuário estiver autenticado e clicar:

**FINALIZAR COMPRA**

→ permitir acesso ao checkout.

Criar a próxima etapa:

**Checkout**

com as informações necessárias para finalizar o pedido.

---

# 17. CHECKOUT

Criar uma estrutura de checkout elegante e simples.

Seções:

### Dados do cliente

Nome
E-mail
Telefone

### Endereço de entrega

CEP
Rua
Número
Complemento
Bairro
Cidade
Estado

### Forma de pagamento

Criar opções de pagamento disponíveis para o projeto.

### Resumo do pedido

Mostrar:

* produtos;
* quantidades;
* subtotal;
* frete;
* total.

Botão:

**FINALIZAR PEDIDO**

---

# 18. CONFIRMAÇÃO DO PEDIDO

Depois da finalização:

mostrar:

# **Pedido realizado com sucesso!**

Texto:

**Obrigado pela sua compra. Seu pedido foi recebido e está sendo preparado com todo cuidado.**

Mostrar:

**Número do pedido**

**Resumo da compra**

**Valor total**

Botão:

**CONTINUAR COMPRANDO**

→ voltar para **Vinhos**.

---

# 19. RELAÇÃO COM A CONTA DO USUÁRIO

Os pedidos realizados devem ficar associados ao usuário autenticado.

Na área **Minha Conta**, permitir futuramente visualizar:

**Meus pedidos**

**Meus dados**

**Minhas preferências**

**Meus vinhos recomendados**

As respostas do Quiz continuam vinculadas ao perfil do usuário.

---

# 20. INTEGRAÇÃO COM A PERSONALIZAÇÃO

Manter a lógica criada anteriormente.

O sistema deve continuar utilizando as respostas do Quiz para:

* recomendar vinhos;
* determinar preferências;
* recomendar conteúdos;
* alimentar a página **Conteúdo Personalizado**.

Depois que o usuário estiver logado, o menu deve mostrar:

**Conteúdo Personalizado**

E essa página deve utilizar o perfil criado através do Quiz.

---

# 21. FLUXO COMPLETO DO E-COMMERCE

Implementar o seguinte fluxo:

```text
                         INÍCIO
                           │
             ┌─────────────┼─────────────┐
             │             │             │
           VINHOS    FALE CONOSCO    FAZER QUIZ
             │                           │
             │                           ▼
             │                    RESPONDE QUIZ
             │                           │
             │                    ┌──────┴──────┐
             │                    │             │
             │                 LOGADO       NÃO LOGADO
             │                    │             │
             │                    │          LOGIN
             │                    │             │
             │                    └──────┬──────┘
             │                           │
             │                    RESULTADO PERSONALIZADO
             │
             ▼
       ADICIONAR AO CARRINHO
             │
             ▼
          CARRINHO
             │
             ▼
      FINALIZAR COMPRA
             │
       ┌─────┴─────┐
       │           │
    LOGADO      NÃO LOGADO
       │           │
       │         LOGIN
       │           │
       └─────┬─────┘
             │
             ▼
          CHECKOUT
             │
             ▼
       PEDIDO REALIZADO
```

---

# 22. ESTRUTURA FINAL DO MENU

### Usuário não logado

**Início | Vinhos | Fale Conosco**

`👤` `🛒`

### Usuário logado

**Início | Vinhos | Fale Conosco | Conteúdo Personalizado**

`👤` `🛒`

Manter o menu visualmente igual ao protótipo.

Apenas adicionar/remover a opção de conteúdo personalizado conforme o estado de autenticação.

---

# 23. COMPONENTES GLOBAIS

Manter obrigatoriamente:

**Header Global**

**Footer Global**

O Header e Footer devem aparecer em todas as páginas.

Não duplicar componentes.

Não criar versões diferentes para cada tela.

Toda alteração futura no Header ou Footer deve refletir em todas as páginas.

---

# 24. REGRA DE DESIGN

Todas as novas telas devem parecer parte do mesmo produto.

Manter rigorosamente:

**#AE8648** — bege/dourado principal

**Fundo escuro suavizado** — nunca preto puro

**Pinyon Script** — títulos

**Poppins** — menu e textos

**Open Sans** — títulos de categorias

Manter a estética:

**luxuosa + sofisticada + elegante + moderna + vinho premium**

Não utilizar layouts genéricos de loja virtual.

Não utilizar componentes padrão que quebrem a identidade visual.

**Priorizar consistência com as telas que já foram desenvolvidas.**
