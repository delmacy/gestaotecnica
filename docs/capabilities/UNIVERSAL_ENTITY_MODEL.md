# Universal Entity Model

## Objetivo
Definir conceitos reutilizáveis sem criar um modelo único e acoplado para todos os domínios.

## Campos universais mínimos
Identidade, workspace quando operacional, ciclo de vida, proprietário, origem, timestamps, versão, rastreabilidade e classificação de sensibilidade.

## Famílias
| Família | Entidades de referência | Regra |
|---|---|---|
| identidade/estrutura | Actor, Organization, Workspace, Unit, Team, Role | estrutura global e vínculos explícitos |
| relacionamento | Customer, Provider, Contact | identidade não deve depender de processo |
| trabalho | Request, Case, Task, WorkOrder | cada unidade possui dono e estado |
| recurso | Appointment, Resource, Asset, Item | disponibilidade e alocação são explícitas |
| informação/controle | Document, Message, Approval, Rule, AuditLog | versão, decisão e evidência são rastreáveis |
| comercial/legal | Contract, Invoice, Payment, LegalCase | obrigações e vigência são explícitas |

## Uso
Capabilities especializam estes conceitos somente quando necessário. Igualdade de nome não autoriza compartilhar tabela ou ciclo de vida sem decisão arquitetural.

## Critério de pronto
Entidades possuem fronteira de domínio, identidade, estado, owner, workspace scope e eventos relevantes.
