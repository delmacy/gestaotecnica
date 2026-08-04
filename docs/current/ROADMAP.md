# Roadmap canônico

Este roadmap define ordem e gates. Ele não substitui os catálogos de tasks de cada fase.

## Sequência principal

```text
F21 Platform Hardening
  ↓
F22 Multi-tenant & Workspace Foundation
  ├──→ F23 Process Mirroring Engine
  └──→ F25 Governance, RBAC & Security
          ↓
F24 Capabilities Platform
          ↓
F26 Workflow, Runtime & Frontend Parity
```

## Trilhas paralelas controladas

```text
UX-NAV-03 → UX-NAV-04 → revisão UX atual → UX-NAV-06 → UX-NAV-07

ST-S01 System Trading Pilot
  └── valida o System Builder como plataforma multi-workspace/capability
```

## Gates

### Gate F21 → F22

- isolamento por `workspaceId` validado por testes;
- autenticação do gateway sem API key global;
- RLS ou decisão arquitetural formal equivalente;
- lint, typecheck, testes e build executáveis por um comando;
- tarefas críticas da auditoria fechadas ou bloqueios aceitos explicitamente.

### Gate F22 → F23/F25

- identidade e membership resolvidas no servidor;
- workspace ativo persistido em PostgreSQL e validado por membership;
- suíte de isolamento entre dois tenants;
- onboarding e configuração de workspace com contratos estáveis.

### Gate F23/F25 → F24

- Process Candidate e processo publicado possuem ciclo de vida estável;
- roles, policies e permissões protegem operações sensíveis;
- catálogo de capabilities não duplica módulos já existentes.

### Gate F24/F25 → F26

- capabilities instaláveis por workspace;
- engine existente inventariada e reaproveitada;
- contratos de workflow, runtime, eventos e formulários reconciliados;
- gaps de frontend registrados por módulo.

### Gate UX-NAV-04 → UX futuro

- seleção de workspace durável na UI;
- Builder, admin e runtime compartilham o mesmo contexto autorizado;
- jornada real com seed reproduzível;
- nenhum dado sintético apresentado como evidência real.

## Regra contra reconstrução

Antes de qualquer task das fases F23–F26, deve existir uma task de inventário com três resultados possíveis:

- `reuse`: usar implementação existente;
- `extend`: ampliar implementação existente;
- `replace`: substituir mediante decisão e plano de migração.

Implementar do zero sem esse inventário bloqueia a task.
