# System Builder Platform

Plataforma modular para montar sistemas operacionais sob medida por workspace,
packs contextuais, módulos reutilizáveis, actions, events, flows e adaptações
por cliente.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Documentação

Os documentos de arquitetura ficam em `docs/`:

- `docs/00-analise-da-conversa.md`
- `docs/01-blueprint-modular.md`
- `docs/02-mvp-implementavel.md`
- `docs/03-modelo-de-dados.md`
- `docs/04-modulo-workitems.md`
- `docs/05-modulo-assets.md`
- `docs/06-modulo-service-orders.md`
- `docs/07-blueprint-core-workspaces-adaptacoes.md`
- `docs/manual-edicao-configuracao-modulos.md`
- `docs/manual-kernel-plugins-packs.md`
- `docs/architecture/platform-kernel.md`
- `docs/integracoes-api-gateway.md`
- `docs/packs-contextuais-adaptacoes.md`
- `docs/modulos/README.md`
- `docs/modulos/workspace-config.md`
- `docs/modulos/*.md`
- `docs/adaptacoes/README.md`
- `docs/adaptacoes/secao-tecnica.md`
- `docs/base/possiveis-alteracoes-de-schema.md`

## Arquitetura

O projeto deve ser lido como uma **system builder platform**, não como um
sistema único de gestão técnica. A Seção Técnica é a primeira adaptação real,
usada para validar o core, mas não define o limite do produto.

A plataforma combina um core operacional reutilizável, módulos de domínio,
packs contextuais e adaptações por workspace.

Camadas:

- `src/platform`: capacidades universais do core.
- `src/modules`: módulos reutilizáveis.
- `src/adaptations`: configurações por cliente, setor ou operação.
- `secao-tecnica`: primeira adaptação real, tratada como client/domain pack.
- `/workspace-config`: leitura da adaptação ativa e mapa dos módulos.
- `/auth/login` e `/auth/setup`: autenticação local inicial.
- `/admin`: administração de usuários, workspace, workflows, permissões e filas.

A diretriz central é: o módulo universal não conhece o cliente; a adaptação
ensina o módulo a operar naquele cliente.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL com Drizzle ORM

## Fases

1. Fundação técnica.
2. MVP operacional.
3. Governança e documentação.
4. Planejamento, integrações e BI.
