Perfeito. Então vamos ampliar o fluxo para que o e-commerce tenha **pagamento simulado, acompanhamento de pedidos e histórico de compras**, mantendo tudo integrado ao sistema de login que já criamos.

Eu colocaria este complemento no Figma Make:

---

# PAGAMENTO, PEDIDOS E ACOMPANHAMENTO DE ENTREGA

Implementar as telas e funcionalidades de **pagamento, pedidos e acompanhamento de entrega** no e-commerce.

Tudo deve continuar integrado ao sistema de autenticação, carrinho, checkout e perfil personalizado já implementados.

**Não alterar o Header e Footer globais existentes.**

---

## 1. FLUXO COMPLETO DE COMPRA

O fluxo deve funcionar assim:

```text
Vinhos
   ↓
Adicionar ao carrinho
   ↓
Carrinho
   ↓
Finalizar compra
   ↓
Login (se não estiver logado)
   ↓
Checkout
   ↓
Informar endereço
   ↓
Calcular frete
   ↓
Escolher pagamento
   ↓
Pagamento
   ↓
Pagamento confirmado
   ↓
Pedido criado
   ↓
Acompanhar pedido
```

---

# 2. TELA DE PAGAMENTO

Depois que o usuário preencher o endereço e o frete for calculado, ele poderá escolher a forma de pagamento.

Criar uma seção:

# **Forma de pagamento**

Opções:

### PIX

### Cartão de crédito

### Cartão de débito

Cada opção deve possuir um estado selecionado/não selecionado.

Utilizar o estilo visual do protótipo.

---

# 3. PAGAMENTO VIA PIX

Quando o usuário selecionar:

**PIX**

e clicar em:

**PAGAR COM PIX**

gerar uma tela de pagamento.

Mostrar:

### **Pagamento via PIX**

Exibir:

* QR Code simulado;
* código PIX copia e cola;
* botão **Copiar código**;
* valor da compra;
* contador/status do pagamento.

Exemplo:

**Aguardando pagamento...**

Criar uma simulação de processamento.

---

## 4. CONFIRMAÇÃO DO PIX

Depois que a tela de PIX for aberta, iniciar um contador de aproximadamente **10 segundos**.

Durante esse período mostrar:

**Aguardando confirmação do pagamento...**

Após aproximadamente 10 segundos:

### **Pagamento confirmado! ✓**

Mostrar uma animação/transição suave de confirmação.

Depois da confirmação:

* criar o pedido;
* registrar o pedido na conta do usuário;
* atualizar o status para **Pagamento aprovado**;
* disponibilizar o pedido na área **Meus Pedidos**.

---

# 5. IMPORTANTE — PIX É UMA SIMULAÇÃO

Como estamos criando um protótipo, o PIX deve ser **simulado**.

Não integrar um gateway de pagamento real.

O objetivo é demonstrar o fluxo:

**Gerar PIX → aguardar ~10 segundos → pagamento confirmado → pedido criado.**

---

# 6. CARTÃO DE CRÉDITO

Ao selecionar:

**Cartão de crédito**

mostrar formulário:

**Número do cartão**

**Nome impresso no cartão**

**Validade**

**CVV**

Não armazenar dados reais do cartão.

O protótipo deve utilizar dados fictícios/mockados.

---

# 7. TEMPO DE TRANSAÇÃO DO CARTÃO

Depois que o usuário clicar:

**PAGAR COM CARTÃO**

mostrar uma tela de processamento.

Exemplo:

### **Processando pagamento...**

**Estamos verificando os dados da sua transação.**

Adicionar uma animação de carregamento.

O processamento deve durar alguns segundos para simular uma transação real.

Após o período de processamento:

### **Pagamento aprovado! ✓**

Então:

→ criar o pedido
→ registrar no histórico
→ atualizar status do pedido.

---

# 8. PARCELAMENTO

No cartão de crédito, oferecer opções de parcelamento.

Exemplo:

**1x de R$ 299,90**
**2x de R$ 149,95**
**3x de R$ 99,97**
**4x de R$ 74,98**
**5x de R$ 59,98**
**6x de R$ 49,98**

As opções devem ser calculadas automaticamente de acordo com o valor total da compra.

Caso futuramente sejam configurados juros, o sistema deve conseguir refletir isso.

Por enquanto, utilizar **parcelamento sem juros** para a simulação.

Mostrar claramente:

**Até 6x sem juros**

---

# 9. CARTÃO DE DÉBITO

Para cartão de débito, mostrar:

* número do cartão;
* nome;
* validade;
* CVV.

Não oferecer parcelamento.

Depois de clicar em:

**PAGAR**

mostrar:

**Processando pagamento...**

Após alguns segundos:

**Pagamento aprovado! ✓**

---

# 10. PEDIDO CRIADO

Depois que qualquer pagamento for aprovado, criar automaticamente um pedido.

Cada pedido deve possuir:

* número do pedido;
* data;
* produtos;
* quantidades;
* subtotal;
* frete;
* valor total;
* forma de pagamento;
* status do pagamento;
* endereço de entrega;
* status da entrega.

Exemplo:

**Pedido #000128**

**10 de setembro de 2026**

**Total: R$ 249,80**

**Pagamento: PIX**

**Status: Em preparação**

---

# 11. ABA "MEUS PEDIDOS"

Adicionar uma nova área dentro da conta do usuário:

# **Meus Pedidos**

Essa área deve estar disponível somente para usuários logados.

Mostrar todos os pedidos realizados pelo usuário.

Organizar os pedidos do mais recente para o mais antigo.

---

# 12. HISTÓRICO DE PEDIDOS

