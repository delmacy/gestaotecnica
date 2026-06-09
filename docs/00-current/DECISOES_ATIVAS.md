# Decisões Ativas — System Builder

Este documento contém as decisões que devem guiar a implementação atual.

## 1. Decisões de produto

* O System Builder não é clone do n8n.
* n8n é referência de UX: canvas, nodes, edges, inspector, preview e histórico.
* O produto é um business system/process builder.
* O processo vem antes da tela.
* O Builder define; o Runtime executa.
* **Process Candidate** passa a ser a camada estratégica antes de um workflow ser publicado.
* **Paperclip** não será instalado no MVP atual. É uma integração futura de organização de agentes.
* O Builder deve ser preparado para integração futura com Paperclip (Control Plane).
* **Agent Gateway** será a fronteira futura para a comunicação com os agentes.
* Agentes podem criar propostas/candidatos, mas **não publicam workflows sozinhos**.
* n8n é apenas um integrador, não é o core.
* Postgres continua sendo o source of truth isolado e inviolável.
* Publicação de workflow exige revisão humana obrigatória.
* A UI do Builder deve evoluir para um Control Plane denso.
* Toda fase técnica deve aplicar o `Frontend Parity Gate`: backend, domínio,
  banco, workflows, forms, rules, capabilities e integrações precisam ter
  reflexo operável ou visível na área autenticada correspondente.
* Dados de Gestão Técnica são sempre dados de um workspace/cliente selecionado.
  O admin da plataforma pode acessá-los como administrador, mas eles não são
  globais da plataforma.
* Capabilities são globais e reutilizáveis; instalações, configurações,
  processos, demandas, formulários, aprovações e dashboards são por workspace.

## 2. Decisões técnicas

* **DDD Pragmático/Progressivo**: O projeto adotará conceitos de DDD progressivamente (bounded contexts, use cases, ports/adapters), sem exigir uma reescrita arquitetural global. Novas fases devem seguir o DDD Feature Contract.
* **Isolamento de Regras**: Domínio não deve depender de detalhes de Paperclip/n8n. Payload externo será tratado por Anti-Corruption Layer. Repositories persistem (não decidem regras). API Routes adaptam HTTP (não concentram regras). UI opera casos de uso.
* **Status Testável**: Status e transições de estado devem ser validados por testes no backend, evitando mutações arbitrárias na UI ou no repository.
* **Fase 39** passa a ser o gate final Alpha de segurança.
* **Fase 40/40B** (Agent Registry) deve ocorrer antes da Fase 39.
* **Fase 38/38B** (Workspace Consent) deve ser antecipada antes de n8n/observations.
* **Fase 28B** será reduzida para Agent Candidate Inbox mínimo.
* **Fases 30/30B** assumem correlation_id, idempotency e receipts completos.
* **Fases 34 e 36** serão quebradas em subfases (A-E) para melhor rastreabilidade.
* **Rotas Alpha** usarão 'workspace ativo por contexto', salvo decisão futura.
* Jules Dev não deve implementar nenhuma fase sem contrato no novo `FEATURE_CONTRACT_TEMPLATE.md`.

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
* A Fase 16 introduziu o conceito de publicação, permitindo transformar uma versão em "published" na interface. A publicação não executa o processo, apenas muda seu status no repositório.
* Versão publicada é pré-requisito para o runtime (Fase 17).

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
* Estrutura de runtime `process_instances`. O runtime começa na Fase 17.
* Integração com n8n via webhook/outbox.
* Modelo de permissions/RBAC.

## 5. Gate obrigatório de UI

Todas as fases futuras devem incluir no relatório:

```text
Frontend impact:
- Área afetada:
- Rota(s):
- Usuário/persona:
- Workspace/global:
- Estados cobertos:
- Teste visual/E2E:
- Gap frontend pendente:
```

Se houver gap frontend pendente, a fase não deve ser marcada como aprovação
plena para próxima etapa, salvo quando for explicitamente infra invisível ou
documentação.

## 6. Frontend Parity Gate

* Nenhuma capacidade técnica backend avança sem sua respectiva UI ou fase frontend vinculada no planejamento.
* O roadmap precisa garantir que o frontend acompanhe o backend de forma planejada.
* Área autenticada é o padrão.
* Capabilities globais e dados workspace-scoped devem ser diferenciados claramente.

## Decisão — Pós-Fase 30

A Fase 30 foi aceita com ressalva documentada por flakiness de E2E na suíte completa. Como a fase não alterou UI e os testes afetados passaram isoladamente, a próxima fase autorizada será a Fase 30B, responsável por fechar o Frontend Parity Gate por meio da UI de receipts.

A Fase 31 permanece bloqueada até a conclusão da Fase 30B.

## 7. Jules Agent Boundaries

O projeto adotará agentes Jules nomeados por função e domínio:

Jules <Role> <Domain> [Scope]

Cada prompt deve declarar domínio autorizado, arquivos permitidos, arquivos proibidos e regra de parada.

Essa regra existe para reduzir colisão, acoplamento, contaminação de core e conflitos entre módulos.

## 8. Decisões de Auditoria (CAP-DOC-A)

* A auditoria de contaminação por Gestão Técnica (CAP-DOC-A) foi concluída.
* O documento `CORE_CONTAMINATION_AUDIT.md` foi criado para estabelecer os limites do "Core" do System Builder.
* O legado será isolado em "Capabilities" ou bounded contexts temporários, e termos agnósticos serão utilizados no Core.
