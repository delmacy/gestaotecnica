# Process Model — work_orders

## Processos principais
issue work order; execute; validate; close

## Modelo de uso
Cada processo registra gatilho, entrada, saída, ator, estados, decisões, exceções, evidências e eventos. Variantes surgem de Process Mirroring e são validadas antes de publicação.

## Exemplo
Uma ordem exige fotos e validação do supervisor.

## Relações
requests, tasks, assets, audit podem fornecer entradas, decisões, recursos ou saídas; a dependência deve permanecer explícita.

## Critério de pronto
Happy path e exceções são compreensíveis, responsabilidades e evidências estão claras e não há workflow rígido imposto sem validação.
