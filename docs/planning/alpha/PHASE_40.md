**Adendo documental — Frontend Parity Gate**

# Fase 40 — Multi-Agent Operating Model

## Objetivo
Registry estático de agentes autorizados e suas permissões.

## Contexto
Preparação para ter múltiplos agentes especializados (Process Agent, Form Agent, Review Agent).

## Arquivos permitidos
- Tabela/Config de Registry de Agentes

## Arquivos proibidos
- Múltiplos agentes dinâmicos de início

## Regras
- Cada agente tem chaves e permissões específicas.

## Etapas
1. Implementar registry de agentes e roteamento por permissões.

## Validações
- Autorização falhando se agente tenta ação fora do seu escopo.

## Relatório final esperado
- Modelo multiagente de backend base concluído.

## Regra de parada
Pare antes da interface do registry.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 40 — Multi-Agent Operating Model

Objetivo:
Registry estático de agentes autorizados e suas permissões.

Crie a infraestrutura de backend para registrar múltiplos agentes e mapear suas capacidades (Registry).
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 40
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Registry
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Global
- Estados cobertos: CRUD API
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 40B
