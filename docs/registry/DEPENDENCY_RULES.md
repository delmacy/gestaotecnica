# Dependency Rules

Dependências devem ser explícitas, versionadas, acíclicas e justificadas. Capabilities globais são instaladas/configuradas por workspace.

## Regras de Dependência e Fronteira
1. Capabilities transversais podem ser usadas por várias capabilities, mas não devem controlar o fluxo principal sozinhas.
2. `work_orders` pode depender de `people`, `documents`, `audit` e `scheduling`.
3. `requests` pode converter para `cases` ou `work_orders`, mas não deve executar trabalho.
4. `approvals` pode bloquear transições, mas não substitui `governance`.
5. `audit` registra fatos, não decide regra de negócio.
6. `finance` não deve ser obrigatório para todo processo operacional.
7. `inventory` só entra quando há consumo, saldo, lote, reserva ou baixa.
