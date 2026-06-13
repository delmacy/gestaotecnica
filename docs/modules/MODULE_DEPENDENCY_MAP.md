# Module Dependency Map

O diagrama conceptual das permissões de consumo cruzado:

- `platform-core` é consumido por quase todos, porém só altera o próprio core.
- `shared-contracts` é altamente compartilhado. Nenhuma mudança pode quebrar retrocompatibilidade sem aprovação do Integration Agent.
- `runtime-engine` consome `events-receipts`, `shared-contracts`, `platform-core`.
- `integration-gateway` consome APENAS `shared-contracts` e `events-receipts` e grava/lê Outbox.
- `tasker-agent-work` é completamente independente do runtime do produto principal, utilizando apenas PostgreSQL isolado.
