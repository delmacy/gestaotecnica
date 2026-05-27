# Packs Contextuais e Adaptacoes por Cliente

## Objetivo

Embora cada modulo possa existir individualmente, a implantacao real deve ser feita por packs contextuais. Isso evita vender ou ativar um modulo sem as dependencias operacionais necessarias.

Exemplo: um cliente que usa `workforce` normalmente precisa de `schedules` e `shifts` para lancamento de horarios, escala, turno e disponibilidade.

## Operacoes Tecnicas

Departamento: Operacao / Sala Tecnica.

Obrigatorios: `work-items`, `service-orders`, `assets`, `workforce`, `schedules`, `shifts`.

Recomendados: `evidences`, `comments`, `events`, `reports`, `workflow-engine`.

## Planejamento e Recursos

Departamento: Planejamento / Gestao Tecnica.

Obrigatorios: `maintenance-plans`, `technical-projects`, `acquisitions`, `resource-needs`.

Recomendados: `suppliers`, `inventory`, `reports`, `documents`, `workflow-engine`.

## Governanca Documental

Departamento: Secretaria Tecnica / Qualidade.

Obrigatorios: `documents`, `reports`, `approvals`, `legacy`.

Recomendados: `evidences`, `compliance`, `automations`, `events`.

## Integracoes e Automacoes

Departamento: TI / Integracoes.

Obrigatorios: `automations`, `legacy`, `events`.

Recomendados: `reports`, `documents`, `workflow-engine`, `workspace-config`.

## Manual de adaptacao

1. Escolha o pack contextual principal.
2. Ative os modulos obrigatorios.
3. Escolha modulos recomendados conforme maturidade do cliente.
4. Configure terminologia em `src/adaptations/<cliente>/terminology.ts`.
5. Configure tipos, status, filas, workflows e templates.
6. Exponha apenas as APIs necessarias via gateway.
7. Registre plugins externos em `integration_plugins`.
8. Use webhooks e eventos para integrar sem acoplar o core ao sistema do cliente.

## Regra de decisao

Modulo e capacidade. Pack e contexto operacional. Adaptacao e linguagem/regra do cliente.

Essa separacao permite que a plataforma funcione como builder expansivel, semelhante a extensoes de navegador: o core fornece contratos, os packs organizam capacidades e os plugins ampliam a execucao.
