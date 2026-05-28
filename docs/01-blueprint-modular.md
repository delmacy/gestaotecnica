# Blueprint Modular da Plataforma de Gestão Técnica

> Nota: este blueprint representa a primeira visão modular da plataforma.
> A versão arquitetural atualizada, com core reutilizável, workspaces e
> adaptações por cliente, está em
> `docs/07-blueprint-core-workspaces-adaptacoes.md`.

Stack alvo:

- Next.js
- TypeScript
- PostgreSQL
- Monolito modular
- Event log interno
- Deploy pela Vercel
- Repositorio GitHub

## 1. Foundation

Objetivo: prover a base técnica e organizacional da aplicação.

Responsabilidades:

- autenticação;
- usuários;
- organizações/unidades;
- configurações globais;
- auditoria básica;
- padrões de status, prioridade e classificação.

Entidades iniciais:

- User
- Organization
- Department
- Team
- SystemRole
- AuditLog

Prioridade: MVP.

## 2. Workforce

Objetivo: modelar pessoas técnicas, níveis de competência e disponibilidade operacional.

Responsabilidades:

- cadastro de técnicos;
- nível profissional: trainee, pleno, especialista, supervisor;
- equipes;
- habilidades;
- disponibilidade;
- responsáveis por execução ou validação.

Entidades iniciais:

- TechnicianProfile
- Skill
- TechnicianSkill
- TeamMembership
- Availability

Prioridade: MVP parcial.

## 3. WorkItems / Demandas

Objetivo: ser o envelope universal de entrada e circulação de necessidades.

Responsabilidades:

- registrar demanda;
- classificar tipo, prioridade e origem;
- manter status;
- vincular solicitante, ativo, equipe ou OS;
- sustentar demandas que ainda não viraram execução.

Exemplos de WorkItem:

- incidente operacional;
- solicitação administrativa;
- vistoria;
- manutenção;
- pendência de turno;
- auditoria;
- atividade planejada.

Entidades iniciais:

- WorkItem
- WorkItemType
- WorkItemStatus
- WorkItemComment
- WorkItemAttachment

Prioridade: MVP.

## 4. Service Orders / OS

Objetivo: representar a execução autorizada de mão de obra técnica.

Responsabilidades:

- criar OS a partir de WorkItem;
- atribuir técnico/equipe;
- controlar status;
- registrar tempo;
- registrar diagnóstico, execução e evidências;
- permitir validação e encerramento.

Decisão importante: a OS deve ser end-to-end por objetivo, não necessariamente fragmentada por especialidade.

Exemplo:

```text
OS: restabelecer equipamento inoperante
├── diagnóstico telecom
├── verificação elétrica
├── teste funcional
└── validação
```

Entidades iniciais:

- ServiceOrder
- ServiceOrderAssignment
- ServiceOrderTask
- TimeEntry
- Evidence
- ServiceOrderStatusHistory

Prioridade: MVP.

## 5. Assets

Objetivo: representar ativos físicos, digitais e infraestrutura técnica.

Responsabilidades:

- cadastro de ativos;
- classificação;
- criticidade;
- localização;
- histórico de manutenção;
- vínculo com OS, evidências e eventos.

Entidades iniciais:

- Asset
- AssetType
- AssetLocation
- AssetStatus
- AssetEvent

Prioridade: MVP básico.

## 6. Event Log

Objetivo: registrar a memória operacional do sistema.

Responsabilidades:

- registrar eventos relevantes;
- manter rastreabilidade;
- alimentar livro de turno, relatórios e histórico de ativos;
- apoiar auditoria.

Eventos exemplos:

- work_item.created
- work_item.triaged
- service_order.created
- service_order.assigned
- service_order.completed
- service_order.approved
- asset.status_changed
- shift_log.closed
- document.approved

Entidade inicial:

- EventLog

Prioridade: MVP.

## 7. Shift Log / Livro de Turno

Objetivo: consolidar a operação por turno.

Responsabilidades:

- registrar ocorrências;
- vincular OS, WorkItems, ativos e eventos;
- registrar pendências;
- apoiar passagem de serviço;
- gerar resumo do turno.

Entidades iniciais:

- Shift
- ShiftLog
- ShiftLogEntry
- ShiftHandover

Prioridade: MVP simples.

## 8. Scheduling / Escalas

Objetivo: organizar escala, plantão, expediente e sobreaviso.

Responsabilidades:

- disponibilidade de técnicos;
- escalas;
- plantões;
- sobreaviso;
- conflitos de agenda;
- apoio à atribuição de OS.

Entidades futuras:

- Schedule
- ShiftAssignment
- OnCallPeriod
- Absence

Prioridade: fase 2.

## 9. Documentation Workflow

Objetivo: separar execução técnica de preparação documental.

Responsabilidades:

- rascunhos;
- despachos;
- relatórios;
- revisão por secretário técnico-operacional;
- validação por técnico;
- aprovação por supervisor;
- geração de documento final;
- preparação para sistema legado.

Estados sugeridos:

- draft
- prepared_by_secretary
- waiting_technician_review
- waiting_supervisor_approval
- approved
- signed
- exported_to_legacy
- archived
- returned_for_correction

Entidades futuras:

- Document
- DocumentReview
- DocumentApproval
- DocumentExport

Prioridade: fase 2.

## 10. Supervision / Approvals

Objetivo: formalizar decisão, delegação, validação e aprovação.

Responsabilidades:

- aprovar OS;
- validar relatórios;
- revisar livro de turno;
- priorizar demandas;
- remanejar equipe;
- escalonar problemas;
- diferenciar execução de aprovação.

Entidades futuras:

- Approval
- Delegation
- ReviewRequest
- SupervisorAction

Prioridade: fase 2.

## 11. Technical Planning

Objetivo: transformar dados operacionais em planejamento setorial.

Responsabilidades:

- plano anual de manutenção;
- substituição de ativos;
- necessidades de pessoal;
- necessidades de ferramentas;
- capacitação;
- aquisições;
- projetos técnicos;
- priorização por criticidade.

Entidades futuras:

- MaintenancePlan
- PlanningItem
- ResourceNeed
- TechnicalProject

Prioridade: fase 3.

## 12. Reports / BI

Objetivo: consolidar dados para gestão e decisão.

Responsabilidades:

- relatório mensal;
- indicadores de OS;
- horas técnicas;
- ativos mais problemáticos;
- pendências;
- produtividade;
- indisponibilidades;
- exportação de dados.

Entidades futuras:

- Report
- ReportTemplate
- ReportSnapshot

Prioridade: MVP básico, evoluindo na fase 2.

## 13. Legacy Integration

Objetivo: manter ponte com o sistema oficial/legado.

Responsabilidades:

- registrar protocolo oficial;
- controlar se foi lançado no legado;
- guardar status externo;
- preparar resumos para lançamento manual;
- no futuro, automatizar por API, RPA ou n8n.

Campos importantes:

- legacy_system_name
- legacy_record_id
- legacy_protocol_number
- legacy_status
- legacy_exported_at
- legacy_exported_by
- legacy_sync_status

Prioridade: fase 2, com registro manual no início.

## 14. Acquisitions / Necessidades de Compra

Objetivo: registrar necessidades sem automatizar regras administrativas prematuramente.

Responsabilidades:

- necessidade;
- justificativa;
- vínculo com ativo, OS ou planejamento;
- status;
- documentos anexos.

Prioridade: fase 3.

