# Possiveis Alteracoes Futuras de Base

Este documento registra pontos do schema atual que sao aceitaveis para o MVP,
mas que podem evoluir quando a plataforma precisar suportar multiplos
workspaces e adaptacoes simultaneas.

## 1. Enums que podem virar tabelas

### work_item_type

Futuro: `work_item_types`.

Motivo: tipos de demanda variam por cliente e podem precisar de prioridade,
fila padrao, regras de execucao e exibicao no livro de turno.

### schedule_type

Futuro: `schedule_types` ou `shift_types`.

Motivo: tipos de escala variam por cliente e podem carregar regras de
sobreposicao, bloqueio e obrigatoriedade de livro de turno.

### technician_level

Futuro: `business_roles` e `role_assignments`.

Motivo: nivel responsavel, papel operacional e permissao nao sao a mesma coisa.

## 2. Tabelas futuras recomendadas

- `workspaces`
- `workspace_module_configs`
- `work_item_types`
- `service_order_types`
- `asset_types`
- `schedule_types`
- `business_roles`
- `role_assignments`
- `workflow_definitions`
- `workflow_states`
- `workflow_transitions`
- `queues`
- `queue_items`
- `report_templates`
- `document_templates`
- `custom_fields`
- `comments`
- `audit_logs`

## 3. Regra de migracao

Nao migrar tudo ao mesmo tempo sem necessidade funcional.

A migracao deve acontecer quando:

- o MVP estiver funcional;
- houver segunda adaptacao ou cliente;
- a edicao por banco for melhor que constantes TypeScript;
- a regra afetar permissoes, relatorios ou workflow persistido.

## 4. Estado atual

A adaptacao em codigo ja separa cliente e core. A base pode continuar com enums
durante a estabilizacao do MVP, desde que novas regras especificas nao sejam
espalhadas dentro dos modulos.
