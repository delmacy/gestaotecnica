# Workflow inventory

This reorganization keeps specialized validation workflows independent while introducing a serialized OpenCode queue.

| Workflow | Responsibility | Trigger |
| --- | --- | --- |
| OpenCode Task Runner | Select, implement, validate, and propose one queued task | dispatch, repository dispatch, 15-minute watchdog |
| Continue OpenCode Queue | Start the next task after an agent PR merge | merged `agent/*` PR |
| OpenCode Pull Request Gate | Independent application and architecture validation | PR to `main` |
| Agent Work Operational Proof | Database-backed proof for Agent Work changes | scoped PR/push |
| Architecture Check | Architecture rules | existing scoped triggers |
| Schema CI Gate | Schema and migration safety | existing scoped triggers |
| Phase 2 Environment Validation | Environment validation | existing triggers |
| Vercel Hourly Preview Promote | Batch latest `main` deployment | hourly/manual |

The Jules-dependent System Builder Governor is removed.
