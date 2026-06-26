# Gaps: Case Management Module

## CASE_MANAGEMENT_DATABASE_PROVISIONING
O módulo utiliza a tabela genérica `builder.process_candidates` para persistência de casos, armazenando os atributos específicos no campo `proposed_definition` (JSONB).
Uma tabela dedicada `runtime.cases` seria o estado ideal para performance e tipagem rigorosa no banco, mas não será criada nesta fase para evitar migrations compartilhadas proibidas.

## MODULE_KERNEL_REGISTRATION
Necessidade de registrar as ações e eventos do módulo no `PlatformKernel` para que sejam descobertos pelo sistema, respeitando os limites de Jules Dev.
