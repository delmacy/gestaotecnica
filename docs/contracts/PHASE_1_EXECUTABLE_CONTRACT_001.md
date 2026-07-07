# Phase 1 Executable Contract — System Builder

## Document Control

| Field | Value |
|---|---|
| **ID** | SB-F0-T02-PHASE1-CONTRACT |
| **Version** | 1.0 |
| **Created** | 2026-07-07 |
| **Author** | Reviewer (c426905b-f05f-48d2-b757-d01f28605b7c) |
| **Parent** | DEL-106 (System Builder GitHub-First Plan) |
| **Status** | Ready for Review |
| **Gate** | Codex Governor final decision required before child issue creation |

---

## 1. Objective

Transform the approved DEL-106 plan into a versioned execution contract for Phase 1, with candidate tasks, file boundaries, gates, and acceptance criteria ready for Jules Executor and reviewers.

This contract enables the first wave of System Builder development to proceed with:
- Clear task boundaries and ownership
- Frontend parity declarations
- Persistence and tenancy constraints
- CI/CD and review gates
- Evidence requirements

---

## 2. Context

The Codex Governor does not implement code by default. Before delegating development to Jules Executor, Phase 1 requires a versioned technical contract covering:
- Organizational capacity
- Supported process
- Traceability
- Frontend impact
- Persistence strategy
- Test gates
- Review gates

**Dependency:** This contract assumes SB-F0-T01 (DEL-107) has confirmed the clean restart and reconciled old executable units. No candidate task in this contract reuses prior GitHub Issues or Paperclip tasks as delivery.

---

## 3. Phase 1 Scope

### 3.1 What Phase 1 Delivers

Phase 1 establishes the **organizational and documentation foundation** for the System Builder GitHub-First Pilot:

1. **Company/Agent Governance Structure** - Operating model for agent company execution
2. **GitHub/Paperclip Integration** - Task flow from Paperclip to GitHub execution
3. **CI/CD Baseline** - Actions workflows for validation and quality gates
4. **Documentation Operating Model** - How documentation evolves with code
5. **First Executable Task Template** - Pattern for Jules Executor handoff

### 3.2 What Phase 1 Does NOT Deliver

- Application code implementation (src/)
- Database migrations or schema changes
- Feature PRs beyond documentation/contracts
- Direct Jules Executor assignment (requires Codex Governor gate approval)

---

## 4. Candidate Tasks for First Wave

The following 5 candidate tasks comprise Phase 1 execution. Each follows the mandatory DEL-106 format.

---

### Task 4.1: SB-F1-T01 — Company Governance Bootstrap

| Field | Value |
|---|---|
| **ID** | SB-F1-T01 |
| **Frente** | GitHub/Paperclip Operating System |
| **Fase** | Fase 1 - Fundações Operacionais |
| **Titulo** | Criar estrutura de governança da empresa agente |
| **Objetivo** | Estabelecer COMPANY.md, PROJECT.md, e agent instructions para o piloto GitHub-First |
| **Contexto** | O piloto requer uma empresa Paperclip configurada com agentes, habilidades e regras de heartbeat antes de executar qualquer task |
| **GitHub Issue** | A ser criada após aceite deste contrato |
| **Paperclip Task** | A ser vinculada pelo Codex Governor |
| **Branch esperada** | `ops/sb-f1-t01-company-bootstrap` |
| **Arquivos permitidos** | `COMPANY.md`, `PROJECT.md`, `.agents/skills/**`, `agents/*/instructions/**` |
| **Arquivos proibidos** | `src/**`, `drizzle/**`, `tests/**`, `.github/workflows/**` |
| **Escopo incluido** | - Criar COMPANY.md com agentes e reporting lines<br>- Criar PROJECT.md com escopo do piloto<br>- Definir agent instructions para PMO Manager, Git Manager, DevOps Manager, Reviewer, Codex Governor<br>- Criar skill de heartbeat e issue assignment |
| **Escopo excluido** | - Implementação de código<br>- Configuração de Actions workflows<br>- Criação de issues de execução |
| **Dependencias** | - SB-F0-T01 (restart limpo confirmado)<br>- DEL-106 plan acceptance |
| **Contratos consumidos** | - `docs/PROJECT_MANIFEST.md`<br>- `docs/ARCHITECTURE.md`<br>- `docs/operations/GITHUB_FIRST_PILOT.md` |
| **Contratos alteraveis** | - `docs/operations/GITHUB_FIRST_PILOT.md` (atualizar com evidências) |
| **Criterios de aceite** | - COMPANY.md com todos os agentes do piloto<br>- PROJECT.md com escopo e milestones<br>- Agent instructions com heartbeat e handoff rules<br>- Skill de heartbeat funcional |
| **Testes obrigatorios** | - Validação de sintaxe Markdown<br>- Verificação de links internos |
| **Evidencias obrigatorias** | - PR link<br>- Lista de arquivos criados<br>- Matriz de agentes e responsabilidades |
| **Riscos** | - Instruções de agente muito genéricas<br>- Missing handoff rules entre agentes |
| **Gate de revisao** | Reviewer valida governança; Codex Governor aprova criação de child issues |
| **Proximo responsavel** | Jules Executor (após gate do Codex) |
| **Frontend Parity** | N/A - governança interna, sem impacto de UI |
| **Tenancy** | Global (company-level configuration) |

