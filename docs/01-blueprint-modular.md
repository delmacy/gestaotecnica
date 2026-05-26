# Blueprint Modular da Plataforma de Gestao Tecnica

> Nota: este blueprint representa a primeira visao modular da plataforma.
> A versao arquitetural atualizada, com core reutilizavel, workspaces e
> adaptacoes por cliente, esta em
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

Objetivo: prover a base tecnica e organizacional da aplicacao.

Responsabilidades:

- autenticacao;
- usuarios;
- organizacoes/unidades;
- configuracoes globais;
- auditoria basica;
- padroes de status, prioridade e classificacao.

Entidades iniciais:

- User
- Organization
- Department
- Team
- SystemRole
- AuditLog

Prioridade: MVP.

## 2. Workforce

Objetivo: modelar pessoas tecnicas, niveis de competencia e disponibilidade operacional.

Responsabilidades:

- cadastro de tecnicos;
- nivel profissional: trainee, pleno, especialista, supervisor;
- equipes;
- habilidades;
- disponibilidade;
- responsaveis por execucao ou validacao.

Entidades iniciais:

- TechnicianProfile
- Skill
- TechnicianSkill
- TeamMembership
- Availability

Prioridade: MVP parcial.

## 3. WorkItems / Demandas

Objetivo: ser o envelope universal de entrada e circulacao de necessidades.

Responsabilidades:

- registrar demanda;
- classificar tipo, prioridade e origem;
- manter status;
- vincular solicitante, ativo, equipe ou OS;
- sustentar demandas que ainda nao viraram execucao.

Exemplos de WorkItem:

- incidente operacional;
- solicitacao administrativa;
- vistoria;
- manutencao;
- pendencia de turno;
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

Objetivo: representar a execucao autorizada de mao de obra tecnica.

Responsabilidades:

- criar OS a partir de WorkItem;
- atribuir tecnico/equipe;
- controlar status;
- registrar tempo;
- registrar diagnostico, execucao e evidencias;
- permitir validacao e encerramento.

Decisao importante: a OS deve ser end-to-end por objetivo, nao necessariamente fragmentada por especialidade.

Exemplo:

```text
OS: restabelecer equipamento inoperante
├── diagnostico telecom
├── verificacao eletrica
├── teste funcional
└── validacao
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

Objetivo: representar ativos fisicos, digitais e infraestrutura tecnica.

Responsabilidades:

- cadastro de ativos;
- classificacao;
- criticidade;
- localizacao;
- historico de manutencao;
- vinculo com OS, evidencias e eventos.

Entidades iniciais:

- Asset
- AssetType
- AssetLocation
- AssetStatus
- AssetEvent

Prioridade: MVP basico.

## 6. Event Log

Objetivo: registrar a memoria operacional do sistema.

Responsabilidades:

- registrar eventos relevantes;
- manter rastreabilidade;
- alimentar livro de turno, relatorios e historico de ativos;
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

Objetivo: consolidar a operacao por turno.

Responsabilidades:

- registrar ocorrencias;
- vincular OS, WorkItems, ativos e eventos;
- registrar pendencias;
- apoiar passagem de servico;
- gerar resumo do turno.

Entidades iniciais:

- Shift
- ShiftLog
- ShiftLogEntry
- ShiftHandover

Prioridade: MVP simples.

## 8. Scheduling / Escalas

Objetivo: organizar escala, plantao, expediente e sobreaviso.

Responsabilidades:

- disponibilidade de tecnicos;
- escalas;
- plantoes;
- sobreaviso;
- conflitos de agenda;
- apoio a atribuicao de OS.

Entidades futuras:

- Schedule
- ShiftAssignment
- OnCallPeriod
- Absence

Prioridade: fase 2.

## 9. Documentation Workflow

Objetivo: separar execucao tecnica de preparacao documental.

Responsabilidades:

- rascunhos;
- despachos;
- relatorios;
- revisao por secretario tecnico-operacional;
- validacao por tecnico;
- aprovacao por supervisor;
- geracao de documento final;
- preparacao para sistema legado.

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

Objetivo: formalizar decisao, delegacao, validacao e aprovacao.

Responsabilidades:

- aprovar OS;
- validar relatorios;
- revisar livro de turno;
- priorizar demandas;
- remanejar equipe;
- escalonar problemas;
- diferenciar execucao de aprovacao.

Entidades futuras:

- Approval
- Delegation
- ReviewRequest
- SupervisorAction

Prioridade: fase 2.

## 11. Technical Planning

Objetivo: transformar dados operacionais em planejamento setorial.

Responsabilidades:

- plano anual de manutencao;
- substituicao de ativos;
- necessidades de pessoal;
- necessidades de ferramentas;
- capacitacao;
- aquisicoes;
- projetos tecnicos;
- priorizacao por criticidade.

Entidades futuras:

- MaintenancePlan
- PlanningItem
- ResourceNeed
- TechnicalProject

Prioridade: fase 3.

## 12. Reports / BI

Objetivo: consolidar dados para gestao e decisao.

Responsabilidades:

- relatorio mensal;
- indicadores de OS;
- horas tecnicas;
- ativos mais problematicos;
- pendencias;
- produtividade;
- indisponibilidades;
- exportacao de dados.

Entidades futuras:

- Report
- ReportTemplate
- ReportSnapshot

Prioridade: MVP basico, evoluindo na fase 2.

## 13. Legacy Integration

Objetivo: manter ponte com o sistema oficial/legado.

Responsabilidades:

- registrar protocolo oficial;
- controlar se foi lancado no legado;
- guardar status externo;
- preparar resumos para lancamento manual;
- no futuro, automatizar por API, RPA ou n8n.

Campos importantes:

- legacy_system_name
- legacy_record_id
- legacy_protocol_number
- legacy_status
- legacy_exported_at
- legacy_exported_by
- legacy_sync_status

Prioridade: fase 2, com registro manual no inicio.

## 14. Acquisitions / Necessidades de Compra

Objetivo: registrar necessidades sem automatizar regras administrativas prematuramente.

Responsabilidades:

- necessidade;
- justificativa;
- vinculo com ativo, OS ou planejamento;
- status;
- documentos anexos.

Prioridade: fase 3.

