# Process Model — requests

## Processos principais
capture request; triage; prioritize; convert

## Modelo de uso
Cada processo registra gatilho, entrada, saída, ator, estados, decisões, exceções, evidências e eventos. Variantes surgem de Process Mirroring e são validadas antes de publicação.

## Exemplo
Uma mensagem vira solicitação triada e depois ordem.

## Relações
customers, communication, cases, work_orders podem fornecer entradas, decisões, recursos ou saídas; a dependência deve permanecer explícita.

## Critério de pronto
Happy path e exceções são compreensíveis, responsabilidades e evidências estão claras e não há workflow rígido imposto sem validação.
