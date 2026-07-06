# GitHub-First Pilot

## Goal

Prove one complete System Builder / Gestao Tecnica delivery path:

Paperclip task -> GitHub issue -> branch -> PR -> Actions -> Tester -> Reviewer -> Codex decision -> merge or explicit rejection.

## Pilot Workstreams

| Workstream | Owner | Gate |
| --- | --- | --- |
| Quality / CI / Observability | DevOps Manager + Tester | Actions baseline is usable or failures are explicitly registered |
| Persistence / Multi-Tenancy | OpenCode Engineer + Jules Executor | Migration and tenancy checks are defined |
| GitHub / Paperclip Operating System | PMO Manager + Git Manager + Codex Governor | GitHub labels, templates, milestone, and pilot issues exist |

## Acceptance Criteria

- GitHub labels and milestone exist.
- Issue and PR templates force agent evidence.
- At least three pilot issues exist and are labeled by front, type, agent, risk, gate, and status.
- GitHub Project is created or explicitly blocked by token permissions.
- Paperclip task references the GitHub issue for code execution.
- A pilot PR carries required evidence and reaches a Codex decision.

## Known Constraint

GitHub Projects v2 requires project permissions that are not available in the current token.

Evidence: `gh project create --owner delmacy --title "System Builder GitHub-First Pilot"` returned `GraphQL: Resource not accessible by personal access token (createProjectV2)`.

Tracked blocker: https://github.com/delmacy/gestaotecnica/issues/370

## Created GitHub Artifacts

- Milestone: `SB GitHub-First Pilot`
- Quality / CI / Observability issue: https://github.com/delmacy/gestaotecnica/issues/367
- Persistence / Multi-Tenancy issue: https://github.com/delmacy/gestaotecnica/issues/368
- GitHub / Paperclip Operating System issue: https://github.com/delmacy/gestaotecnica/issues/369
- GitHub Projects v2 permission blocker: https://github.com/delmacy/gestaotecnica/issues/370
