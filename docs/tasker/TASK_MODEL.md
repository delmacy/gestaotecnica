# Task Model

## Campos obrigatórios
`id`, `title`, `description`, `module`, `phase`, `type`, `priority`, `status`, `dependencies`, `blocked_by`, `related_decisions`, `expected_files`, `acceptance_criteria`, `agent_owner`, `created_at`, `updated_at`, `notes`.

## Enums
- status: `backlog`, `ready`, `in_progress`, `blocked`, `review`, `done`, `cancelled`
- type: `documentation`, `architecture`, `frontend`, `backend`, `contract`, `refactor`, `test`, `integration`, `decision`
- priority: `critical`, `high`, `medium`, `low`

Uma task só chega a `done` quando aceite, arquivos esperados, decisões, board e impacto frontend foram comprovados.
