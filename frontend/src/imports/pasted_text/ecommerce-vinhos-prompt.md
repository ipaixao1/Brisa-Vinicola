Perfeito. Para essa página, eu usaria a **estrutura da página de vinhos da Famiglia Maioli como referência funcional e de organização**, mas sem copiar a identidade visual dela. A página original trabalha com filtros por preço, tipo e uva e uma grade de produtos; isso encaixa exatamente no que você quer. ([Socializy][1]) [Página de vinhos da Famiglia Maioli](https://famigliamaioli.com/categoria-produto/vinhos/?utm_source=chatgpt.com)

O prompt para o Make pode ficar assim:

---

# PÁGINA — TODOS OS VINHOS / LOJA

Criar uma nova página do e-commerce chamada **“Vinhos”**, destinada a apresentar **todos os produtos da loja**.

Use como **referência de estrutura, organização e experiência de navegação** a página de vinhos da Famiglia Maioli:

[https://famigliamaioli.com/categoria-produto/vinhos/](https://famigliamaioli.com/categoria-produto/vinhos/)

**IMPORTANTE:** utilizar a referência apenas para a estrutura funcional da página. **NÃO copiar a identidade visual, cores, tipografia ou aparência geral do site de referência.**

A identidade visual deve continuar sendo **exatamente a do nosso protótipo já criado.**

---

## 1. IDENTIDADE VISUAL — MANTER A DO PROTÓTIPO

Não modificar a identidade visual já estabelecida.

Utilizar:

### Cor principal

**#AE8648**

Essa é a cor bege/dourada principal do projeto.

### Fundo

Utilizar o mesmo fundo escuro já estabelecido no protótipo.

**NÃO utilizar preto puro #000000.**

O fundo deve continuar sendo um preto sofisticado e levemente suavizado.

### Tipografia

**Títulos principais:**
Pinyon Script

**Menu, textos, botões e informações gerais:**
Poppins

**Títulos de categorias:**
Open Sans

Não substituir essas fontes.

---

# 2. MENU / HEADER

O **mesmo menu já criado no protótipo deve permanecer nessa página.**

Não criar outro header.

Não alterar:

* logo;
* tamanho da logo;
* posicionamento;
* menu;
* espaçamento;
* tipografia;
* cores;
* ícones;
* comportamento.

O header deve ser o **mesmo componente global utilizado na página inicial e nas demais páginas.**

---

# 3. TÍTULO DA PÁGINA

Logo abaixo do menu, criar uma área de introdução para a página.

Utilizar um título grande:

**VINHOS**

O título deve utilizar **Pinyon Script**, seguindo a estética sofisticada da página inicial.

Adicionar uma pequena descrição abaixo do título, apresentando a seleção de vinhos.

O texto deve ser discreto e elegante, utilizando Poppins.

A composição deve manter bastante espaço negativo e seguir a estética premium do protótipo.

---

# 4. CATEGORIAS PRINCIPAIS

Antes da listagem dos produtos, criar uma navegação por categorias.

As categorias devem ser:

**TODOS**
**TINTOS**
**BRANCOS**
**ESPUMANTES**
**ROSÉ**

Essas categorias devem funcionar como filtros.

### Comportamento

Ao selecionar:

**TODOS:** mostrar todos os vinhos.

**TINTOS:** mostrar somente vinhos tintos.

**BRANCOS:** mostrar somente vinhos brancos.

**ESPUMANTES:** mostrar somente espumantes.

**ROSÉ:** mostrar somente vinhos rosé.

A categoria selecionada deve possuir um estado visual de destaque utilizando **#AE8648**.

As categorias não devem parecer botões genéricos de formulário.

Devem ter uma aparência sofisticada e minimalista, integrada ao restante do projeto.

---

# 5. BARRA DE PESQUISA

Adicionar uma **barra de pesquisa para produtos**.

Ela deve permitir que o usuário procure vinhos pelo nome.

Exemplo:

**“Buscar vinhos...”**

Adicionar um ícone de pesquisa.

A barra deve seguir a identidade visual do protótipo:

* fundo escuro;
* borda discreta;
* detalhes em #AE8648;
* Poppins;
* aparência elegante;
* sem aparência de componente padrão de Bootstrap.

### Funcionamento

Quando o usuário digitar:

> Syrah

mostrar somente produtos relacionados a Syrah.

Se digitar:

> Marselan

mostrar produtos relacionados.

A pesquisa deve funcionar juntamente com os filtros.

Por exemplo:

**Categoria: Tinto + pesquisa: Syrah**

deve mostrar somente os tintos relacionados a Syrah.

---

# 6. SISTEMA DE FILTROS

Criar um sistema completo de filtros.

Os filtros devem incluir:

### FILTRO POR PREÇO

Permitir definir:

**Preço mínimo**

e

**Preço máximo**

Adicionar botão:

**FILTRAR**

O filtro deve atualizar os produtos exibidos.

---

### FILTRO POR TIPO

Opções:

* Tinto
* Branco
* Espumante
* Rosé

O usuário pode selecionar uma ou mais opções.

---

### FILTRO POR UVA

Criar uma lista de uvas disponíveis de acordo com os produtos cadastrados.

Exemplos:

* Syrah
* Marselan
* Sauvignon Blanc
* Moscato
* Bordô
* Blend

O filtro deve ser dinâmico.

Se futuramente uma nova uva for cadastrada, ela deve poder aparecer no filtro.

---

# 7. LAYOUT DOS FILTROS

No desktop, seguir a lógica da referência da Famiglia Maioli:

**Filtros em uma área lateral + produtos em uma grade.**

Estrutura:

```text
┌───────────────────────────────────────────────────────────┐
│                       VINHOS                              │
│              descrição da coleção                        │
│                                                           │
│  TODOS   TINTOS   BRANCOS   ESPUMANTES   ROSÉ             │
│                                                           │
├──────────────┬────────────────────────────────────────────┤
│              │                                            │
│   FILTROS    │             PRODUTOS                       │
│              │                                            │
│ Preço        │   ┌──────┐ ┌──────┐ ┌──────┐              │
│              │   │      │ │      │ │      │              │
│ R$ ___       │   │ 🍷   │ │ 🍷   │ │ 🍷   │              │
│ R$ ___       │   │      │ │      │ │      │              │
│              │   └──────┘ └──────┘ └──────┘              │
│ Tipo         │                                            │
│ □ Tinto      │   ┌──────┐ ┌──────┐ ┌──────┐              │
│ □ Branco     │   │      │ │      │ │      │              │
│ □ Espumante  │   │ 🍷   │ │ 🍷   │ │ 🍷   │              │
│ □ Rosé       │   │      │ │      │ │      │              │
│              │   └──────┘ └──────┘ └──────┘              │
│ Uva          │                                            │
│ □ Syrah      │                                            │
│ □ Marselan   │                                            │
│ □ Moscato    │                                            │
│ □ etc.       │                                            │
└──────────────┴────────────────────────────────────────────┘
```

Não precisa copiar exatamente esse desenho ASCII. Ele serve apenas para explicar a estrutura.

---

# 8. PRODUTOS

Criar uma grade elegante com todos os vinhos cadastrados.

Cada produto deve apresentar:

* imagem da garrafa;
* nome do vinho;
* tipo;
* uva;
* preço;
* preço promocional, quando houver;
* indicação de desconto, quando houver;
* botão **Adicionar ao carrinho**.

A informação deve ser organizada de forma limpa.

Não sobrecarregar os cards.

---

# 9. CARDS DOS VINHOS

Os cards devem seguir **a estética do protótipo**, e não a aparência da Famiglia Maioli.

Fundo integrado ao fundo da página.

Evitar cards brancos.

Evitar bordas pesadas.

Evitar sombras exageradas.

Utilizar #AE8648 nos elementos de destaque.

As garrafas devem possuir bastante destaque visual.

### HOVER DOS PRODUTOS

Manter o mesmo conceito de interação que definimos anteriormente.

Quando o mouse passar sobre um vinho:

* a garrafa aumenta levemente;
* a imagem pode ultrapassar visualmente a área do card;
* utilizar `overflow: visible` quando necessário;
* elevar a imagem com `z-index`;
* criar sensação de profundidade;
* aplicar uma transição suave de aproximadamente 300–500ms;
* não deslocar os outros produtos.

A garrafa deve parecer **sair do card**, em vez de simplesmente aplicar um zoom comum.

---

# 10. PAGINAÇÃO

Caso exista uma quantidade grande de produtos, implementar paginação ou carregamento progressivo.

Mostrar uma indicação como:

**“Mostrando X de Y vinhos”**

Essa informação deve ser atualizada de acordo com os filtros aplicados.

Exemplo:

**“Mostrando 8 de 13 vinhos”**

Não deixar produtos simplesmente desaparecerem sem indicar que um filtro foi aplicado.

---

# 11. ORDENAÇÃO

Adicionar uma opção discreta para ordenar os produtos.

Opções:

* Mais recentes
* Menor preço
* Maior preço
* Mais vendidos
* Nome: A–Z

Essa opção deve ficar próxima à área superior da grade de produtos.

---

# 12. RESPONSIVIDADE

A página deve ser totalmente responsiva.

### Desktop

Manter:

**filtros lateralmente + grade de produtos.**

### Tablet

Adaptar a quantidade de produtos por linha e reduzir a largura da área de filtros.

### Mobile

Transformar os filtros laterais em um botão:

**FILTRAR VINHOS**

Ao clicar, abrir um painel/modal contendo:

* preço;
* tipo;
* uva.

A pesquisa deve continuar facilmente acessível.

As categorias:

**TODOS | TINTOS | BRANCOS | ESPUMANTES | ROSÉ**

podem ficar em uma linha horizontal com scroll quando necessário.

Não diminuir excessivamente os textos para tentar colocar tudo na mesma linha.

---

# 13. MENU E RODAPÉ — OBRIGATÓRIOS

**Não esquecer o Header e Footer já criados.**

Essa página deve utilizar exatamente os mesmos componentes globais.

Estrutura:

```text
HEADER GLOBAL
      ↓
TÍTULO "VINHOS"
      ↓
DESCRIÇÃO
      ↓
CATEGORIAS
      ↓
BARRA DE PESQUISA
      ↓
FILTROS + PRODUTOS
      ↓
PAGINAÇÃO
      ↓
FOOTER GLOBAL
```

O **Footer deve ser exatamente o mesmo que já criamos**, incluindo:

* benefícios;
* redes sociais;
* formas de pagamento;
* links;
* copyright.

Não criar uma versão diferente do rodapé.

---

# 14. REGRA MAIS IMPORTANTE

**Não transforme essa página em uma cópia visual da Famiglia Maioli.**

A Famiglia Maioli está sendo utilizada apenas como **referência de UX, organização e funcionalidades**.

A aparência final deve pertencer ao **nosso e-commerce**.

Portanto:

**ESTRUTURA/UX:** referência Famiglia Maioli.

**IDENTIDADE VISUAL:** nosso protótipo.

**CORES:** #AE8648 + fundo escuro já definido.

**TÍTULOS:** Pinyon Script.

**MENU/TEXTOS:** Poppins.

**TÍTULOS DAS CATEGORIAS:** Open Sans.

**HEADER:** componente global já existente.

**FOOTER:** componente global já existente.

**ESTILO:** sofisticado, premium, elegante e relacionado ao universo dos vinhos.

**Não inventar uma nova identidade visual. Não alterar o menu ou rodapé. Não usar preto puro.**

[1]: https://famigliamaioli.com/categoria-produto/vinhos/?_gl=1%2A1xdfucm%2A_up%2AMQ..%2A_gs%2AMQ..&gbraid=0AAAABDMU7ZRc6cNHJkDmaeOA2ibrug4tP&gclid=Cj0KCQjwh4TVBhCWARIsAG0czmrDrWfvkwFG_g-FQKLsnHpF4vnsdPCpyQ-gVMocDK1pjqOumaDFljIaAjRUEALw_wcB "Vinhos – Famiglia Maioli"
