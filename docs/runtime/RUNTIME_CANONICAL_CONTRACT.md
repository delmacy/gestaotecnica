# Runtime Canonical Contract

Este contrato formaliza a ontologia canônica das entidades do motor de Runtime, seus atributos fundamentais, status e decisões arquiteturais. Nenhuma modificação de código está autorizada durante a definição deste contrato.

## Entidades Canônicas Envolvidas

1. **RuntimeProcessDefinitionReference**: Identificador do diagrama subjacente.
2. **RuntimeProcessVersionReference**: O artefato versão estático usado no instanciamento.
3. **RuntimeProcessGraph**: Conceito subjacente extraído do JSON armazenado na version, englobando nodos e arestas.
4. **RuntimeNode**: Unidade lógica individual (Step/Block/Condition) no fluxo.
5. **RuntimeTransition**: Regras (Edges) de fluxo apontando de um Nó Fonte a um Nó Alvo.
6. **RuntimeActionDefinition**: A carga atrelada a um nó de tarefa (Task/Form).
7. **ProcessInstance**: A entidade persistida e raiz da execução.
8. **ProcessPayload**: Dados persistidos atrelados a um Process Instance (snapshots).
9. **StepExecution**: Abstração canônica de um passo, que hoje é implementada como `ActionExecution`.
10. **ActionExecution**: O registro concreto e detalhado no repositório sobre um passo da instância.
11. **RuntimeActor**: O usuário logado, autor da mudança ou disparo (sistema, humano).
12. **RuntimeCommandContext**: Objeto envolvendo workspaceId, Actor, Transaction Limits.
13. **RuntimeCorrelationContext**: Idempotency Key, Trace ID etc.
14. **RuntimeEventReference**: Event Logs e Outbox Messages (audit events).
15. **RuntimeError**: Tipo formal de falha estruturada e mapeável no domínio do Runtime.

## Entidade: ProcessInstance

| Campo | Descrição |
|---|---|
| `id` | Identificador único (UUID) |
| `workspaceId` | Tenant mandatório (UUID) |
| `processVersionId` | Identificador de referência à `ProcessVersion` exata. |
| `processDefinitionId` | *[Decisão Arquitetural]* **Ausente**. Deve permanecer ausente do schema da tabela de instâncias. É um dado derivado via `processVersionId`. Se necessário em pesquisas de negócio, deve ser um JOIN ou incluído via metadata, mas não na entidade base para não gerar quebras de normalização. |
| `currentStateId` | (Opcional/Derivado) UUID ou Node ID apontando o passo exato em andamento da execução (node target de "agora"). |
| `status` | Process instance status enum. |
| `createdById` | UUID de ator humano (se existir), null se foi disparo via worker/webhook/system. |
| `createdAt` | Timestamp canônico de inicio. |
| `updatedAt` | Timestamp canônico de atualização de status/estado. |

## Entidade: ProcessPayload

| Campo | Descrição |
|---|---|
| `id` | UUID |
| `instanceId` | Referência à Process Instance. |
| `workspaceId` | Isolamento do Tenant |
| `schemaVersion` | Nome canônico do campo do JSON Schema validando este dado (na tabela é `schema_version`, no TS é `schemaVersion`. **Divergência detectada, requer RC-FIX-B**). Não ocultar via cast. |
| `data` | Estrutura de dados `Record<string, unknown>`. O TS atual define `Record<string, any>`, o que viola segurança canônica e deve ser classificado em GAP Critical. |
| `createdAt` | Timestamp. |
| `updatedAt` | Timestamp. |

## Entidade: ActionExecution / StepExecution

*Decisão arquitetural:* `StepExecution` e `ActionExecution` referem-se ao mesmo conceito no Engine. O engine persiste o progresso de "passos" e o histórico executado em uma tabela chamada `action_executions`. `StepExecution` serve apenas como modelagem conceitual nos *Input/Output DTOs* de avanços de fluxo, mas a entidade canônica raiz persistida será **sempre mapeada por baixo como ActionExecution**.

| Campo | Descrição |
|---|---|
| `id` | Identificador do Action (UUID) |
| `workspaceId` | Tenant |
| `instanceId` | UUID da Instância Mãe |
| `actionKey` | O ID estático/String do Node do definition (`nodeId`). Hoje há ambiguidade na linguagem (`nodeId` vs `actionKey` vs `currentStateId`). **Decisão Canônica**: `actionKey` armazenará o `nodeId` (o key identificador do nó lógico publicado no JSON). |
| `actorId` | Usuário logado autorizador do avanço |
| `inputPayload` | Dados necessários para iniciar o nó (derivado do engine) |
| `outputPayload` | Dados fornecidos pelo Ator para fechar o nó |
| `status` | Enum do status de execução |
| `error` | Payload ou text message de recusa, exceptions etc |
| `startedAt` | Início do Step (Data/Hora de entrada da engine no state) |
| `finishedAt` | Fechamento do Step. |

## Status Canônicos

### Process Instance Status:
- `pending`: Aceita em sistema, ainda não inicializou payload/action root.
- `active`: Instância iniciada e em trânsito de nodos.
- `completed`: Atingido de forma graciosa nó do tipo "End" e fluxos concluídos.
- `failed`: Erro irrecuperável sistêmico do fluxo.
- `cancelled`: Ação de governança, abortado por usuário de suporte/owner.

### Action / Step Execution Status:
- `pending`: Enfileirado conceitualmente (criado pelo motor de transição de status anterior mas inputPayload ausente).
- `running`: Ativo para o usuário ver na UI (ou máquina aguardando). **Comportamento atual:** o sistema de early phases está criando actions diretamente como `pending` e mudando para `completed`. O Status canônico a ser adotado antes ou durante o uso do form no view será `running`.
- `completed`: Trabalhador avançou o passo.
- `failed`: Disparo rejeitado, payload errôneo, etc.
- `skipped`: Nó condicional ou fluxo bypassado.

## Transições e Comportamentos de Estado Canônicos
- Estado de Instância Inicial deve ser `active`. O primeiro node lógico deve gerar uma Action Execution `pending`/`running` instantaneamente.
- Estados Terminais (completed, cancelled, failed) são imutáveis e travam novas emissões de `advanceStep`.
- Branches condicionais devem gerar `skipped` em forks não percorridos se a engine for paralela, mas na engine estritamente linear só registra o nó da aresta correta.
- Retry futuro ocorrerá duplicando ActionExecution com retry-count, sem mutação direta do `failed` anterior.
