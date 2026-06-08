with open("docs/phases/PHASE_28B.md", "r") as f:
    content = f.read()

content = content.replace('| Status | Em andamento (Fase Corretiva 28C) |', '| Status | Concluída |')

execution_report = """
## 8. Execuções

### Execução 001 — Jules Dev — YYYY-MM-DD

Status: Concluído

Arquivos criados:
- `src/features/workspace/active-workspace.ts`
- `src/app/admin/gateway/page.tsx`
- `src/features/platform/gateway/agent-gateway.actions.ts`
- `tests/e2e/gateway.spec.ts`

Arquivos alterados:
- `docs/00-current/STATUS_DAS_FASES.md`
- `docs/00-current/WORK_BOARD.md`
- `docs/00-current/NEXT_PHASE.md`
- `docs/phases/PHASE_28.md`
- `docs/phases/PHASE_28B.md`
- `src/app/(builder)/candidates/page.tsx`
- `src/features/builder/process-editor/BuilderPage.tsx`
- `src/components/builder/candidates/CandidateDetail.tsx`
- `src/features/builder/candidates/candidates.actions.ts`
- `src/features/builder/candidates/candidates.repository.ts`
- `src/components/layout/AppShell.tsx`

Comandos executados:
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:e2e`

Resultado do lint:
- Passou

Resultado do build:
- Passou

Git status:
- Limpo

Bloqueios:
- Nenhum

Observações:
- Implementação de paridade visual via UI em `/admin/gateway`.
- Centralizado mecanismo de workspace ativo.
- Criadas Actions de aprovação/rejeição de candidates no frontend.

Frontend impact:
- Área afetada: Agent Gateway Control Plane
- Rota(s): /admin/gateway, /candidates
- Usuário/persona: Admin da Plataforma, Gerente de Workspace
- Workspace/global: Global e Workspace-scoped
- Estados cobertos: Lista vazia, erro, aprovar e rejeitar.
- Teste visual/E2E: Coberto por `/tests/e2e/gateway.spec.ts`.
- Gap frontend pendente: Auditoria completa do gateway será persistida em fase futura (Correlação IDs).

"""

content = content.replace('## 8. Execuções\n\n### Execução 001 — Jules Dev — YYYY-MM-DD\n\nStatus: Pendente\n\nArquivos criados:\n- —\n\nArquivos alterados:\n- —\n\nComandos executados:\n- —\n\nResultado do lint:\n- —\n\nResultado do build:\n- —\n\nGit status:\n- —\n\nBloqueios:\n- —\n\nObservações:\n- —\n', execution_report)

with open("docs/phases/PHASE_28B.md", "w") as f:
    f.write(content)
