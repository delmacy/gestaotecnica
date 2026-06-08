# Fase 33B — Living Procedures UI

## Objetivo
Visualizar procedimento vivo no workspace.

## Contexto
Operadores precisam ler como executar as tarefas documentadas do processo.

## Arquivos permitidos
- UI de visualização de Doc

## Arquivos proibidos
- Editor de rich text super complexo no momento (usar markdown básico)

## Regras
- Linkar processo, versão, documentação e evidências.

## Etapas
1. Visualizador de Markdown para o procedimento.
2. Seção na tela de processo/execução.

## Validações
- Teste de renderização do doc.

## Relatório final esperado
- Visualizador de doc pronto.

## Regra de parada
Pare após confirmar a visualização.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 33B — Living Procedures UI

Objetivo:
Visualizar procedimento vivo no workspace.

Crie a UI de Living Procedures, exibindo as diretrizes/documentação de processos.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 33B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Visualização de Processos
- Rota(s): /[workspace]/procedures
- Usuário/persona: Operador
- Workspace/global: Workspace
- Estados cobertos: Visualização limpa, Empty state
- Teste visual/E2E: Renderizar Markdown.
- Gap frontend pendente: Nenhum
