Perfeito. Aqui temos uma mudança importante: não é apenas criar uma tela visual de login/cadastro, mas também **criar a lógica de usuário + quiz + personalização**, para que o protótipo tenha um fluxo coerente.

Eu colocaria no Figma Make um prompt bem explícito, porque senão ele pode criar apenas telas estáticas e não conectar essas funcionalidades.

---

# TELA DE LOGIN, CADASTRO E EXPERIÊNCIA PERSONALIZADA

Implementar agora o sistema de **Login/Cadastro** do e-commerce de vinhos, mantendo **100% da identidade visual já criada no protótipo**.

Não alterar o Header, Footer, cores ou tipografias existentes.

O sistema deve funcionar de maneira integrada com o **Quiz de Preferências**, os produtos e a nova área de **Conteúdo Personalizado**.

---

## 1. ACESSO AO LOGIN

No Header já existente existe o ícone de usuário/bonequinho.

Quando o usuário clicar nesse ícone:

**→ direcionar para a tela de Login.**

Não criar um novo menu ou Header.

Utilizar exatamente o Header global que já existe.

---

# 2. TELA DE LOGIN

Criar uma página de login sofisticada e minimalista, seguindo a identidade visual do e-commerce.

### Estrutura:

Título:

**Bem-vindo de volta**

Texto secundário:

**Entre na sua conta para descobrir uma seleção de vinhos feita para você.**

Campos:

**E-mail**

**Senha**

Botão principal:

**ENTRAR**

Abaixo:

**Esqueceu sua senha?**

E posteriormente:

**Ainda não tem uma conta? Cadastre-se**

O texto **“Cadastre-se”** deve ser clicável.

Ao clicar:

**→ direcionar para a tela de cadastro.**

---

# 3. DESIGN DO LOGIN

Manter a identidade visual já estabelecida:

### Fundo

Utilizar o mesmo fundo escuro do protótipo.

**Não utilizar #000000 puro.**

### Cor de destaque

**#AE8648**

### Tipografia

**Pinyon Script:** títulos principais.

**Poppins:** textos, campos, botões e informações gerais.

**Open Sans:** títulos de categorias quando aplicável.

A tela deve transmitir:

* sofisticação;
* elegância;
* exclusividade;
* experiência premium;
* universo dos vinhos.

Não transformar o login em um formulário genérico.

Evitar aparência de sistema administrativo.

---

# 4. TELA DE CADASTRO

Ao clicar em **“Cadastre-se”**, abrir uma página de criação de conta.

Título:

**Crie sua conta**

Texto:

**Crie seu perfil e descubra vinhos e conteúdos selecionados para você.**

Campos:

* Nome
* E-mail
* Senha
* Confirmar senha

Botão:

**CRIAR CONTA**

Abaixo:

**Já possui uma conta? Entrar**

O link **“Entrar”** deve voltar para a tela de login.

---

# 5. CONTA DO USUÁRIO

Criar uma lógica de autenticação para que o protótipo consiga diferenciar:

**Usuário não autenticado**

de

**Usuário autenticado.**

Depois que o usuário realizar login com sucesso, manter o estado de autenticação durante a navegação pelo site.

O usuário não deve precisar fazer login novamente simplesmente porque mudou de página.

---

# 6. QUIZ DE PREFERÊNCIAS

O e-commerce possui um botão:

**FAZER O QUIZ**

na página inicial.

O quiz deve continuar acessível para qualquer pessoa.

Porém existe uma regra fundamental:

### O usuário pode responder o quiz sem estar logado.

Ele pode completar todas as perguntas normalmente.

**Mas o resultado personalizado NÃO deve ser exibido enquanto ele não estiver autenticado.**

Ao finalizar o quiz, se o usuário não estiver logado:

mostrar uma tela intermediária:

### **Seu resultado está pronto!**

Texto:

**Entre ou crie sua conta para descobrir os vinhos selecionados especialmente para você.**

Botões:

**ENTRAR**

**CRIAR CONTA**

---

# 7. APÓS O LOGIN

