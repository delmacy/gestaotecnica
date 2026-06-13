# Runtime State Machine Contract

## 1. Início da Instância
- **Comportamento atual**: A API de `startProcessInstance` cria a row no banco com status 'active'.
- **Contrato Canônico**: A inicialização deve ler o Graph da Version, determinar o `initial node` e além de criar a instância, automaticamente injetar a primeira `action_execution` como ativa no BD, apontando para a `actionKey` do initial node.

## 2. Avanço Linear (Path finding)
- **Comportamento atual**: Lê as edges, pega as com `source = currentActionKey`, e usa a primeira que retornar no Array `outgoingEdges[0]`.
- **Contrato Canônico**: Se o nó for estrito, e não for condicional, a restrição de "Apenas uma edge de saída válida" deve ser respeitada. Se houver mais de uma, o sistema hoje não implementa *branches* condicionalmente; portanto, o uso simplório de `outgoingEdges[0]` é um comportamento AS-IS mas frágil.
- **Classificação**: `partially_implemented`.

## 3. Branches e Condições
- **Comportamento atual**: Não suportado na lógica (apenas visual no builder).
- **Contrato Canônico**: A verificação da edge de saída no node "Condition" precisará executar expressões do payload contra a edge.
- **Classificação**: `future`.

## 4. Approvals & Handoffs
- **Comportamento atual**: Steps são "completados" de imediato em transições de UI sintéticas (early phases).
- **Contrato Canônico**: Avanço exigirá check de Governance Matrix baseada em Roles e Action definitions se for humana; Handoff gerará uma task com status "running" aguardando fila.
- **Classificação**: `contract_only`.

## 5. Atualização de currentStateId
- **Comportamento atual**: Há coluna na ProcessInstance `currentStateId`, mas não há evidência de sua atualização robusta no path-finding (Update ocorre apenas nas actions do DB).
- **Contrato Canônico**: A instância de processo sempre armazenará ponteiro para a StepExecution corrente.
- **Classificação**: `contract_only` / `blocked` sem transações completas.

## 6. Nós Finais e Conclusão
- **Comportamento atual**: Quando `outgoingEdges` é zero ou tipo do Node alvo é "end", marca como completed.
- **Contrato Canônico**: Node final atinge estado `completed`. Status imutável da instância.
- **Classificação**: `implemented`.

## 7. Retry, Falha, e Timeout
- **Contrato Canônico**: Falhas no motor param a fila (dead-letter). Ação fica `failed`. Retry futuro gera um clone da action no BD (Nova row de execution com trial=2) referenciando o mesmo ActionKey.
- **Classificação**: `future`.
