# Development Rules

## Regras Obrigatórias para Agentes

### Ordem de leitura obrigatória:
1. docs/PROJECT_MANIFEST.md
2. docs/ARCHITECTURE.md
3. docs/DEVELOPMENT_RULES.md
4. docs/GLOBAL_WORK_BOARD.md
5. docs/<module>/INSTRUCTIONS.md
6. docs/<module>/WORK_BOARD.md
7. docs/<module>/TASKS.md
8. docs/<module>/DECISIONS.md

### Proibições
- Não criar API Gateway completo sem task explícita.
- Não criar banco multi-tenant avançado sem decisão aprovada.
- Não alterar múltiplos módulos sem registrar decisão.
- Não criar backend sem contrato de uso.
- Não criar frontend desconectado do work_board.
- Não criar abstrações prematuras.
- Não mover o projeto para outra arquitetura sem registrar em DECISIONS.md.
