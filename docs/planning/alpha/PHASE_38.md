**Adendo documental — Frontend Parity Gate**

# Fase 38 — Privacy and Consent Backend

## Objetivo
Garantir opt-in de observação por workspace.

## Contexto
Agentes não podem acessar dados de workspaces sem consentimento explícito.

## Arquivos permitidos
- Configuração de Workspace (Tabelas/Flags)

## Arquivos proibidos
- Coleta invasiva padrão

## Regras
- Opt-out deve ser o padrão (Privacy by Default).

## Etapas
1. Criar flags e APIs de consentimento por workspace.

## Validações
- Gateway deve barrar sinal de agente se opt-in for false.

## Relatório final esperado
- Lógica de privacidade e consentimento garantida.

## Regra de parada
Pare antes da UI.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 38 — Privacy and Consent Backend

Objetivo:
Garantir opt-in de observação por workspace.

Implemente a infraestrutura de Privacy & Consent (Opt-in) por workspace, bloqueando observação de agentes caso não haja consentimento.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 38
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Settings
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: Blocked, Allowed
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 38B
