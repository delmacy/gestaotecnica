# Mapeamento: Módulos Atuais como Capacidades

Este documento mapeia os módulos existentes no projeto para a nova ontologia do **System Builder**, identificando quais capacidades organizacionais eles representam.

## Mapeamento de Capacidades

| Módulo Atual | Capacidade Organizacional | Descrição |
| :--- | :--- | :--- |
| `work-items` | Gestão de Demandas | Captura e triagem de solicitações, incidentes e atividades. |
| `service-orders` | Execução Operacional | Planejamento, atribuição e execução de ordens de serviço. |
| `assets` | Gestão de Ativos | Controle de inventário físico, localização e ciclo de vida de equipamentos. |
| `workforce` | Gestão de Força de Trabalho | Cadastro de técnicos, níveis de especialidade e formação de equipes. |
| `schedules` | Disponibilidade Operacional | Gestão de escalas, plantões e sobreavisos. |
| `maintenance-plans` | Manutenção Preventiva | Planejamento periódico de intervenções técnicas em ativos. |
| `documents` / `technical-documents` | Gestão Documental Técnica | Geração e controle de laudos, relatórios e evidências. |
| `inventory` | Gestão de Estoque | Controle de peças, reserva de materiais e movimentações. |
| `compliance` | Auditoria e Governança | Verificação de conformidade, registro de achados e planos de ação. |
| `shifts` | Registro de Turno (Shift Log) | Continuidade operacional e passagem de pendências entre turnos. |
| `approvals` | Governança de Decisões | Fluxos de aprovação técnica e supervisão. |
| `notifications` | Comunicação Operacional | Alertas e avisos sobre eventos relevantes do sistema. |
| `workspace-config` | Configuração de Contexto | Ativação/desativação de módulos por ambiente de trabalho. |

## Módulos Core (Candidatos a Platform)
Alguns módulos atuais possuem comportamento de infraestrutura e devem ser absorvidos pelo core da plataforma:
- `workflow-engine`: Motor de transição de estados.
- `events`: Barramento de fatos imutáveis.
- `auth`: Identidade e acesso.
- `global-search`: Indexação e busca universal.
- `comments` / `evidences`: Anexos e interações genéricas.

## Próximos Passos
1. **Refatoração Progressiva:** Mover as definições de schemas desses módulos para o schema `runtime` no banco de dados do cliente.
2. **Abstração:** Garantir que o core (`src/platform`) não dependa diretamente de módulos de negócio (ex: o kernel não deve "conhecer" o que é uma Ordem de Serviço, mas sim como processar uma Ação genérica).
