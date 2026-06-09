# Task Model

Modelo conceitual de task:

- `id`: Identificador único.
- `title`: Título da task.
- `description`: Descrição detalhada.
- `module`: Módulo relacionado.
- `phase`: Fase da execução.
- `type`: Tipo de task (documentation, architecture, frontend, backend, contract, refactor, test, integration, decision).
- `priority`: Prioridade (critical, high, medium, low).
- `status`: Status atual (backlog, ready, in_progress, blocked, review, done, cancelled).
- `dependencies`: Outras tasks necessárias.
- `blocked_by`: Impedimentos.
- `related_decisions`: Decisões relacionadas em DECISIONS.md.
- `expected_files`: Arquivos esperados a serem alterados.
- `acceptance_criteria`: Critérios para finalizar a task.
- `agent_owner`: Agente responsável.
- `created_at`: Data de criação.
- `updated_at`: Data de atualização.
- `notes`: Observações adicionais.

Uma task só pode ir para `done` quando:
- O critério de aceite foi cumprido.
- Os arquivos esperados foram criados ou alterados.
- O work_board do módulo foi atualizado.
- Decisões relevantes foram registradas.
- Impacto visual foi registrado em `docs/ui/VIEW_CONTRACT.md`, quando aplicável.
