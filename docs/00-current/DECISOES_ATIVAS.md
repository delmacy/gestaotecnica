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
* Service e Repository de persistência devem ser estritamente uma camada intermediária; ou seja, devem ser testados e montados de maneira autônoma antes da API ou da UI consumi-los (Implementado na Fase 12).
* A Fase 13 construiu a camada API/server actions de processos encapsulada e pronta para o consumo.
* A Fase 14 conectou a UI (Builder) com a API server actions para suportar Salvamento Oficial, mantendo um Autosave Local paralelo.
* A Fase 15 adicionou um painel de Processos Salvos que lista os processos e os carrega (usando a latest version), sobrepondo o rascunho local do editor.
* O processo de edição/versionamento formal e publicação oficial ficarão para as fases futuras.

## 3. Decisões de banco

* Usar schemas PostgreSQL lógicos.
* `public` é legado/transição.
* Novo código de plataforma deve evitar dependência direta de `public`.
* Não criar FK nova para `public.workspaces`.
* `workflow.process_definitions` e `workflow.process_versions` não devem depender do legado.
* Não executar `db:push` sem autorização explícita.

## 4. Decisões pendentes

* Estratégia de workspace real no Builder (atualmente usando um mock `00000000-0000-0000-0000-000000000001` temporariamente).
* Estratégia de autenticação/autorização para persistência.
* Quando criar FK real para `workspace.workspaces`.
* Formato definitivo de `workflow.events`.
* Estrutura de runtime `process_instances`.
* Integração com n8n via webhook/outbox.
* Modelo de permissions/RBAC.
