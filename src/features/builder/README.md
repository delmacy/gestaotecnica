# Builder Feature

Esta pasta contém a fundação do Builder visual do System Builder.

O Builder usa o n8n apenas como referência de UX.
O modelo interno é independente de React Flow.
React Flow/xyflow será adaptador visual futuro, não domínio.
Esta fase contém apenas tipos, catálogo de blocos, serialização e validação.
UI, canvas, rotas, API, banco e runtime virão em fases futuras.

## Estrutura

```text
types/
  Contratos TypeScript do Builder.

block-library/
  Catálogo inicial de blocos disponíveis.

process-editor/
  Helpers para criação, serialização e validação de drafts.
```

## Regra arquitetural

> O domínio do Builder não deve depender da biblioteca visual usada para desenhar o canvas.
