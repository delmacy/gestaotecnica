# Entity Model — scheduling

## Entidades
Appointment, Calendar, Availability, Reservation

## Campos comuns
Cada entidade declara identidade, workspace scope quando operacional, owner, origem, estado, timestamps, versão e rastreabilidade. Relações cruzadas usam referências explícitas, não ownership implícito.

## Regras de modelagem
- Entidade possui ciclo de vida e responsável claros.
- Dados flexíveis não substituem campos essenciais.
- Alterações relevantes geram evento/auditoria.

## Exemplo
Uma visita reserva profissional e veículo sem conflito.

## Critério de pronto
Identidades, relações, cardinalidades conceituais, estados, sensibilidade e fonte de verdade foram revisados.
