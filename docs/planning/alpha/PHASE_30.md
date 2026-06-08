**Adendo documental — Frontend Parity Gate**

# Fase 30 — Paperclip Metadata Backend

## Objetivo
Adicionar suporte a `correlation_id`, `idempotency_key` e rastreamento de recibos.

## Contexto
Preparar a infra para garantir rastreabilidade das interações do Paperclip.

## Arquivos permitidos
- Banco de dados de rastreamento de eventos/receitas de agentes

## Arquivos proibidos
- Integração real com Paperclip

## Regras
- Idempotência obrigatória para requests de agentes.

## Etapas
1. Implementar armazenamento de metadados.
2. Lógica de idempotência no gateway.

## Validações
- Testes de requisições duplicadas sendo barradas.

## Relatório final esperado
- Rastreamento de metadados concluído.

## Regra de parada
Pare antes da interface de recibos.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 30 — Paperclip Metadata Backend

Objetivo:
Adicionar suporte a `correlation_id`, `idempotency_key` e rastreamento de recibos.

Implemente suporte a metadados (idempotência, correlation_id) para requisições de agentes.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 30
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend de recibos
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Global
- Estados cobertos: Duplicatas, novos requests
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 30B
