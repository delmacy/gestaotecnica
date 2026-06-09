# Process Dependency Map

## Finalidade
Tornar explícitas entradas, saídas e impactos entre processos.

## Campos obrigatórios
processo fornecedor, evento/saída, processo consumidor, SLA, criticidade, fallback, owner e evidência

## Exemplo
| Fornecedor|Saída|Consumidor|Criticidade|Fallback |
| ---|---|---|---|--- |
| triagem|request_qualified|planejamento|alta|fila manual controlada |

## Relação com Process Mirroring e Capabilities
ObservedProcess revela dependências reais; contratos de capability definem eventos e ownership.

## Critérios de pronto
Escopo e versão definidos; responsáveis participaram; fontes e suposições estão registradas; relações e gaps são rastreáveis; mapa possui próximo passo.
