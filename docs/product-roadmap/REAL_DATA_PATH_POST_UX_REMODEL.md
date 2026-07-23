# Real Data Path Post-UX Remodel

Este documento remodela `RD-03` e posteriores para absorver a extensao `UX-NAV-06` e `UX-NAV-07`. A mudanca e importante porque, depois de abrir o escopo de UX completa, federacao e portabilidade, o Real Data Path nao deve apenas trocar mocks por banco: ele deve provar dados reais dentro da experiencia projetada.

## Decisao

`RD-03` a `RD-06` devem ficar gated atras de `UX-NAV-07`.

Motivo:
- `UX-NAV-06` define contrato visual de navegacao, Capability Marketplace, simulacao antes de publicar, Blueprint Diff e Policy Studio.
- `UX-NAV-07` define UX de instancias federadas, suporte remoto, Data Lineage, Instance Handoff Pack e Exit Readiness.
- `RD-03+` precisa consumir esses contratos para demonstrar dados reais sem criar telas desconectadas, menus incompletos ou evidencias tecnicas sem experiencia de produto.

## Remodelagem por sprint

### RD-03 - Builder real-data binding through navigation contracts

Novo objetivo: vincular superficies do Builder a dados persistidos respeitando o contrato visual de navegacao, a origem/destino de cada tela, labels real/synthetic e os fluxos de decisao definidos em `UX-NAV-06`.

Mudancas de enfoque:
- Marketplace de capabilities passa a ser a porta natural para registry/capability data.
- Form Builder, Workflow Builder e Tasker precisam mostrar entrada, acao, proximo passo e retorno.
- Empty/error/setup states precisam ser acionaveis, nao fallback sintetico silencioso.
- A smoke suite deve provar navegacao + dados, nao apenas query.

### RD-04 - Runtime real work journey

Novo objetivo: criar e avancar trabalho real a partir do fluxo visual esperado, com runtime, permissao e estado de navegacao coerentes.

Mudancas de enfoque:
- Criar trabalho real deve nascer de form/process publicado ou blocker honesto.
- Avancar trabalho deve gerar proxima acao visivel e retorno previsivel.
- Runtime views devem respeitar workspace, membership e estados de erro definidos em UX.
- E2E precisa cobrir jornada humana, nao apenas service/action.

### RD-05 - Evidence, lineage and receipts

Novo objetivo: provar trabalho real com timeline, receipts e Data Lineage, usando os contratos de `UX-NAV-07`.

Mudancas de enfoque:
- Receipts devem mostrar actor, workspace, instance quando aplicavel, correlation e source.
- Lineage deve diferenciar form, API, import, workflow, seed e acao manual.
- Redaction visual e seguranca de evidencia viram parte do aceite.
- O relatorio de evidencia deve ser legivel para cliente, operador e auditor.

### RD-06 - Demo, portability and commercial readiness

Novo objetivo: fechar o Real Data Path com demo operacional, runbook, mock backlog, handoff pack inicial e Exit Readiness.

Mudancas de enfoque:
- Demo script deve atravessar Builder, Runtime, Evidence e pelo menos um ponto de portabilidade.
- Mock backlog deve classificar mocks restantes por impacto comercial e risco de lock-in.
- Release gate deve bloquear claims comerciais se login, dados reais, auditabilidade ou exportabilidade estiverem quebrados.
- Signoff deve declarar o que pode e nao pode ser prometido para clientes isolados/federados.

## Regras de materializacao

1. Remodelar somente tasks ainda `planned_gated`.
2. Preservar IDs `RD-03-*` a `RD-06-*` para nao quebrar referencias existentes.
3. Atualizar titulos, objetivos, dependencias e prompts para dependerem de `UX-NAV-07`.
4. Nao liberar `RD-03` ate `RD-02`, `UX-NAV-01..07` fecharem limpos.
5. Qualquer implementacao remota/federada real fica fora de RD; RD pode apenas consumir contratos, labels, lineage e portabilidade inicial.

