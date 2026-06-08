# Fase 38B — Workspace Consent UI

## Objetivo
Tela de configuração de consentimento de privacidade do workspace.

## Contexto
Gestores de tenant ativam ou desativam a IA/Agent observation.

## Arquivos permitidos
- Painel de configurações do workspace

## Arquivos proibidos
- Omitir os termos do consentimento

## Regras
- Texto claro sobre as integrações permitidas e uso de dados.

## Etapas
1. Criar seção de 'AI & Agentes' no Settings do workspace.
2. Toggle de opt-in.

## Validações
- Teste de ativação/desativação da configuração.

## Relatório final esperado
- Tela de consentimento ativa.

## Regra de parada
Pare após salvar e refletir o estado visual.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 38B — Workspace Consent UI

Objetivo:
Tela de configuração de consentimento de privacidade do workspace.

Crie a interface nas configurações do workspace para gerenciar o opt-in de agentes de IA.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 38B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Configuração de Workspace
- Rota(s): /[workspace]/settings/ai
- Usuário/persona: Workspace Admin
- Workspace/global: Workspace
- Estados cobertos: Toggle On/Off, Textos explicativos
- Teste visual/E2E: Troca de estado salva.
- Gap frontend pendente: Nenhum
