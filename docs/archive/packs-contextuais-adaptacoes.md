# Packs Contextuais e Adaptações por Cliente

## Objetivo

Embora cada módulo possa existir individualmente, a implantação real deve ser
feita por packs contextuais. Isso evita vender ou ativar um módulo sem as
dependências operacionais necessárias.

Exemplo: um cliente que usa `workforce` normalmente precisa de `schedules` e
`shifts` para lançamento de horários, escala, turno e disponibilidade.

## Operações de Campo e Atendimento

Contexto: operação técnica, campo, manutenção, suporte interno, facilities ou
atendimento operacional.

Obrigatórios: `work-items`, `service-orders`, `assets`, `workforce`, `schedules`, `shifts`.

Recomendados: `evidences`, `comments`, `events`, `reports`, `workflow-engine`.

## Planejamento e Recursos

Contexto: planejamento operacional, engenharia, recursos, manutenção preventiva
ou gestão de capacidade.

Obrigatórios: `maintenance-plans`, `technical-projects`, `acquisitions`, `resource-needs`.

Recomendados: `suppliers`, `inventory`, `reports`, `documents`, `workflow-engine`.

## Governança Documental

Contexto: qualidade, secretaria operacional, conformidade, auditoria ou
governança documental.

Obrigatórios: `documents`, `reports`, `approvals`, `legacy`.

Recomendados: `evidences`, `compliance`, `automations`, `events`.

## Integrações e Automações

Contexto: TI, integrações, automações, conectores, RPA e sistemas legados.

Obrigatórios: `automations`, `legacy`, `events`.

Recomendados: `reports`, `documents`, `workflow-engine`, `workspace-config`.

## Manual de adaptação

1. Escolha o pack contextual principal.
2. Ative os módulos obrigatórios.
3. Escolha módulos recomendados conforme maturidade do cliente.
4. Configure terminologia em `src/adaptations/<cliente>/terminology.ts`.
5. Configure tipos, status, filas, workflows e templates.
6. Exponha apenas as APIs necessárias via gateway.
7. Registre plugins externos em `integration_plugins`.
8. Use webhooks e eventos para integrar sem acoplar o core ao sistema do cliente.

## Regra de decisão

Módulo é capacidade. Pack é contexto operacional. Adaptação é linguagem e regra
do cliente.

Essa separação permite que a plataforma funcione como builder expansível,
semelhante a extensões de navegador: o core fornece contratos, os packs
organizam capacidades e os plugins ampliam a execução.
