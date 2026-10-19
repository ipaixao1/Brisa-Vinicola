Claro. Como a área de conteúdos já está pronta, aqui o foco é criar **uma aba de “Meus Endereços” integrada ao cadastro e ao checkout**.

Use este prompt no Figma Make:

```text
Crie uma nova aba chamada "Meus Endereços" dentro da área da conta do cliente.

O objetivo é permitir que o cliente cadastre, edite, exclua e selecione seus endereços de entrega, e que esses endereços sejam automaticamente disponibilizados no checkout.

IMPORTANTE: essa funcionalidade deve estar integrada ao fluxo de compra existente no protótipo.

━━━━━━━━━━━━━━━━━━━━━━
1. ABA "MEUS ENDEREÇOS"
━━━━━━━━━━━━━━━━━━━━━━

Adicionar dentro da área da conta do cliente uma opção:

"Meus Endereços"

Ao acessar essa aba, mostrar os endereços de entrega já cadastrados.

Cada endereço deve aparecer em um card contendo:

- nome do destinatário;
- endereço completo;
- CEP;
- cidade;
- estado;
- complemento, quando houver;
- número;
- referência, quando houver.

Cada card deve possuir as ações:

"Editar"
"Excluir"

E também uma indicação visual quando aquele for o:

"Endereço principal"

━━━━━━━━━━━━━━━━━━━━━━
2. ADICIONAR NOVO ENDEREÇO
━━━━━━━━━━━━━━━━━━━━━━

Adicionar um botão:

"+ Adicionar novo endereço"

Ao clicar, abrir um formulário para cadastro.

Campos:

- Nome do destinatário
- CEP
- Rua/Avenida
- Número
- Complemento
- Bairro
- Cidade
- Estado
- Ponto de referência

Adicionar também uma opção:

"Definir como endereço principal"

O cliente deve poder salvar o endereço.

Após salvar, o novo endereço deve aparecer imediatamente na lista de "Meus Endereços".

━━━━━━━━━━━━━━━━━━━━━━
3. EDITAR ENDEREÇO
━━━━━━━━━━━━━━━━━━━━━━

O botão "Editar" deve abrir o formulário preenchido com os dados daquele endereço.

O cliente poderá alterar qualquer informação e salvar novamente.

As alterações devem aparecer imediatamente no endereço cadastrado.

━━━━━━━━━━━━━━━━━━━━━━
4. EXCLUIR ENDEREÇO
━━━━━━━━━━━━━━━━━━━━━━

O botão "Excluir" deve solicitar confirmação antes de remover o endereço.

Exemplo:

"Tem certeza que deseja excluir este endereço?"

[Cancelar] [Excluir]

Não excluir o endereço imediatamente sem confirmação.

Se o endereço excluído for o principal, outro endereço cadastrado poderá ser definido como principal.

━━━━━━━━━━━━━━━━━━━━━━
5. ENDEREÇO PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━

O cliente pode definir um endereço como:

"Endereço principal"

Somente um endereço pode ser o principal por vez.

Se o cliente definir outro endereço como principal, o anterior deixa de ser o principal automaticamente.

O endereço principal deve ser identificado visualmente nos cards.

━━━━━━━━━━━━━━━━━━━━━━
6. INTEGRAÇÃO COM O CHECKOUT
━━━━━━━━━━━━━━━━━━━━━━

Essa é a parte MAIS IMPORTANTE.

No checkout existente, criar uma seção:

"Endereço de entrega"

O checkout deve buscar automaticamente os endereços cadastrados na aba "Meus Endereços".

O endereço principal deve aparecer selecionado automaticamente quando o cliente entrar no checkout.

Porém, o cliente deve poder escolher outro endereço cadastrado.

Exemplo:

ENDEREÇO DE ENTREGA

○ Endereço principal
Rua Exemplo, 123
Bairro — São Paulo/SP
CEP 00000-000

○ Outro endereço
Avenida Exemplo, 456
Bairro — São Paulo/SP
CEP 00000-000

[+ Adicionar novo endereço]

O cliente deve conseguir selecionar apenas UM endereço para aquela compra.

━━━━━━━━━━━━━━━━━━━━━━
7. ADICIONAR ENDEREÇO DURANTE O CHECKOUT
━━━━━━━━━━━━━━━━━━━━━━

Também deve ser possível adicionar um novo endereço diretamente pelo checkout.

Ao clicar:

"+ Adicionar novo endereço"

abrir o mesmo formulário de cadastro utilizado em "Meus Endereços".

Depois de salvar:

- o novo endereço deve ser adicionado à conta;
- deve aparecer imediatamente no checkout;
- deve ser selecionado automaticamente para aquela compra.

━━━━━━━━━━━━━━━━━━━━━━
8. FLUXO DO CHECKOUT
━━━━━━━━━━━━━━━━━━━━━━

O fluxo deve funcionar assim:

CLIENTE
↓
Carrinho
↓
Checkout
↓
"Endereço de entrega"
↓
Sistema mostra os endereços cadastrados
↓
Endereço principal vem selecionado
↓
Cliente pode escolher outro endereço
↓
Cliente confirma o endereço
↓
Continua para pagamento

O endereço escolhido deve permanecer associado ao pedido.

━━━━━━━━━━━━━━━━━━━━━━
9. ESTADO SEM ENDEREÇOS
━━━━━━━━━━━━━━━━━━━━━━

Se o cliente ainda não tiver nenhum endereço cadastrado, mostrar:

"Você ainda não possui endereços cadastrados."

E um botão:

"+ Adicionar endereço"

No checkout, se não existir endereço cadastrado, o sistema deve solicitar que o cliente cadastre um endereço antes de continuar.

━━━━━━━━━━━━━━━━━━━━━━
10. VALIDAÇÕES
━━━━━━━━━━━━━━━━━━━━━━

Adicionar validações básicas aos campos.

O checkout não deve permitir continuar sem um endereço de entrega selecionado.

O formulário não deve permitir salvar um endereço sem os campos essenciais preenchidos.

━━━━━━━━━━━━━━━━━━━━━━
11. EXPERIÊNCIA VISUAL
━━━━━━━━━━━━━━━━━━━━━━

Manter a identidade visual atual da Brisa Vinícola.

Utilizar:

- fundo grafite sólido;
- tipografia atual do protótipo;
- branco/creme para textos;
- detalhes dourados discretos;
- cards elegantes;
- bordas e divisões sutis;
- visual premium e minimalista.

Não utilizar gradientes.

Não alterar a identidade visual existente.

━━━━━━━━━━━━━━━━━━━━━━
12. COMPORTAMENTO RESPONSIVO
━━━━━━━━━━━━━━━━━━━━━━

A área de endereços deve funcionar perfeitamente em desktop e mobile.

No mobile:
- os cards devem ocupar a largura disponível;
- os botões devem permanecer fáceis de tocar;
- o formulário deve ser organizado em uma coluna;
- a seleção de endereço no checkout deve ser simples e clara.

━━━━━━━━━━━━━━━━━━━━━━
13. FUNCIONALIDADE DO PROTÓTIPO
━━━━━━━━━━━━━━━━━━━━━━

Todos os fluxos devem funcionar no protótipo:

Adicionar endereço
→ salva e exibe na lista.

Editar
→ altera o endereço existente.

Excluir
→ solicita confirmação e remove.

Definir como principal
→ altera o endereço principal.

Checkout
→ mostra os endereços cadastrados.

Selecionar endereço
→ define o endereço da compra.

Adicionar endereço no checkout
→ cadastra e seleciona o novo endereço.

O objetivo é criar uma experiência completa de gerenciamento de endereços integrada ao checkout, como em um e-commerce real.
```