Se o usuário acabou de responder o quiz e foi direcionado para o login:

depois que fizer login com sucesso:

**→ retornar automaticamente para o resultado do quiz.**

Não obrigar o usuário a responder o quiz novamente.

As respostas dadas anteriormente devem permanecer associadas àquela sessão/usuário.

---

# 8. RESULTADO PERSONALIZADO DO QUIZ

O resultado deve ser **individual para cada usuário**.

Não mostrar uma lista fixa de produtos para todo mundo.

Utilizar as respostas do quiz para determinar quais vinhos possuem maior compatibilidade com o perfil daquele usuário.

Criar uma lógica de recomendação baseada nas respostas.

Exemplo:

```text
RESPOSTAS DO USUÁRIO
        ↓
Perfil de preferência
        ↓
Categorias compatíveis
        ↓
Uvas compatíveis
        ↓
Características do vinho
        ↓
Produtos da loja
        ↓
RECOMENDAÇÕES PERSONALIZADAS
```

---

# 9. RESULTADO DO QUIZ

Criar uma página de resultado elegante.

Título:

**Vinhos para você**

Texto personalizado:

**Com base nas suas respostas, selecionamos alguns vinhos que combinam com o seu perfil.**

Apresentar os produtos recomendados.

Cada recomendação deve mostrar:

* imagem da garrafa;
* nome;
* tipo;
* uva;
* preço;
* nível de compatibilidade.

Exemplo:

**95% de compatibilidade**

ou

**Combina muito com você**

---

# 10. RECOMENDAÇÕES DINÂMICAS

A lógica deve considerar as respostas do usuário.

Por exemplo, se o usuário demonstrar preferência por:

**Tintos + vinhos encorpados + Syrah**

dar prioridade para produtos com essas características.

Outro usuário que responder:

**Brancos + leves + Sauvignon Blanc**

deve receber recomendações diferentes.

**IMPORTANTE:**

Não criar apenas uma tela visual dizendo que as recomendações são personalizadas.

As recomendações precisam realmente mudar de acordo com as respostas armazenadas do usuário.

---

# 11. CONTEÚDO PERSONALIZADO

Depois que o usuário estiver autenticado e voltar para a **Página Inicial**, o Header deve mudar.

No menu deve aparecer uma nova opção:

### **CONTEÚDO PERSONALIZADO**

Essa opção deve aparecer **somente para usuários autenticados**.

Usuários que não estiverem logados continuam vendo o menu normal.

---

# 12. ABA "CONTEÚDO PERSONALIZADO"

Criar uma nova página:

**Conteúdo Personalizado**

Essa página deve utilizar as informações obtidas através do quiz para selecionar conteúdos relevantes para aquele usuário.

O conteúdo pode incluir:

* artigos;
* dicas;
* sugestões de harmonização;
* informações sobre tipos de vinho;
* informações sobre uvas;
* sugestões de consumo;
* conteúdos educativos;
* recomendações de produtos.

---

# 13. PERSONALIZAÇÃO DO CONTEÚDO

O conteúdo apresentado deve estar relacionado às preferências identificadas no quiz.

Exemplo:

Se o usuário demonstrou interesse em **vinhos tintos**:

mostrar conteúdos como:

**“Como escolher um bom vinho tinto”**

**“Diferenças entre Syrah e Cabernet Sauvignon”**

**“Vinhos tintos para acompanhar carnes”**

Se demonstrou interesse em **espumantes**:

mostrar conteúdos relacionados a:

**espumantes, celebrações, harmonizações e tipos de uva utilizados.**

Se demonstrou interesse em **vinhos brancos leves**:

priorizar conteúdos relacionados a:

**Sauvignon Blanc, Chardonnay, harmonização com frutos do mar etc.**

---

# 14. PERSONALIZAÇÃO NA HOME

Depois que o usuário estiver logado, a página inicial também pode apresentar uma área personalizada.

Exemplo:

### **Olá, [Nome]!**

**Selecionamos algumas coisas que podem interessar a você.**

