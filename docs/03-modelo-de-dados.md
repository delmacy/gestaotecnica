# Modelo de Dados Inicial

Este documento registra o primeiro schema aplicado ao PostgreSQL para sustentar o MVP operacional.

## Stack de dados

- Drizzle ORM
- PostgreSQL
- `DATABASE_URL` no `.env`
- Migrations em `drizzle/`
- Schema TypeScript em `src/db/schema.ts`

## Scripts

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

## Tabelas do MVP

- `users`
- `teams`
- `technician_profiles`
- `assets`
- `work_items`
- `service_orders`
- `service_order_assignments`
- `time_entries`
- `evidences`
- `shifts`
- `shift_log_entries`
- `event_logs`
- `reports`

## Decisoes

- `work_items` representa a necessidade.
- `service_orders` representa a execucao autorizada.
- `event_logs` registra memoria operacional.
- `assets` fica simples no inicio, mas ja suporta criticidade, localizacao e metadados.
- `shift_log_entries` consolida ocorrencias e pendencias do turno.
- Campos importantes para filtro e relatorio ficam como colunas.
- `jsonb` fica reservado para payloads flexiveis e metadados.

## Health check

A aplicacao expoe uma rota de sanidade:

```text
GET /api/health/db
```

Ela valida a conectividade com o PostgreSQL sem expor credenciais.