Cada pedido deve mostrar um resumo:

```text
PEDIDO #000128

10/09/2026

2 produtos

Total: R$ 249,80

Pagamento: PIX

Status:
● Pagamento aprovado
● Pedido em preparação
● Enviado
● Em trânsito
● Entregue

[ ACOMPANHAR PEDIDO ]
```

O usuário pode clicar em:

**Acompanhar pedido**

para abrir os detalhes.

---

# 13. ACOMPANHAMENTO DO PEDIDO

Criar uma página:

# **Acompanhe seu pedido**

Mostrar:

**Pedido #000128**

**Previsão de entrega: 13/09/2026**

---

## STATUS DA ENTREGA

Criar uma timeline visual:

```text
✓ Pedido confirmado
        │
        ↓
✓ Pagamento aprovado
        │
        ↓
✓ Pedido preparado
        │
        ↓
● Pedido enviado
        │
        ↓
○ Em trânsito
        │
        ↓
○ Entregue
```

Utilizar #AE8648 para representar os estados concluídos/ativos.

---

# 14. ROTA DO PEDIDO EM TEMPO REAL

Criar uma área de acompanhamento visual da entrega.

Mostrar um **mapa simulado** com:

* ponto de origem;
* localização atual do pedido;
* destino;
* linha representando a rota;
* marcador do pedido;
* informações de atualização.

Exemplo:

**Seu pedido está a caminho.**

**Última atualização: há 2 minutos**

**Seu pedido está em trânsito para o endereço de entrega.**

O mapa deve ser visualmente integrado ao projeto e não parecer um mapa genérico desconectado da identidade do e-commerce.

---

# 15. SIMULAÇÃO DE MOVIMENTO

Como se trata de um protótipo, criar uma simulação de acompanhamento em tempo real.

O marcador do pedido pode mudar progressivamente de posição na rota.

Atualizar informações como:

**Pedido saiu do centro de distribuição**

↓

**Pedido está em trânsito**

↓

**Pedido chegou à sua região**

↓

**Pedido saiu para entrega**

↓

**Pedido entregue**

A localização deve ser **simulada**, não utilizar localização real do usuário.

---

# 16. ATUALIZAÇÃO DOS STATUS

Criar estados diferentes para o pedido:

### 1 — Pagamento aprovado

### 2 — Pedido confirmado

### 3 — Em preparação

### 4 — Pedido enviado

### 5 — Em trânsito

### 6 — Saiu para entrega

### 7 — Entregue

A interface deve mudar de acordo com o status atual.

---

# 17. PEDIDO ENTREGUE

Quando o pedido chegar ao status:

**Entregue**

mostrar:

### **Pedido entregue! ✓**

Mostrar a data e horário da entrega.

Também disponibilizar:

**Comprar novamente**

Esse botão deve adicionar novamente os mesmos produtos ao carrinho.

---

# 18. MEUS PEDIDOS — PEDIDOS ANTIGOS

Pedidos já entregues devem permanecer no histórico.

Exemplo:

### Pedidos anteriores

**Pedido #000105**
Entregue em 28/08/2026
R$ 189,90

**Pedido #000087**
Entregue em 14/08/2026
R$ 329,90

Cada pedido pode ser aberto para visualizar seus detalhes.

---

# 19. INTEGRAÇÃO COM O USUÁRIO

Todos os pedidos devem estar vinculados ao usuário que realizou a compra.

Usuário A:

→ vê somente seus próprios pedidos.

Usuário B:

→ vê somente os pedidos dele.

Não mostrar pedidos de outros usuários.

---

# 20. NOVA ESTRUTURA DA CONTA

Ao clicar no bonequinho quando estiver logado, disponibilizar:

**Minha Conta**

**Meus Pedidos**

**Conteúdo Personalizado**

**Minhas Preferências**

**Sair**

---

# 21. ESTRUTURA FINAL DO E-COMMERCE

O projeto agora deve possuir:

### MENU

**Início**
**Vinhos**
**Fale Conosco**
**Conteúdo Personalizado** *(somente logado)*

* Usuário
* Carrinho

### PÁGINAS

**Início**

**Vinhos**

**Fale Conosco**

**Login**

**Cadastro**

**Quiz**

**Resultado do Quiz**

**Conteúdo Personalizado**

**Carrinho**

**Checkout**

**Pagamento**

**Pedido confirmado**

**Meus Pedidos**

**Acompanhar Pedido**

**Minha Conta**

---

## 22. REGRA DE AUTENTICAÇÃO

Manter a regra:

**Usuário pode adicionar produtos ao carrinho sem login.**

**Usuário pode visualizar o carrinho sem login.**

**Usuário NÃO pode finalizar a compra sem login.**

**Usuário precisa estar autenticado para acessar:**

* checkout;
* pagamento;
* meus pedidos;
* acompanhamento de pedidos;
* conteúdo personalizado;
* preferências pessoais.

Se tentar acessar alguma dessas áreas sem login:

→ direcionar para Login.

Depois do login:

→ retornar para a página que o usuário estava tentando acessar.

---

## 23. EXPERIÊNCIA FINAL

O objetivo é que o protótipo demonstre uma experiência completa de e-commerce:

**descobrir → fazer quiz → receber recomendações → escolher vinho → adicionar ao carrinho → fazer login → informar endereço → calcular frete → escolher pagamento → pagar → receber confirmação → acompanhar entrega → consultar histórico → comprar novamente.**

Tudo deve permanecer visualmente consistente com o protótipo já desenvolvido.

**Não alterar a identidade visual existente, o Header ou o Footer.**
