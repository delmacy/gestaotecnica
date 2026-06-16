# Process Node and Edge Schema (PKG-PROCESS-NODE-EDGE-SCHEMA-001)

## Objetivo
Definir os contratos canônicos mínimos para os elementos que compõem o grafo de um processo: Nodes (Nós) e Edges (Arestas). Estes schemas garantem a integridade estrutural básica de cada elemento individualmente.

## Process Node

Representa uma etapa ou ponto de controle no fluxo de trabalho.

### Tipos de Node
- `start`: Ponto de entrada do processo.
- `action`: Execução de uma tarefa automatizada.
- `decision`: Ponto de ramificação lógica.
- `form`: Interação humana via formulário.
- `wait`: Pausa na execução aguardando evento ou tempo.
- `subprocess`: Invocação de outro processo.
- `end`: Ponto de terminação do fluxo.

### Posição
Cada nó possui uma posição `(x, y)` no canvas, aceitando números finitos (incluindo negativos).

### Campos Condicionais
- Se `type === 'action'`, o campo `actionKey` é obrigatório.
- Se `type === 'form'`, o campo `formKey` é obrigatório.
- Se `type === 'subprocess'`, o campo `subprocessDefinitionKey` é obrigatório.

## Process Edge

Representa a transição entre dois nós.

### Tipos de Edge
- `default`: Transição padrão.
- `conditional`: Transição baseada em uma expressão lógica.
- `error`: Transição seguida em caso de erro no nó de origem.
- `timeout`: Transição seguida em caso de estouro de tempo no nó de origem.

### Condition
Obrigatória para edges do tipo `conditional`.
- `expression`: String com a lógica (máx 4000 caracteres).
- `language`: `expression` ou `json_logic`.

### Priority
Inteiro não negativo (`>= 0`) usado para determinar a ordem de avaliação das arestas que partem de um mesmo nó.

## Limites Semânticos e Validação de Grafo
Neste pacote, a validação é restrita à estrutura individual de cada objeto.
**Não são validados neste momento:**
- Conectividade do grafo.
- Existência de ciclos.
- Unicidade de `priority`.
- Existência dos IDs referenciados em `sourceNodeId` e `targetNodeId`.
- Regras de "self-loop".

Estas validações serão tratadas em pacotes de validação de grafo futuros.

## Exemplos

### Node (Action)
```json
{
  "id": "uuid-v4",
  "key": "send-email-node",
  "type": "action",
  "name": "Enviar E-mail",
  "position": { "x": 100, "y": 200 },
  "config": {},
  "actionKey": "email-service"
}
```

### Edge (Conditional)
```json
{
  "id": "uuid-v4",
  "sourceNodeId": "node-a-id",
  "targetNodeId": "node-b-id",
  "type": "conditional",
  "priority": 1,
  "condition": {
    "expression": "status == 'approved'",
    "language": "expression"
  }
}
```

## Próximos Pacotes
- `PKG-PROCESS-DEFINITION-ENVELOPE-INTEGRATION-001`: Integração destes schemas ao `ProcessVersionSchema`.
- `PKG-PROCESS-GRAPH-VALIDATION-001`: Lógica de validação de integridade do grafo.
- `PKG-PROCESS-DEFINITION-MAPPER-001`: Mapeadores para persistência e runtime.
- `PKG-PROCESS-EXPRESSION-CONTRACT-001`: Refinamento dos contratos de expressões.