---

### Task 4.2: SB-F1-T02 — GitHub Issue Templates e Labels

| Field | Value |
|---|---|
| **ID** | SB-F1-T02 |
| **Frente** | GitHub/Paperclip Operating System |
| **Fase** | Fase 1 - Fundações Operacionais |
| **Titulo** | Criar templates de issues, PRs e labels do GitHub |
| **Objetivo** | Estabelecer padrões de evidência para issues e PRs do piloto |
| **Contexto** | O piloto GitHub-First exige que toda task produza evidência estruturada no GitHub |
| **GitHub Issue** | A ser criada após aceite deste contrato |
| **Paperclip Task** | A ser vinculada pelo Codex Governor |
| **Branch esperada** | `ops/sb-f1-t02-github-templates` |
| **Arquivos permitidos** | `.github/ISSUE_TEMPLATE/**`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS` |
| **Arquivos proibidos** | `src/**`, `drizzle/**`, `tests/**` |
| **Escopo incluido** | - Criar issue templates para: feature, bug, ops, review<br>- Criar PR template com seções de evidência<br>- Definir CODEOWNERS para revisão obrigatória<br>- Documentar labels obrigatórios (front, type, risk, agent, gate, status) |
| **Escopo excluido** | - Configuração de Actions workflows<br>- Criação de issues de execução |
| **Dependencias** | - SB-F1-T01 (governança bootstrap) |
| **Contratos consumidos** | - `docs/operations/GITHUB_FIRST_PILOT.md` |
| **Contratos alteraveis** | Nenhum |
| **Criterios de aceite** | - Issue templates com campos de evidência<br>- PR template com checklist de gates<br>- CODEOWNERS com revisores obrigatórios<br>- Documentação de labels |
| **Testes obrigatorios** | - Validação de sintaxe YAML<br>- Teste manual de criação de issue via template |
| **Evidencias obrigatorias** | - PR link<br>- Screenshots dos templates em uso<br>- Lista de labels criados |
| **Riscos** | - Templates muito complexos desencorajam uso<br>- Labels inconsistentes com o plano |
| **Gate de revisao** | Reviewer valida templates; Git Manager aprova |
| **Proximo responsavel** | Git Manager |
| **Frontend Parity** | N/A - templates do GitHub, sem impacto de UI na aplicação |
| **Tenancy** | Global (repositório) |

---

### Task 4.3: SB-F1-T03 — CI/CD Actions Baseline

| Field | Value |
|---|---|
| **ID** | SB-F1-T03 |
| **Frente** | Quality / CI / Observability |
| **Fase** | Fase 1 - Fundações Operacionais |
| **Titulo** | Criar workflows de Actions para validate, test, build |
| **Objetivo** | Estabelecer pipeline de CI obrigatório para PRs |
| **Contexto** | O piloto exige verificações automáticas de qualidade antes do merge |
| **GitHub Issue** | A ser criada após aceite deste contrato |
| **Paperclip Task** | A ser vinculada pelo Codex Governor |
| **Branch esperada** | `ci/sb-f1-t03-actions-baseline` |
| **Arquivos permitidos** | `.github/workflows/**` |
| **Arquivos proibidos** | `src/**`, `drizzle/**` (workflows podem referenciar, mas não alterar) |
| **Escopo incluido** | - Criar workflow `validate.yml` (lint, typecheck)<br>- Criar workflow `test.yml` (unit tests)<br>- Criar workflow `build.yml` (build artifact)<br>- Configurar branch protection rules (documentado) |
| **Escopo excluido** | - E2E tests (requer Postgres e Playwright provisionados)<br>- Integration tests (bloqueado por ambiente) |
| **Dependencias** | - SB-F1-T01 (governança)<br>- SB-F1-T02 (templates) |
| **Contratos consumidos** | - `docs/system-builder/validation/PHASE_1_BUILD_TEST_GATE_001.md` |
| **Contratos alteraveis** | Nenhum |
| **Criterios de aceite** | - Workflows criados e funcionais<br>- PRs exigem checks verdes<br>- Branch protection documentada |
| **Testes obrigatorios** | - Execução real dos workflows em PR de teste<br>- Logs anexados na evidência |
| **Evidencias obrigatorias** | - PR link<br>- Screenshots de checks verdes<br>- Lista de workflows criados |
| **Riscos** | - Workflows falham por dependências de ambiente<br>- Falsos positivos nos checks |
| **Gate de revisao** | DevOps Manager valida; Reviewer aprova; Codex Governor decide merge |
| **Proximo responsavel** | DevOps Manager |
| **Frontend Parity** | N/A - CI/CD, sem impacto de UI |
| **Tenancy** | Global (repositório) |

---

### Task 4.4: SB-F1-T04 — Documentation Operating Model

| Field | Value |
|---|---|
| **ID** | SB-F1-T04 |
| **Frente** | System Builder Platform |
| **Fase** | Fase 1 - Fundações Operacionais |
| **Titulo** | Documentar modelo operacional de documentação |
| **Objetivo** | Estabelecer como documentação evolui com código e é mantida |
| **Contexto** | O plano DEL-106 exige que documentação seja executável e mantida |
| **GitHub Issue** | A ser criada após aceite deste contrato |
| **Paperclip Task** | A ser vinculada pelo Codex Governor |
| **Branch esperada** | `docs/sb-f1-t04-doc-operating-model` |
| **Arquivos permitidos** | `docs/operations/**`, `docs/README.md`, `docs/PROJECT_MANIFEST.md` |
| **Arquivos proibidos** | `src/**`, `drizzle/**`, `tests/**` |
| **Escopo incluido** | - Documentar estrutura de diretórios docs/<br>- Definir processo de atualização documental<br>- Criar índice de documentos (GLOBAL_WORK_BOARD.md)<br>- Estabelecer gate de documentação para PRs |
| **Escopo excluido** | - Migração de documentos existentes (fase futura)<br>- Implementação de código |
| **Dependencias** | - SB-F1-T01 (governança) |
| **Contratos consumidos** | - `docs/PROJECT_MANIFEST.md`<br>- `docs/ARCHITECTURE.md`<br>- `docs/GLOBAL_WORK_BOARD.md` |
| **Contratos alteraveis** | - `docs/PROJECT_MANIFEST.md` (atualizar com estrutura)<br>- `docs/GLOBAL_WORK_BOARD.md` (atualizar com índice) |
| **Criterios de aceite** | - Estrutura docs/ documentada<br>- Processo de manutenção definido<br>- Índice de documentos atualizado |
| **Testes obrigatorios** | - Validação de links internos<br>- Revisão de consistência |
| **Evidencias obrigatorias** | - PR link<br>- Lista de documentos criados/atualizados<br>- Índice de documentos |
| **Riscos** | - Documento tornar-se obsoleto rapidamente<br>- Estrutura muito complexa |
| **Gate de revisao** | Docs Operator valida; Reviewer aprova |
| **Proximo responsavel** | Docs Operator |
| **Frontend Parity** | N/A - documentação interna |
| **Tenancy** | Global |

---

### Task 4.5: SB-F1-T05 — First Executable Task Template

| Field | Value |
|---|---|
| **ID** | SB-F1-T05 |
| **Frente** | System Builder Platform |
| **Fase** | Fase 1 - Fundações Operacionais |
| **Titulo** | Criar template de task executável para Jules Executor |
| **Objetivo** | Estabelecer padrão de task que Jules Executor pode executar |
| **Contexto** | Jules Executor precisa de tasks com escopo claro, arquivos permitidos/proibidos, e critérios de aceite |
| **GitHub Issue** | A ser criada após aceite deste contrato |
| **Paperclip Task** | A ser vinculada pelo Codex Governor |
| **Branch esperada** | `docs/sb-f1-t05-executable-task-template` |
| **Arquivos permitidos** | `docs/tasker/**`, `docs/operations/**` |
| **Arquivos proibidos** | `src/**`, `drizzle/**`, `tests/**` |
| **Escopo incluido** | - Criar template de task no formato DEL-106<br>- Documentar processo de handoff para Jules<br>- Definir evidências obrigatórias para Jules<br>- Criar exemplo de task executável (não executar, apenas template) |
| **Escopo excluido** | - Execução de tasks por Jules (fase seguinte)<br>- Implementação de código |
| **Dependencias** | - SB-F1-T01 (governança)<br>- SB-F1-T02 (templates)<br>- SB-F1-T04 (doc operating model) |
| **Contratos consumidos** | - `docs/tasker/SPRINT_BOARD.md` (se existir)<br>- `docs/operations/GITHUB_FIRST_AGENT_COMPANY.md` |
| **Contratos alteraveis** | - `docs/tasker/SPRINT_BOARD.md` (criar se não existir) |
| **Criterios de aceite** | - Template de task criado<br>- Processo de handoff documentado<br>- Exemplo de task preenchido |
| **Testes obrigatorios** | - Revisão de clareza do template<br>- Validação de campos obrigatórios |
| **Evidencias obrigatorias** | - PR link<br>- Template de task<br>- Exemplo preenchido |
| **Riscos** | - Template muito genérico<br>- Jules não consegue executar sem mais contexto |
| **Gate de revisao** | Reviewer valida; Codex Governor aprova handoff para Jules |
| **Proximo responsavel** | Jules Executor (após gate) |
| **Frontend Parity** | N/A - template documental |
| **Tenancy** | Global |

---

## 5. Gates and Constraints

### 5.1 Persistence Gate

Phase 1 tasks are **documentation and configuration only**. No database migrations, schema changes, or persistence layer modifications are permitted.

- **Constraint:** No `drizzle/**` changes in Phase 1
- **Rationale:** Environment constraints (Postgres not provisioned) per PHASE_1_FINAL_GATE_001
- **Evidence Required:** File change list in PR showing no persistence layer modifications

### 5.2 Tenancy Gate

All Phase 1 tasks are **global scope** (company/repository level). No workspace-scoped data or configuration is created.

- **Constraint:** No `workspace_id` or tenant-specific configuration in Phase 1
- **Rationale:** Platform foundation before client instances
- **Evidence Required:** Architecture declaration in each task

### 5.3 Actions Gate

Phase 1 requires CI/CD workflows to be created and functional. However, integration and E2E tests are explicitly excluded due to environment constraints.

- **Required:** `validate.yml`, `test.yml`, `build.yml`
- **Excluded:** `integration-test.yml`, `e2e-test.yml` (Phase 2)
- **Evidence Required:** Green check screenshots on test PR

### 5.4 Review Gate

All Phase 1 PRs require:
1. **Author** - Task owner (agent or human)
2. **Reviewer** - Independent review (not author)
3. **Codex Governor** - Final decision for merge

- **Constraint:** No self-merge for Phase 1 PRs
- **Evidence Required:** PR thread with review approval and Codex decision

### 5.5 PR Gate

Phase 1 PRs must include:
- Link to Paperclip task
- File change summary
- Evidence of local validation (lint, typecheck, build)
- Frontend parity declaration (N/A for docs/ops)
- Dependency resolution (if any)

---

## 6. Frontend Parity Declarations

| Task | Frontend Impact | UI Area | Gap or Parity |
|---|---|---|---|
| SB-F1-T01 | None - governance | N/A | N/A |
| SB-F1-T02 | None - GitHub templates | N/A | N/A |
| SB-F1-T03 | None - CI/CD | N/A | N/A |
| SB-F1-T04 | None - documentation | N/A | N/A |
| SB-F1-T05 | None - template | N/A | N/A |

**Phase 1 Frontend Parity Decision:** All tasks are documentation/configuration/operations with no application UI impact. Frontend parity gate is satisfied by explicit N/A declarations.

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DEL-107 not completed (old units not reconciled) | Medium | High | Block Phase 1 execution until SB-F0-T01 evidence is published |
| Environment constraints block Actions | Medium | Medium | Document DRY_RUN or NOT_CONFIGURED states explicitly; do not fake success |
| Agent instructions too generic | High | Medium | Reviewer validates specificity; require heartbeat and handoff examples |
| Jules Executor cannot execute template | Medium | High | Include example task; Reviewer validates executability |
| Token permissions block GitHub Projects | Low | Low | Document as known constraint; proceed without Projects v2 |

---

## 8. Evidence Ledger

Phase 1 completion requires the following evidence:

1. **PR Links** - One PR per task (SB-F1-T01 through SB-F1-T05)
2. **File Manifest** - List of all files created/modified
3. **Agent Matrix** - Company governance structure
4. **Templates** - GitHub issue and PR templates
5. **Workflows** - Actions workflow files and green check screenshots
6. **Documentation Index** - Updated GLOBAL_WORK_BOARD.md
7. **Executable Task Template** - SB-F1-T05 deliverable

---

## 9. Next Actions

### If Codex Governor Approves This Contract:

1. Create GitHub Issues SB-F1-T01 through SB-F1-T05
2. Create Paperclip child tasks linked to each GitHub Issue
3. Assign tasks to respective agents per the contract
4. Set dependencies between tasks as specified
5. Label issues with milestone "SB GitHub-First Pilot"

### If Codex Governor Requests Changes:

1. Update this contract document with revisions
2. Create new revision ID (e.g., 1.1, 1.2)
3. Resubmit for approval

### If Codex Governor Rejects:

1. Document rejection rationale in issue comments
2. Close Phase 1 contract
3. Escalate to next planning iteration

---

## 10. Approval Block

| Role | Agent/Human | Decision | Date | Evidence |
|---|---|---|---|---|
| **Reviewer** | Reviewer (c426905b-f05f-48d2-b757-d01f28605b7c) | Pending | - | This document |
| **Codex Governor** | Codex Governor | Pending | - | Awaiting decision |

---

## Appendix A: DEL-106 Mandatory Format Compliance

This contract complies with the DEL-106 mandatory task format:
- ✅ ID, Frente, Fase, Titulo, Objetivo, Contexto
- ✅ GitHub Issue, Paperclip Task, Branch esperada
- ✅ Arquivos permitidos, Arquivos proibidos
- ✅ Escopo incluido, Escopo excluido
- ✅ Dependencias, Contratos consumidos, Contratos alteraveis
- ✅ Criterios de aceite, Testes obrigatorios, Evidencias obrigatorias
- ✅ Riscos, Gate de revisao, Proximo responsavel
- ✅ Frontend Parity declaration
- ✅ Tenancy declaration

---

## Appendix B: References

- DEL-106: System Builder GitHub-First Plan
- PHASE_1_FINAL_GATE_001.md: Phase 1 conditional acceptance
- FRONTEND_PARITY_GATE.md: Frontend parity policy
- GITHUB_FIRST_PILOT.md: Pilot workstream definition
- ARCHITECTURE.md: System Builder architecture
- PROJECT_MANIFEST.md: Project vision and principles
