# Decisões Ativas — System Builder

Este documento contém as decisões que devem guiar a implementação atual.

## 1. Decisões de produto

* O System Builder não é clone do n8n.
* n8n é referência de UX: canvas, nodes, edges, inspector, preview e histórico.
* O produto é um business system/process builder.
* O processo vem antes da tela.
* O Builder define; o Runtime executa.

## 2. Decisões técnicas

* O domínio do Builder não depende de React Flow.
* React Flow/`@xyflow/react` é adaptador visual dentro de `src/features/builder/canvas`.
* O modelo canônico usa `BuilderDraft`, `BuilderNode` e `BuilderEdge`.
* `localStorage` é autosave local, não persistência oficial.
* Persistência oficial usa `workflow.process_definitions` e `workflow.process_versions`.
* Versões de processo usam JSONB para guardar a definição serializada.
* Runtime real ainda não foi criado.
* Eventos/rastreabilidade ainda não foram criados.
* Registry/actions ainda não foram criados.

## 3. Decisões de banco

* Usar schemas PostgreSQL lógicos.
* `public` é legado/transição.
* Novo código de plataforma deve evitar dependência direta de `public`.
* Não criar FK nova para `public.workspaces`.
* `workflow.process_definitions` e `workflow.process_versions` não devem depender do legado.
* Não executar `db:push` sem autorização explícita.

## 4. Decisões pendentes

* API route ou server action para salvar processos.
* Estratégia de workspace real no Builder.
* Estratégia de autenticação/autorização para persistência.
* Quando criar FK real para `workspace.workspaces`.
* Formato definitivo de `workflow.events`.
* Estratégia de publicação de versão.
* Estrutura de runtime `process_instances`.
* Integração com n8n via webhook/outbox.
* Modelo de permissions/RBAC.
