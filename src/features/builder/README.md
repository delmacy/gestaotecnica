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

## Fase 04 — Shell visual

- A rota `/builder` foi criada.
- O layout visual possui três áreas: biblioteca (esquerda), canvas placeholder (centro) e inspetor (direita).
- O estado do editor (`BuilderEditorState`) ainda é local, persistindo em memória.
- Ainda não há implementação real com React Flow (usamos um placeholder no momento).
- Ainda não há persistência ou API atrelada.
- O canvas real, com nós arrastáveis e rotas, será conectado em fase posterior.

## Fase 04B — Correção de escopo

- A rota `/builder` agora usa o shell reduzido em `src/features/builder`.
- O código antigo em `src/builder/*` permanece legado/experimental e não é a rota principal do MVP reduzido.
- React Flow será introduzido somente na próxima fase.
- Não há server actions, API, banco, timeline ou persistência nesta tela.
