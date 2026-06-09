# Development Rules

## Ordem obrigatória
1. Leia `PROJECT_MANIFEST.md`, `ARCHITECTURE.md`, `GLOBAL_WORK_BOARD.md`.
2. Leia `tasker/SPRINT_BOARD.md` e a task atribuída.
3. Leia `INSTRUCTIONS.md`, `WORK_BOARD.md`, `TASKS.md` e `DECISIONS.md` do módulo.
4. Documente decisão; defina contrato; somente depois implemente.

## Regras
- Cada módulo mantém work board executável.
- Nenhuma task inicia sem dependências, arquivos esperados e critérios de aceite.
- Mudanças entre módulos exigem decisão e dependências registradas.
- Toda feature operacional declara paridade frontend.
- Capabilities globais e dados workspace-scoped não podem ser confundidos.
- Histórico em `archive/` é preservado.

## Restrição da reestruturação atual
Durante a reestruturação documental, é proibido alterar código, schemas, migrations, banco, build ou dependências. Necessidades técnicas devem ser registradas em `tasker/DEPENDENCIES.md`.
