# Runtime Definition Compatibility

## Formatos auditados na base de código
A definição extraída do Builder está chegando no banco (JSON) em uma estrutura heterogênea, com adaptadores instáveis.

### Comportamento AS-IS
No arquivo `runtime-step.service.ts`, há o uso desta técnica agressiva/defensiva de leitura:
```typescript
function extractNodesAndEdges(definitionJson: any) {
  const nodes = definitionJson?.nodes || definitionJson?.draft?.nodes || [];
  const edges = definitionJson?.edges || definitionJson?.draft?.edges || [];
  return { nodes, edges };
}
```

### Contrato Futuro Canônico
A persistência da `ProcessVersion` (Publicação) **nunca deve conter `draft` no nível top-level**. Um version record publicado deve conter a representação exata e tipada de `RuntimeProcessGraph` ou similar (ex: `DefinitionV1`). O fallback para `draft.nodes` foi uma contingência da Fase de UI.

**Mapeamento de chaves lógicas:**
- O atributo `id` de um nó visual no frontend React Flow se tornará conceitualmente o `actionKey` canônico para o motor (já está assim no AS-IS, que busca node id e preenche actionKey).
- Edge `source` e `target` usarão essa ActionKey unificada.

A compatibilidade atual requer um "Anti-Corruption Layer" que limpe a definição vinda do Builder antes da query do motor rodar, convertendo JSONs não-validados em instâncias Zod validadas no momento da inicialização do fluxo (futuro).

## Compatibility Policy

A new version is considered incompatible (breaking) if it violates any of the following rules:

- **Removed Node**: A node that existed in the previous version is missing in the new version.
- **Changed Action**: A node's `actionKey` has changed compared to the previous version.
- **Changed Payload**: A node's configuration (`config`) has changed (determined by a basic deep equal check).

If any of these conditions are met, the version update will trigger blockers, marking the change as breaking.

## Non-Goals

The following aspects are explicitly excluded from the definition compatibility check:

- Visual or structural layout changes (e.g., node coordinates).
- Backward-compatible additions (e.g., adding new nodes or edges).
- Semantic correctness of business logic inside nodes.
