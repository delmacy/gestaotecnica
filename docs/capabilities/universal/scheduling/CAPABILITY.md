# Capability — scheduling

## Core business
Coordenar agenda, disponibilidade, reservas e conflitos.

## Contrato resumido
| Campo | Valor |
|---|---|
| Categoria | resource |
| Entidades principais | Appointment, Calendar, Availability, Reservation |
| Estados principais | tentative, confirmed, completed, cancelled |
| Processos principais | find availability; reserve; reschedule; cancel |
| Relações | people, resources, work_orders |
| Estado documental | review; ainda não autoriza implementação |

## Exemplo genérico
Uma visita reserva profissional e veículo sem conflito.

## Fora de escopo
Especialização setorial, detalhes de cliente, implementação técnica e absorção silenciosa das capabilities relacionadas.

## Critérios de aceite
Fronteira compreensível; entidades e estados coerentes; processos e eventos rastreáveis; regras e UI revisadas; relações e gaps declarados.
