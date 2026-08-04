# Status atual — System Builder

Atualizado em: 2026-08-04

Este é o único resumo operacional global do projeto. Detalhes pertencem às pastas de fase.

## Estado das frentes

| Frente | Estado | Última evidência aceita | Próximo gate | Bloqueio principal |
|---|---|---|---|---|
| F21 — Platform Hardening | `in_progress` | correções até `SB-CR-08` presentes na `main`; tasks de build e performance parcialmente abertas | concluir segurança crítica, validar CI e avançar pelos grupos B–E | `SB-CR-09` e validação integrada da sequência |
| UX-NAV-03 — Operator Loop | `validated_with_blocker` | closeout `UX-NAV-03-050` | executar E2E real com seed autenticado | usuário de teste/seed causa redirect para login |
| UX-NAV-04 — Builder Identity | `in_progress` | `UX-NAV-04-001` criou persistência durável de seleção de workspace | ligar sessão, API, UI e contextos Builder/admin/runtime | integração frontend/API fora da primeira task |
| ST-S01 — System Trading Pilot | `in_progress` | `ST-S01-007` validou visibilidade do workspace e capability | consolidar tasks restantes e closeout da sprint | ausência de closeout único da sprint |
| F22 — Multi-tenant & Workspace | `blocked` | planejamento em PR | iniciar `SB-MT-01` após F21 validada | depende da conclusão da F21 |
| F23 — Process Mirroring Engine | `planned` | planejamento em PR | revisão de duplicidade com componentes existentes | depende de F22 e inventário de reutilização |
| F24 — Capabilities Platform | `planned` | planejamento em PR | consolidar registry e módulos existentes antes de implementar | depende de F22 e revisão de duplicidade |
| F25 — Governance, RBAC & Security | `planned` | planejamento em PR | reconciliar RBAC existente com backlog proposto | depende de F22 |
| F26 — Workflow, Runtime & Frontend | `planned` | planejamento em PR | transformar tarefas de reconstrução em consolidação/extensão | depende de F24 e F25 |
| UX-NAV-06/07 e Federação | `future_gated` | contratos de extensão existentes | iniciar somente após UX atual, segurança e dados reais | gates de segurança, federação e portabilidade |

## Estado permitido

| Estado | Significado |
|---|---|
| `planned` | escopo proposto, ainda sem autorização de execução |
| `blocked` | planejado, mas depende de gate não cumprido |
| `ready` | contrato revisado e primeira task liberada |
| `in_progress` | há execução ativa e evidência parcial |
| `review` | implementação encerrada, aguardando revisão independente |
| `validated_with_blocker` | entrega validada, mas existe limitação explícita fora do escopo encerrado |
| `validated` | critérios de aceite e provas aprovados |
| `closed` | fase encerrada e documentação consolidada |
| `superseded` | substituída por outra fase ou contrato |

## Regras de atualização

- O status global só muda após atualização do `PROGRESS.md` da fase.
- Uma task só conta como concluída quando estiver `validated` ou `closed`.
- PR aberto é `implemented` ou `review`, nunca `validated`.
- Commit na `main` é `merged`, mas ainda pode exigir validação.
- Bloqueios devem ser objetivos, reproduzíveis e conter o próximo passo.
