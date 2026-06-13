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
