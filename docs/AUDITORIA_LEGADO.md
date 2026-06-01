# Auditoria de Legado e Limpeza Arquitetural

Esta auditoria identifica componentes, rotas e módulos obsoletos que devem ser removidos ou consolidados em favor do novo **Platform Runtime / Builder**.

## 1. Módulos Legados (`src/modules/*`)

Os seguintes diretórios em `src/modules` implementam lógicas acopladas diretamente às tabelas do schema legado (ex: `work_items`, `service_orders`, etc.) usando telas manuais, em vez de consumirem o motor de `forms` e `views` dinâmicas. Eles foram classificados como **REMOVER/CONSOLIDAR**.

| Módulo/Pasta | Classificação | Ação/Justificativa |
|---|---|---|
| `acquisitions`, `assets`, `compliance` | **Remover** | Substituídos por Views Dinâmicas (`View Builder`). |
| `events` | **Consolidar** | Migrar para a nova arquitetura `Platform Timeline / Outbox`. |
| `evidences`, `inventory`, `maintenance-plans` | **Remover** | Funções devem ser mapeadas em `Process Builder / Forms`. |
| `planning`, `reports`, `resource-needs`, `schedules` | **Remover** | UI legada e acoplada a tabelas específicas. |
| `service-orders`, `work-items` | **Refatorar** | Estes módulos serão utilizados como **Casos de Uso Reais** na Tarefa 4 (migrados para consumir as capabilities dinâmicas). |
| `shifts`, `skills`, `strategy`, `suppliers` | **Remover** | Não justificam a manutenção de telas manuais. |
| `technical-projects`, `timesheets` | **Remover** | Mesma situação. |

## 2. Componentes de UI

| Componente | Classificação | Ação/Justificativa |
|---|---|---|
| Rotas App Legadas (`src/app/(runtime)/*` como `/assets`, `/inventory`) | **Remover** | As rotas de runtime agora devem ser geradas dinamicamente com base nas Views configuradas no workspace. |
| Hooks duplicados (data-fetching legado) | **Consolidar** | Todos devem passar pelo Gateway de Comandos ou Actions do Platform Kernel. |

## 3. Banco de Dados (`src/db/legacy/schema.ts`)

| Tabela | Classificação | Ação/Justificativa |
|---|---|---|
| `work_items`, `service_orders`, `assets`, etc. | **Remover/Depreciar** | Devem ser modelados como `process_instances` e `process_payloads` usando `blueprints`. |

*A limpeza agressiva focará em remover as rotas de App legadas e os módulos antigos que não farão parte do caso de uso de refatoração, forçando a adoção do Builder.*
