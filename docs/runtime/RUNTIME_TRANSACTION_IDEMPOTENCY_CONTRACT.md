# Runtime Transaction & Idempotency Contract

## Fronteiras Transacionais Esperadas (Contrato Canônico)

### 1. Start Process Boundary
Todas as ações abaixo devem ocorrer em um bloco atômico no banco:
- Validar versão e publicar se apropriado
- Criar a entidade base `Instance`
- Criar o `Payload` inicial
- Criar a 1ª `ActionExecution` apontada como estado inicial
- Gravar o event de auditoria
- Inserir fato na tabela `Outbox`

### 2. Advance Step Boundary
- Validar as instâncias
- Completar `ActionExecution` atual (fechar tempos e injetar outputPayload)
- Atualizar `currentStateId`
- Criar próxima `ActionExecution`
- Se for End, fechar `Instance Status`
- Gravar evento em banco
- Inserir no `Outbox`

## Comportamento Atual AS-IS (Identificação de Gaps)
O AS-IS hoje utiliza múltiplos `await insertX(db)` que abrem e fecham conexões implicitamente fora de uma transação.
Risco de gravação parcial: Se `logEvent` falhar no último milissegundo de `startProcessInstance`, o sistema já gravou a instância com sucesso e retorna erro ao Controller, mas o engine deixou o banco dessincronizado (a instância existe mas não retornou o handler HTTP com OK).

## Concorrência e Idempotência
- Não há bloqueios lógicos ou SQL locking pessimista/otimista.
- Disparar 2 chamadas de Advance ao mesmo tempo com o mesmo Token/Action pode gerar dupla escrita no step seguinte, ferindo consistência.
- **Idempotência (Futuro)**: Controllers passarão `X-Idempotency-Key` ou `Idempotency-Key` atrelado ao usuário/form.
- Event Log e Outbox são os únicos mecanismos seguros para evitar Webhooks duplicados, e portanto devem usar UUIDs estritos e transacionais atômicas.

Nenhuma implementação ou migration será realizada nesta fase.
