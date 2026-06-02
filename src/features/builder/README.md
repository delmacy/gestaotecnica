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

## Fase 05 — Canvas visual com React Flow

- `@xyflow/react` foi introduzido apenas na camada `canvas`.
- O domínio continua estritamente em `types/`.
- `BuilderNode` e `BuilderEdge` continuam sendo os modelos canônicos de negócio.
- O arquivo `builder-flow-adapter.ts` age como o adaptador convertendo o estado visual da tela de volta para o domínio do Builder e vice-versa.
- React Flow não atua como fonte da verdade. O estado canônico é gerido pelo hook `useBuilderEditorState`.
- Todo o estado continua existindo localmente em memória. Não há API, banco de dados ou runtime no momento.

## Fase 06 — Inspector por tipo de bloco

- O Inspector agora possui painéis específicos por tipo de bloco.
- As configurações são renderizadas de acordo com o `node.type` e gravadas em `node.config`.
- Tudo continua operando em estado local.
- Nenhuma ação real é executada. Notificações, documentos e integrações continuam atuando apenas como estruturas de *metadata*.
- Banco de dados, chamadas de API, runtime e registries ainda estão estritamente fora de escopo.

## Fase 07 — Validação visual do processo

- A tela agora usa o helper funcional `validateBuilderDraft`.
- Erros e avisos aparecem em tempo real no rodapé do Builder através de um painel de sumário (`BuilderValidationPanel`).
- O cabeçalho foi atualizado com metadados do estado local (`nome`, `nós`, `conexões`, indicador de alteração).
- `Warnings` (Avisos) apontam recomendações mas não bloqueiam o processo ou o estado (`valid: true`).
- `Errors` (Erros) apontam falhas arquiteturais graves e invalidam o draft (`valid: false`).
- A validação se mantém local. O estado em memória ainda não é persistido, e APIs/Runtime continuam fora de escopo.

## Fase 08 — Ações locais de rascunho

- O Builder agora permite renomear e descrever o draft na tela visual.
- O draft pode ser exportado como arquivo `JSON` local.
- Um draft pode ser importado via arquivo `JSON`, que automaticamente passa por verificação em runtime (`parseDraftJsonContent`) de validação estrutural antes de efetuar *replace* no estado de memória atual.
- A função *Reset* cria um novo rascunho.
- Tudo isso acontece localmente no client state. O código permanece perfeitamente puro sem acoplar chamadas de banco, APIs, persistência remota, registry ou runtime.