Depois:

### **Selecionados para você**

Mostrar produtos recomendados pelo perfil do usuário.

E:

### **Conteúdos para você**

Mostrar conteúdos relacionados às respostas do quiz.

---

# 15. USUÁRIO SEM QUIZ

Se o usuário estiver logado, mas ainda não tiver respondido ao quiz:

não mostrar uma área personalizada vazia.

Mostrar:

### **Quer descobrir seus vinhos ideais?**

**Responda ao nosso quiz e criaremos uma seleção personalizada de vinhos e conteúdos para você.**

Botão:

**FAZER O QUIZ**

---

# 16. USUÁRIO LOGADO NO HEADER

Quando o usuário estiver autenticado, o ícone de usuário deve refletir que ele está conectado.

Ao clicar no bonequinho, abrir uma área/menu contendo opções como:

**Minha conta**

**Meus vinhos**

**Conteúdo personalizado**

**Sair**

Não alterar o design do Header existente. Apenas adicionar esse comportamento.

---

# 17. USUÁRIO DESLOGADO

Quando não estiver autenticado:

Bonequinho →

**Login**

Na tela de Login →

**Cadastre-se**

---

# 18. FLUXO COMPLETO

Implementar o seguinte fluxo:

```text
PÁGINA INICIAL
      │
      ├── clicar no bonequinho
      │
      ▼
    LOGIN
      │
      └── Cadastre-se
              │
              ▼
           CADASTRO
              │
              ▼
        USUÁRIO LOGADO
              │
              ▼
        PÁGINA INICIAL
              │
              └── CONTEÚDO PERSONALIZADO
```

E o fluxo do quiz:

```text
PÁGINA INICIAL
      │
      ▼
   FAZER QUIZ
      │
      ▼
  RESPONDE QUIZ
      │
      ▼
 RESULTADO PRONTO
      │
      ├── usuário logado?
      │       │
      │      SIM
      │       ↓
      │   RESULTADO
      │
      └── NÃO
              ↓
       LOGIN / CADASTRO
              ↓
        RESULTADO DO QUIZ
              ↓
    PRODUTOS PERSONALIZADOS
```

---

# 19. DADOS DO USUÁRIO

Associar ao perfil do usuário:

* nome;
* e-mail;
* respostas do quiz;
* perfil de preferência identificado;
* categorias preferidas;
* uvas preferidas;
* características de vinho preferidas;
* produtos recomendados;
* conteúdos recomendados.

Esses dados devem ser utilizados para gerar a experiência personalizada.

---

# 20. IMPORTANTE — NÃO CRIAR UMA PERSONALIZAÇÃO FALSA

Não fazer simplesmente:

> “Olá, Isabel! Aqui estão alguns vinhos.”

e mostrar os mesmos produtos para todos.

A personalização precisa estar **conectada às respostas do quiz**.

O sistema deve conseguir gerar resultados diferentes para perfis diferentes.

Criar alguns perfis de teste/dados mockados para demonstrar esse funcionamento dentro do protótipo.

---

# 21. COMPONENTES GLOBAIS

Manter os componentes que já foram criados:

**HEADER GLOBAL**

**FOOTER GLOBAL**

Eles devem continuar presentes em todas as páginas.

Não duplicar ou recriar esses componentes.

O novo sistema deve ser integrado à estrutura existente.

---

# 22. REGRA FINAL DE DESIGN

**Não alterar a identidade visual existente.**

Manter:

**Bege/dourado:** `#AE8648`

**Fundo:** preto suavizado, nunca `#000000`

**Títulos:** Pinyon Script

**Menu e textos:** Poppins

**Títulos de categorias:** Open Sans

Manter o mesmo estilo sofisticado, elegante, premium e relacionado ao universo dos vinhos.

O Login, Cadastro, Quiz, Resultado, Conteúdo Personalizado e Minha Conta devem parecer **partes do mesmo e-commerce**, e não páginas independentes.

**O Header e Footer existentes são componentes globais e não devem ser modificados visualmente.**
