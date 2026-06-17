# Integration Report: PKG-PROCESS-DEFINITION-ENVELOPE-INTEGRATION-001

## Sumário da Execução

A tarefa integrou os contratos de nós (`ProcessNode`) e arestas (`ProcessEdge`) ao envelope versionado de definição de processo (`ProcessVersion`), eliminando a fragmentação e implementando regras de integridade de grafo.

## Alterações Realizadas

### Contratos (`src/platform/workflows/contracts/process-definition.ts`)

1.  **Refatoração de `ProcessVersionSchema`**:
    *   Remoção do campo interno `definition`.
    *   Inclusão direta de `schemaVersion`, `nodes` (ProcessNodeSchema[]) e `edges` (ProcessEdgeSchema[]) no corpo da versão.
    *   Implementação de `superRefine` para validar:
        *   Unicidade de IDs de nós.
        *   Unicidade de IDs de arestas.
        *   Integridade referencial de arestas (`sourceNodeId` e `targetNodeId` devem apontar para nós existentes).
2.  **Implementação de `ProcessDefinitionEnvelopeSchema`**:
    *   Exportado como o envelope canônico agregador.
    *   Composição: `{ definition: ProcessDefinition, version: ProcessVersion, nodes: ProcessNode[], edges: ProcessEdge[] }`.
    *   Validação de consistência entre o grafo no topo do envelope e o grafo dentro da versão.
3.  **Imutabilidade**:
    *   Ambos os schemas (`ProcessVersion` e `ProcessDefinitionEnvelope`) utilizam `.transform((data) => Object.freeze(data))` para garantir que o input validado não seja mutado.
4.  **Estreiteza (Strictness)**:
    *   Todos os schemas utilizam `.strict()` para rejeitar campos desconhecidos.

## Forma Final do Envelope Canônico

```ts
{
  definition: ProcessDefinition;
  version: ProcessVersion;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}
```

Onde `version` também contém `nodes` e `edges` de forma plana.

## Compatibilidade Preservada

*   **Exports**: Todos os exports públicos de `ProcessDefinitionSchema`, `ProcessVersionSchema` e `ProcessDefinitionKeySchema` foram preservados.
*   **Campos**: Os campos de metadados da versão (id, workspaceId, etc.) permanecem inalterados.
*   **Transição**: A remoção do campo `definition` em favor do achatamento (flattening) requer atualização em consumidores que acessavam `version.definition.nodes`, agora acessando `version.nodes`.

## Regras Implementadas

*   IDs de nós únicos por versão.
*   IDs de arestas únicos por versão.
*   Integridade de `sourceNodeId` e `targetNodeId`.
*   Campos obrigatórios para `action`, `form` e `subprocess`.
*   Imutabilidade via `Object.freeze`.
*   Rejeição de campos desconhecidos.

## Regras Explicitamente Adiadas (Fora de Escopo)

*   Detecção de ciclos.
*   Validação de nó inicial/final único.
*   Acessibilidade (reachability).
*   Validação de existência de subprocessos ou ações no registro.

## Verificação e Testes

*   Novos testes em `tests/unit/process-definition-envelope.test.ts` cobrindo 100% dos requisitos de integridade.
*   Testes existentes em `tests/unit/process-*.test.ts` adaptados e validados.
*   `npm run build` aprovado.
