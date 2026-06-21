# Contrato de Sprint Autônoma e Gate de Projetos (AUTONOMOUS_SPRINT_GATE)

Este documento define o contrato de aprovação, os estados de sprint e as regras de integração com GitHub Projects para sprints autônomas do System Builder.

## 1. Estados da Sprint Autônoma

O ciclo de vida de uma sprint autônoma e sua representação no GitHub Projects devem refletir estritamente os seguintes estados:

- **PLANNED**: Sprint definida e pronta para alocação.
- **DISPATCHED**: Agente autônomo (ex: Jules) acionado com os parâmetros da task.
- **IN_PROGRESS**: Agente está ativamente trabalhando na task (exploração, codificação, testes locais).
- **WAITING_REVIEW**: Agente abriu o PR e aguarda feedback humano (Reviewer/Tester).
- **NEEDS_CHANGES**: Foram solicitados ajustes no PR via comentário.
- **ACCEPTED**: Trabalho validado e entregue com sucesso, aguardando integração.
- **MERGE_READY**: Todos os checks de CI/CD passaram e PR está apto a merge.
- **MERGED**: PR integrado na branch base.
- **INVALIDATED_BY_MANUAL_INTERVENTION**: A sprint perdeu sua validade como evidência de autonomia devido a intervenção manual direta no código, console ou estado pelo usuário humano (Codex).

## 2. Critérios de Sucesso da Autonomia

Uma sprint é considerada um **sucesso autônomo** *apenas* se o agente for capaz de completar o ciclo de `DISPATCHED` até `ACCEPTED` sem nenhuma intervenção de execução por parte do usuário (Codex).

**Regra de Invalidação por Intervenção:**
Qualquer intervenção direta do Codex (ex: push manual de commits, consertos em ambiente, resolução de conflitos, ou execução de comandos por fora do agente) após o `DISPATCHED` altera imediatamente o estado da sprint para **INVALIDATED_BY_MANUAL_INTERVENTION**. Uma sprint invalidada não serve como prova de autonomia.

**Regra de Nova Sprint:**
Se os PRs forem bons, mas o Codex precisou intervir no ambiente ou código, a entrega técnica pode ser mantida, mas uma **nova sprint** com um escopo modificado deve ser exigida para comprovar a autonomia sobre a capacidade que falhou. A sprint atual será considerada concluída tecnicamente, mas falha do ponto de vista de autonomia.

## 3. Fluxo de Revisão e Teste (Reviewer / Tester)

A interação humana com o agente deve seguir estritamente as interfaces estabelecidas:

- **Fluxo do Reviewer:** Se o código necessita de ajustes, o Reviewer deve usar a ação `COMMENT_ON_PR` ou simplesmente comentar no PR citando explicitamente `@jules` com as instruções corretivas. O agente deve processar o comentário, realizar as alterações e atualizar o PR (transição para `NEEDS_CHANGES` e de volta a `WAITING_REVIEW`).
- **Fluxo do Tester:** Para validação de sucesso e CI/CD, o Tester deve utilizar a capacidade de leitura de artefatos, como `READ_ACTIONS_REPORT`, e notificar sobre bloqueios de permissão ou falhas de deploy, solicitando ao agente que corrija configurações, mas nunca burlando o agente para testar localmente e commitar.

## 4. Separação de Entregas (ACCEPT_DELIVERY vs MERGE_PR)

A finalização do trabalho do agente (`ACCEPT_DELIVERY`) não implica no merge imediato (`MERGE_PR`).
- **ACCEPT_DELIVERY** marca que o PR atende aos Acceptance Criteria da task e o agente cumpriu seu papel autônomo. O estado passa para `ACCEPTED` (ou `MERGE_READY` se CI estiver verde).
- **MERGE_PR** é uma etapa separada, geralmente controlada por um Release Manager ou por automações de CI/CD que rodam na branch principal após o Accept.

## 5. Contrato de Campos no GitHub Projects

Toda atualização de task no GitHub Projects V2 pelo agente (seja por scripts ou Actions) deve contemplar obrigatoriamente os seguintes campos mínimos:

- `repo`: Nome completo do repositório (ex: `delmacy/gestaotecnica`).
- `task`: ID da task (ex: `TASK-GT-AUTONOMY-PROJECT-GATE-001`).
- `PR`: URL ou número do Pull Request associado.
- `status`: O estado da sprint (um dos listados na seção 1).
- `owner`: Agente ou humano responsável no momento (ex: `jules`).
- `updatedAt`: Timestamp ISO da última transição de estado.
- `blocker`: Descrição de impedimentos, ou vazio.
- `evidenceUrl`: Link para logs de CI, artifacts ou comentários que provam a transição de estado.

## 6. Comportamento com IDs Ausentes

Em situações onde os IDs reais (Node IDs) de itens do GitHub Projects V2 ainda não existam ou não tenham sido descobertos pelo agente:
- O agente **não deve falhar** o processo inteiro apenas por não conseguir atualizar o Project via API.
- O agente deve **registrar um bloqueio claro** (blocker) em seu plano ou nos logs, informando que não foi possível atualizar o painel devido a IDs ausentes.
- O agente deve **continuar a entrega documental** e criar/atualizar os relatórios em `docs/` e finalizar a submissão do código (PR).

## 7. Regra do Receipt Real para Atualização

É expressamente **proibido fingir** uma atualização de Project (`UPDATE_PROJECT_STATUS`).
- O agente não pode simular sucesso ou inventar receipts.
- A atualização do GitHub Projects só pode ser declarada se for acompanhada de um receipt de API genuíno que comprove a transação (via resposta GraphQL/REST com `id` ou confirmação da Action de integração).
