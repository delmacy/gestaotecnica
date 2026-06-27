# Sprint 09 — Segurança e observabilidade

## SB-S09-T41 — Logging estruturado e redaction
Desenvolvimento paralelo. Padronizar logs com correlationId, workspaceId, actorId, module e action key. Aceite: secrets e PII sensível são removidos antes da gravação.

## SB-S09-T42 — Health, readiness e métricas
Desenvolvimento paralelo. Criar liveness, readiness, dependency checks e métricas de latência, erros e falhas de eventos. Aceite: serviço vivo porém sem banco não é marcado como ready.

## SB-S09-T43 — Auditoria e diagnóstico de suporte
Desenvolvimento após T41. Criar views tenant-aware para ações administrativas, publicação e incidentes. Aceite: suporte não acessa outro tenant sem autorização explícita e auditada.

## SB-S09-T44 — Threat model e revisão de segurança
Review após T41 a T43. Avaliar autenticação, autorização, tenant isolation, webhooks, secrets, uploads, logs e supply chain. Entrega: riscos priorizados e remediation tasks.

## SB-S09-T45 — Testes de falha e incidentes
Teste após T44. Simular banco indisponível, falha de event write, publicação incompleta, brute force, cross-tenant e integração degradada. Aceite: erro sanitizado, alerta e runbook correspondente.

## Prompt Jules
Busque a task `<ID>` em `docs/product-roadmap/sprint-09-security-observability/README.md` e anexe evidências técnicas ao PR.