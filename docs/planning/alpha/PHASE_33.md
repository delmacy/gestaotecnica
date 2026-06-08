**Adendo documental — Frontend Parity Gate**

# Fase 33 — Living Procedures Backend

## Objetivo
Criar modelo de documentação viva ligada ao processo/version.

## Contexto
Procedimentos devem evoluir junto com os processos (versões).

## Arquivos permitidos
- Schema/Service para Procedimentos/Docs.

## Arquivos proibidos
- UI de documentação complexa

## Regras
- Doc ligada estritamente à versão publicada do processo.

## Etapas
1. Criar entidade/tabela de documentação atrelada a processo.

## Validações
- Relacionamento banco validado.

## Relatório final esperado
- Backend de living procedures.

## Regra de parada
Pare antes da visualização.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 33 — Living Procedures Backend

Objetivo:
Criar modelo de documentação viva ligada ao processo/version.

Implemente a base de dados e API para Living Procedures atrelados a versões de processos.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 33
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Docs
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: CRUD basico
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 33B
