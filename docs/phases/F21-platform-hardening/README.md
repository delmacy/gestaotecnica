# F21 — Platform Hardening

Status: `in_progress`

## Objetivo

Corrigir riscos críticos e altos identificados na auditoria técnica antes de ampliar o produto: isolamento multi-tenant, autenticação, performance, build/CI, qualidade, testes e observabilidade.

## Resultado de produto

Uma base segura e verificável na qual novas fases possam operar sem vazamento entre workspaces, dependência de chaves globais, builds imprevisíveis ou ausência de gates automatizados.

## Escopo incluído

- segurança e isolamento por workspace;
- autenticação do gateway;
- performance de cache, queries e outbox;
- lint, typecheck, testes, build e CI;
- refatorações necessárias para testabilidade;
- observabilidade e operação básica.

## Fora de escopo

- funcionalidades do System Trading;
- expansão funcional de Process Mirroring, capabilities ou workflow;
- redesenho amplo de UX;
- novas features sem relação com a auditoria.

## Dependências

- auditoria técnica e backlog de correção;
- regras de `AGENTS.md`;
- contratos de isolamento e frontend parity.

## Gate de saída

- tasks críticas de segurança validadas;
- teste explícito entre dois workspaces;
- autenticação sem API key global;
- decisão e implementação de proteção no banco;
- `validate:all` ou equivalente reproduzível;
- tarefas restantes classificadas como fechadas, transferidas ou bloqueadas com decisão aceita.

## Definição de pronto

A fase termina somente quando os grupos A–E possuem fechamento verificável e o `docs/current/STATUS.md` libera F22.

## Fontes legadas

- planejamento original em `docs/archive/planning/mvp/PHASE_21.md` na branch/PR de planejamento;
- auditoria técnica correspondente;
- commits e PRs `SB-CR-*`, `SB-PF-*`, `SB-BI-*`, `SB-QT-*`, `SB-OI-*`.
