# Runtime Contract - Adherence Matrix

| Contract Item | Schema Evidence | Type Evidence | Repository Evidence | Service Evidence | Status | Severity | Required Action | Future Task |
|---|---|---|---|---|---|---|---|---|
| Tenant Isolation (workspaceId) | Presente em todas tabelas | Requerido em todos DTOs | Usa nos Wheres de select, porém não no join de Definition/Version | Repassa cego (Mocked Server actions) | `partial` | High | Validar tenancy do artefato publico | RC-FIX-C |
| Typescript vs Postgres Mapping | `schema_version` | `schemaVersion` (sem mapper explícito no model) | Manda camelCase para select | Ignora erro (type cast any) | `failed` | High | Corrigir mapeamento do Drizzle select | RC-FIX-B |
| Strict Payload Tiping | Usa `jsonb` | Usa `any` massivo no Zod/TS | Permite injeção ampla | Não recorta dados de schemaVersion | `failed` | Critical | Migrar de Any para Unknown e Zod Schema Registry | RC-FIX-A |
| Transações (ACID) | N/A | N/A | Nenhuma chamada de query usa função tx do Drizzle (Insert/Update desconexos) | Assíncrona e multi-await linear solta | `failed` | Critical | Subir Tx Wrapper para as Boundaries ou Services | RC-FIX-D |
| State Machine e Lifecycle | enum ok | z.enum ok | Permite update irrestrito de enum de action | `advanceStep` não usa o pointer `currentStateId` para root instance | `partial` | High | Gravar no instance record o ponteiro de State Id | RC-FIX-E, RC-FIX-F |
| Path-finding Linear seguro | N/A | Node Types ok | Queries dependem da definition | Busca cegamente `[0]`, falha com conditions | `partial` | High | Adaptar algoritmo de traverse do graph | RC-FIX-F |
| Event Atomicity | logEvent table existente | N/A | Grava event apos workflow db (ou vice-versa), sem tx. | Falha um lado, deixa DB dirty | `failed` | High | Empacotar event log junto com action updates na tx principal | RC-FIX-H |
