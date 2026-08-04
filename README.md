# System Builder Platform

System Builder é uma plataforma para transformar trabalho real recorrente em processos formais, mensuráveis, adaptáveis e automatizáveis.

A plataforma suporta modelagem modular por workspaces e usa Process Candidates como ponte entre observação da realidade e processo governado. A Gestão Técnica é a primeira adaptação real, e o System Trading é um piloto de plataforma. O produto pode ser orquestrado por agentes, mas Postgres e contratos do System Builder permanecem como fonte de verdade.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Documentação

Pontos de entrada:

1. `AGENTS.md` — regras para humanos e agentes.
2. `docs/README.md` — arquitetura da documentação.
3. `docs/current/STATUS.md` — estado atual verificável.
4. `docs/current/ROADMAP.md` — fases, dependências e gates.
5. `docs/phases/<ID>/` — escopo, tasks e progresso de cada fase/sprint.
6. `docs/agents/OPERATING_MODEL.md` — processo de execução por agentes.

`docs/archive/` preserva histórico e não é fonte de status atual.

## Arquitetura

O projeto deve ser lido como uma **System Builder Platform**, não como um sistema único de Gestão Técnica.

Camadas principais:

- `src/platform`: capacidades universais do core.
- `src/modules`: módulos reutilizáveis.
- `src/adaptations`: configurações por cliente, setor ou operação.
- `system-building`: tenants, pilotos e ferramentas externas ao core quando aplicável.
- PostgreSQL com separação lógica por schemas e escopo de workspace.

A diretriz central é: o módulo universal não conhece o cliente; a adaptação instala e configura o módulo para aquele contexto.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL
- Drizzle ORM

## Fase atual

Consulte sempre `docs/current/STATUS.md`. No momento da reestruturação documental, a frente principal é F21 Platform Hardening; F22–F26 permanecem bloqueadas ou planejadas conforme seus gates.
