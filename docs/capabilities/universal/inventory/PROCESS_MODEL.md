# Process Model — inventory

## Processos principais
receive stock; reserve; issue; reconcile

## Modelo de uso
Cada processo registra gatilho, entrada, saída, ator, estados, decisões, exceções, evidências e eventos. Variantes surgem de Process Mirroring e são validadas antes de publicação.

## Exemplo
Uma peça é reservada e baixada por ordem.

## Relações
work_orders, procurement, audit podem fornecer entradas, decisões, recursos ou saídas; a dependência deve permanecer explícita.

## Critério de pronto
Happy path e exceções são compreensíveis, responsabilidades e evidências estão claras e não há workflow rígido imposto sem validação.
