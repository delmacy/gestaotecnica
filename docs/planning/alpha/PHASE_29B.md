# Fase 29B — Candidate Origin and Evidence UI

## Objetivo
Melhorar a tela de Process Candidate para exibir origem e evidências do agente.

## Contexto
Tornar visível para o Process Owner de onde veio a sugestão (humano vs agente).

## Arquivos permitidos
- UI de detalhes do Candidate

## Arquivos proibidos
- Alterações no backend de Candidate (apenas leitura)

## Regras
- O UI deve suportar origem (manual vs agente) e rastreabilidade.

## Etapas
1. Atualizar tela de detalhes para exibir badge de origem.
2. Exibir evidências e formulário inferido.

## Validações
- Teste visual de Candidates com origem agente vs humano.

## Relatório final esperado
- Tela de Candidate exibe origem claramente.

## Regra de parada
Pare após concluir a UI.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 29B — Candidate Origin and Evidence UI

Objetivo:
Melhorar a tela de Process Candidate para exibir origem e evidências do agente.

Ajuste a UI do Candidate para mostrar a origem (Agente/Humano) e detalhes da proposta.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 29B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Process Candidate Details
- Rota(s): /builder/candidates/[id]
- Usuário/persona: Process Owner
- Workspace/global: Workspace/Global
- Estados cobertos: Origem agente, origem manual, com/sem evidências
- Teste visual/E2E: Renderizar badge e evidências.
- Gap frontend pendente: Nenhum
