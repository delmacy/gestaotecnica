# Decisões Arquiteturais — System Builder

## 1. Princípios

* O processo vem antes da tela.
* O Builder define; o Runtime executa.
* React Flow é adaptador visual, não domínio.
* O domínio do Builder não deve depender de biblioteca de canvas.
* `localStorage` é autosave local, não persistência oficial.
* Persistência oficial usa `workflow.process_definitions` e `workflow.process_versions`.
* Runtime real usará process instances em fase posterior.
* Eventos e rastreabilidade pertencem ao domínio workflow/platform, não ao legado `public`.
* n8n é referência de UX/orquestração externa, não base de domínio.

## 2. Decisões já tomadas

| Decisão                                           | Estado | Justificativa                                        |
| ------------------------------------------------- | ------ | ---------------------------------------------------- |
| Usar n8n como referência conceitual de UX         | Aceita | Canvas, nodes, edges, inspector e preview são úteis  |
| Não clonar n8n                                    | Aceita | O domínio do System Builder é process/system builder |
| Usar `@xyflow/react` apenas no canvas             | Aceita | Evita acoplamento do domínio à UI                    |
| Manter modelo próprio `BuilderNode`/`BuilderEdge` | Aceita | Permite trocar visualização sem quebrar domínio      |
| Usar schemas PostgreSQL lógicos                   | Aceita | Separa bounded contexts                              |
| Evitar FK nova para `public`                      | Aceita | Reduz acoplamento com legado                         |
| Usar JSONB para versões de processo               | Aceita | Preserva definição versionada do Builder             |
| Preparar persistência antes da UI salvar          | Aceita | Reduz risco de acoplamento prematuro                 |
| Usar localStorage antes do banco                  | Aceita | Protege trabalho do usuário durante fase local       |

## 3. Decisões pendentes

* API route ou server action para salvar processos;
* estratégia de workspace real no Builder;
* estratégia de autenticação/autorização para persistência;
* quando criar FK real para `workspace.workspaces`;
* formato definitivo de `workflow.events`;
* estratégia de publicação de versão;
* estrutura de runtime `process_instances`;
* integração com n8n via webhook/outbox;
* modelo de permissions/RBAC.

## 4. Regra de decisão

> Toda decisão que afeta domínio, banco, runtime, segurança ou integração deve ser registrada aqui antes de virar padrão do projeto.
