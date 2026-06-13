# Agent Factory Hardening Checklist

- [x] Schema atualizado com review packages, claims aprimorados e timestamps.
- [x] Conexão com DB refatorada para DB Isolation (`createAgentWorkDb`).
- [x] CLI mockada removida e substituída por CLI com parseArgs.
- [x] Serviços de lease, heartbeat e reap implementados.
- [x] Avaliação de readiness checando `baseSha` e `tasks`.
- [x] Gerador de `ReviewKit` incluído para Scoped Reviewer.
- [x] Regras de Worktree registradas em `WORKTREE_BRANCH_POLICY.md`.
- [x] Seeds ajustados e inseridos no DB.
- [x] Grupo D e Orchestration Hub mantidos fora de escopo.
