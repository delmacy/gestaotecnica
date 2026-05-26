# Gestao Tecnica

Plataforma modular para gestao operacional de secao tecnica.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Documentacao

Os documentos de arquitetura ficam em `docs/`:

- `docs/00-analise-da-conversa.md`
- `docs/01-blueprint-modular.md`
- `docs/02-mvp-implementavel.md`
- `docs/03-modelo-de-dados.md`
- `docs/04-modulo-workitems.md`
- `docs/05-modulo-assets.md`
- `docs/06-modulo-service-orders.md`
- `docs/07-blueprint-core-workspaces-adaptacoes.md`

## Arquitetura

O projeto esta evoluindo de uma aplicacao unica da secao tecnica para um
**core operacional reutilizavel**, com modulos de dominio e adaptacoes por
workspace.

Camadas:

- `src/platform`: capacidades universais do core.
- `src/modules`: modulos reutilizaveis.
- `src/adaptations`: configuracoes por cliente/setor.
- `secao-tecnica`: primeira adaptacao real da plataforma.

A diretriz central e: o modulo universal nao conhece o cliente; a adaptacao
ensina o modulo a operar naquele cliente.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL com Drizzle ORM

## Fases

1. Fundacao tecnica.
2. MVP operacional.
3. Governanca e documentacao.
4. Planejamento, integracoes e BI.
