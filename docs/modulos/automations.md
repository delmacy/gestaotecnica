# Modulo: Automations

## Configuracao

Automacoes ficam em `automation_rules`.

Execucoes ficam em `automation_runs` e logs detalhados ficam em `automation_run_logs`.

## Adaptacao por cliente

Configure gatilhos, endpoints, provedores, agenda e governanca de execucao. O modo atual e `manual-first`: a execucao registra run/logs auditaveis e prepara o contrato para workers, webhooks, n8n ou RPA sem disparar integracoes externas automaticamente.
