# Guia de Colaboração (CONTRIBUTING)

Este documento estabelece as regras e padrões para o uso do Git/GitHub, garantindo a excelência técnica, a rastreabilidade do código e a eficiência nos Code Reviews.


---


## 1. Fluxo de Colaboração (Do Início à Entrega)

Toda contribuição ao código deve seguir o fluxo abaixo, que começa com o registro da tarefa e termina com a revisão do código.

### 1.1. Criando uma Issue (O Ponto de Partida)

Toda tarefa (nova funcionalidade, correção de bug ou melhoria) **deve** ser rastreada por uma Issue no GitHub.

* **Propósito:** A Issue deve descrever o problema ou a funcionalidade a ser implementada, baseando-se nas **Histórias de Usuário** ou nos **Requisitos**.
* **Título:** Deve ser conciso e descritivo (ex: `Implementar a restrição de acesso por login `).
* **Atribuição:** Atribua a Issue ao desenvolvedor responsável.

### 1.2. Desenvolvendo o Código (A Branch de Trabalho)

Com a Issue criada, crie uma **Branch** para isolar o trabalho:

1.  Crie a branch a partir da branch principal (`main`) mais recente.
2.  Use a **Convenção de Nomes de Branches** (Seção 2.1).
3.  Faça *commits* pequenos e frequentes, seguindo as **Regras de Commits Convencionais** (Seção 2.2).

### 1.3. Submetendo o Código (O Pull Request)

Ao concluir e testar o trabalho localmente, abra um **Pull Request (PR)**:

1.  **Destino:** O PR deve ser sempre aberto para a branch **`main`**.
2.  **Descrição:** Preencha a descrição com:
    * Um resumo das mudanças.
    * A ligação com a Issue que está sendo resolvida (ex: `Fecha #ID_DA_ISSUE`).
    * O **Checklist de Qualidade Mínima** (Seção 3) preenchido e validado.
3.  **Revisão:** Solicite a revisão de pelo menos um colega de equipe (Revisor). O merge só pode ser feito após a aprovação formal do Revisor.

---

## 2. Padrões de Nomenclatura e Commits Convencionais

### 2.1. Convenção para Nomes de Branches

Os nomes das branches devem indicar o **tipo de trabalho** e o **módulo** do projeto alterado.

**Formato Obrigatório:** `<tipo>/<módulo>-<descrição-curta>`

| Tipo | Módulos (Escopo) | Descrição |
| :--- | :--- | :--- |
| **`feat`** | `perfil`, `treino`, `avaliacao`, `ia`, `notificacao`, `suporte` | Nova funcionalidade (Ex: `feat/treino-geracao-planos`) |
| **`fix`** | *Use o módulo afetado* | Correção de um bug (Ex: `fix/perfil-bug-edicao`) |
| **`refactor`** | `manutencao` ou módulo específico | Melhoria de código (Ex: `refactor/modular-codigo-ia`) |
| **`docs`** | `suporte` ou `geral` | Alterações na documentação. |
| **`test`** | *Use o módulo afetado* | Adição ou correção de testes. |
| **`chore`** | `geral` | Tarefas de manutenção sem impacto direto no código do app. |

### 2.2. Convenção para Mensagens de Commit

Usamos o padrão **Commits Convencionais** (Conventional Commits).

**Formato Obrigatório:** `<tipo>(<escopo>): <descrição>`

* **Tipo e Escopo:** Use os mesmos definidos na tabela acima. O **Escopo** é **obrigatório** e deve ser um dos módulos do projeto.
* **Descrição:** Resumo conciso e no modo **imperativo** (ex: `corrigir`, `adicionar`, `remover`).

**Exemplo:** `feat(perfil): permitir ao usuário registrar restrições físicas`

---

## 3. Checklist de Qualidade Mínima para Pull Request (PR)

O desenvolvedor deve copiar e preencher este checklist no corpo do PR antes de solicitar a revisão.

### 3.1. Garantia Técnica e de Código

* A branch de trabalho foi sincronizada com a `main` e conflitos foram resolvidos.
* O código segue os padrões de formatação e nomenclatura do time.
* O código é modular.

### 3.2. Testes e Funcionalidade

* A funcionalidade implementada atende 100% à descrição da Issue e foi testada manualmente.
* A funcionalidade roda corretamente em pelo menos um dispositivo **Android** e um **iOS** (ou conforme o ambiente de testes). 
* (Se aplicável) O sistema lida com o **cenário offline** .
* Novos testes (unitários/integração) foram criados para cobrir o código novo/alterado.

### 3.3. Usabilidade e Experiência 

* A função de carregamento ocorre em menos de **3 segundos**.
* A interface é responsiva, se ajusta a diferentes telas e é acessível.
* Todo o texto para o usuário está em **Português claro e coeso**.

### 3.4. Documentação e Fechamento

* A Issue original está linkada na descrição do PR (ex: `Fecha #ID`).
* A documentação (Guia Interativo ou Central de Ajuda) foi atualizada, se necessário.
* Pelo menos um revisor (colega de equipe) foi solicitado para o *Code Review*.

## 4. Como configurar o projeto localmente?
 * As instruções detalhadas para configurar o projeto no ambiente de desenvolvimento local estão disponíveis no arquivo **README.md**.

* **Acesso:** [https://github.com/AmandaTrinity/personalIA/commit/7e35814121c90186a89b605c581f2de438c168cd]
