# Capability — assets

## Core business
Gerenciar ativos, localização, condição e histórico.

## Contrato resumido
| Campo | Valor |
|---|---|
| Categoria | resource |
| Entidades principais | Asset, AssetLocation, MaintenanceRecord |
| Estados principais | active, maintenance, unavailable, retired |
| Processos principais | register asset; transfer; maintain; retire |
| Relações | work_orders, inventory |
| Estado documental | review; ainda não autoriza implementação |

## Exemplo genérico
Um equipamento entra em manutenção e fica indisponível.

## Fora de escopo
Especialização setorial, detalhes de cliente, implementação técnica e absorção silenciosa das capabilities relacionadas.

## Critérios de aceite
Fronteira compreensível; entidades e estados coerentes; processos e eventos rastreáveis; regras e UI revisadas; relações e gaps declarados.
