# System Builder Platform

System Builder é uma plataforma para transformar trabalho real recorrente em processos formais, mensuráveis, adaptáveis e automatizáveis.

A plataforma suporta a modelagem modular por workspaces, incorporando "Process Candidates" como a etapa vital de descoberta, permitindo que agentes no futuro e humanos no presente formalizem elicitações da operação. A Gestão Técnica é a primeira adaptação, usada para validar o core. O produto é *Paperclip-ready* (pronto para ser orquestrado por agentes através de um futuro Agent Gateway), mas nunca dependente dele ou refém de automações não aprovadas.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Documentação

A documentação principal do projeto agora segue uma nova estrutura de diretórios e o ponto de entrada para LLMs e desenvolvedores é o `AGENTS.md`.

Inicie a leitura e o contexto lendo os seguintes arquivos:
- `AGENTS.md` (Contém as diretrizes arquiteturais ativas e o index da documentação).
- `docs/00-current/STATUS_DAS_FASES.md` (Para saber em qual fase estamos).
- `docs/00-current/DECISOES_ATIVAS.md` (Para entender regras técnicas vigentes).
- `docs/00-current/NEXT_PHASE.md` (Qual a próxima fase e objetivos).

As outras pastas em `docs/` (`10-roadmap`, `20-architecture`, `30-modules`, `40-adaptations`, `50-reference`) contêm os antigos arquivos de arquitetura e blueprint.

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
