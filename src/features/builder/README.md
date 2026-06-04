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

## Fase 09 — Persistência local com autosave

- O draft agora é salvo automaticamente no cache local do navegador (`localStorage`) a cada alteração utilizando *debounce*.
- Ao retornar à tela `/builder`, o último draft válido trabalhado é restaurado automaticamente.
- O autosave é inteiramente focado na experiência do usuário (prevenir perda acidental de dados no navegador) e *não* representa persistência oficial (salvamento em banco de dados).
- O usuário possui uma ação visual via painel superior para intervir limpando o rascunho do cache.
- Banco de dados, API, runtime e process definitions seguem estritamente fora do escopo.

## Fase 10 — Preview local do processo

- O Builder agora possui um modo `Preview` que pode ser alternado pelo cabeçalho superior.
- O Preview é inteiramente simulado no client state;
- Ele não cria process instances no banco, nem engatilha processamento de automações assíncronas reais.
- Não há runtime formal ou persistência atrelada a ele, apenas um wrapper por cima do `BuilderDraft`.
- A navegação ocorre iterando os `BuilderEdge`s entre os source/targets do *canvas*.
- Cada tipo de nó listado no `block-catalog` apresenta uma representação customizada e amigável durante o runtime simulado.
- Eventos, actions externas e o gateway da arquitetura também não foram tocados ou inseridos nesta view.

## Fase 11 — Preparação para persistência oficial

- Foram preparados contratos estritos e schemas Drizzle mapeando `workflow.process_definitions` e `workflow.process_versions`.
- A UI do Builder ainda NÃO salva no banco. O fluxo de `localStorage` continua sendo usado apenas como um *autosave local*.
- A persistência oficial (salvar em Postgres via `drizzle-orm`) será implementada e conectada na próxima fase.
- Runtime real, Event Store, `registry` e tabelas de instâncias continuam estritamente fora do escopo.

## Fase 12 — Serviço de persistência preparado

- Foi criada a camada `server-side` para inserir logicamente Process Definitions e as suas Versions incrementais atreladas usando Drizzle ORM.
- Foram introduzidas subcamadas rigorosas para erros (`process-definition.errors.ts`) e injeções de DB isoladas (`process-definition.repository.ts`).
- A UI **ainda não invoca** este serviço, nem exporta um botão "Salvar". O builder continua restrito ao seu ciclo de memória em localStorage.
- A persistência oficial do fluxo via UI será unificada no layout principal apenas na próxima fase.

## Fase 14 — Salvamento oficial pela UI

- O Builder agora possui botão de salvamento oficial.
- localStorage continua sendo autosave local.
- Salvamento oficial usa a camada server/API da Fase 13.
- Esta fase ainda não cria runtime, events ou registry.
- WorkspaceId temporário deve ser substituído por workspace real em fase futura, se aplicável.
