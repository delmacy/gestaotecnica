# Path Ownership Matrix

Cada worker claima caminhos ao iniciar o pacote. Se houver sobreposição, o `Collision Engine` decide se bloqueia.

| Padrão de Caminho | Ownership Default | Classificação |
|---|---|---|
| `src/agent-work/**` | agent-work-module | exclusive |
| `docs/agent-work/**` | agent-work-module | exclusive |
| `src/platform/**` | platform-core | exclusive |
| `src/modules/runtime/**` | runtime-engine | exclusive |
| `src/modules/integrations/**`| integration-gateway | exclusive |
| `src/modules/events/**` | events-receipts | exclusive |
| `docs/archive/**` | documentator | documentator_owned |
| `package.json` | integrator | integration_owned |
| `package-lock.json` | integrator | integration_owned |
| `drizzle/**` | integrator | migration_owned |
| `schema.ts` (indexes) | integrator | integration_owned |
| `index.ts` (barrels) | integrator | integration_owned |
| `.github/**` | integrator | forbidden_parallel |
