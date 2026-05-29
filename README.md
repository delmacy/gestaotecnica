# System Builder Platform

Plataforma modular para montar sistemas operacionais sob medida por workspace,
blueprints, módulos reutilizáveis, actions, events, workflows e adaptações por
cliente.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Documentação

Os documentos de arquitetura ficam em `docs/`:

- `docs/00-system-builder-essencia.md`
- `docs/foundation/MANIFESTO.md`
- `docs/foundation/AI_CONSTITUTION.md`
- `docs/foundation/ONTOLOGY.md`
- `docs/foundation/MASTER_BLUEPRINT_PROMPT.md`
- `docs/database/DATABASE_STRATEGY.md`
- `docs/roadmap/IMPLEMENTATION_PLAN.md`
- `docs/03-modelo-de-dados.md`
- `docs/manual-edicao-configuracao-modulos.md`
- `docs/manual-kernel-plugins-packs.md`
- `docs/architecture/platform-kernel.md`
- `docs/integracoes-api-gateway.md`
- `docs/packs-contextuais-adaptacoes.md`
- `docs/modulos/README.md`
- `docs/modulos/workspace-config.md`
- `docs/modulos/*.md`
- `docs/adaptacoes/README.md`
- `docs/base/possiveis-alteracoes-de-schema.md`

## Arquitetura

O projeto deve ser lido como uma **system builder platform**, não como um
sistema operacional aplicado único. A plataforma e seus blueprints devem permanecer
separados: o core representa capacidades, processos, eventos, documentos,
actions e governança; clientes e setores entram como adaptações aplicadas.

A plataforma combina um core operacional reutilizável, módulos de domínio,
packs contextuais e adaptações por workspace.

Camadas:

- `src/platform`: capacidades universais do core.
- `src/modules`: módulos reutilizáveis.
- `src/adaptations`: configurações por cliente, setor ou operação.
- `system-builder`: adaptação baseline de desenvolvimento da própria plataforma.
- `/workspace-config`: leitura da adaptação ativa e mapa dos módulos.
- `/auth/login` e `/auth/setup`: autenticação local inicial.
- `/admin`: administração de usuários, workspace, workflows, permissões e filas.

A diretriz central é: o módulo universal não conhece o cliente; a adaptação
ensina o módulo a operar naquele cliente. A tecnologia deve espelhar a operação
antes de estabilizar, medir, melhorar ou automatizar.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL com Drizzle ORM

## Fases

1. Fundação da plataforma.
2. MVP operacional.
3. Governança e documentação.
4. Planejamento, integrações e BI.
