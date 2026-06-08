# Fase 31B — Signal Inbox UI

## Objetivo
Criar tela autenticada para listar sinais recebidos na Inbox.

## Contexto
Os gestores precisam visualizar os sinais crus recebidos pelas integrações n8n.

## Arquivos permitidos
- UI da Signal Inbox

## Arquivos proibidos
- Processamento automático de sinais (isso é backend)

## Regras
- Interface deve listar sinais por status e origem.

## Etapas
1. Tela de lista de sinais.
2. Drawer/Modal com payload cru JSON.

## Validações
- Visualização de payload grande sem quebrar layout.

## Relatório final esperado
- Tela de Signal Inbox entregue.

## Regra de parada
Pare após exibir os dados crus.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 31B — Signal Inbox UI

Objetivo:
Criar tela autenticada para listar sinais recebidos na Inbox.

Implemente a visualização frontend da Signal Inbox para os dados capturados na Fase 31.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 31B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Signal Inbox
- Rota(s): /[workspace]/inbox
- Usuário/persona: Gestor Operacional
- Workspace/global: Workspace
- Estados cobertos: Lista, Payload Modal
- Teste visual/E2E: Visualização da lista.
- Gap frontend pendente: Nenhum
