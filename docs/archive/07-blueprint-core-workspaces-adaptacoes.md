# Blueprint da System Builder Platform

Este blueprint organiza a plataforma como uma **system builder platform**:
um core operacional reutilizável capaz de receber módulos, packs contextuais,
plugins e adaptações por cliente através de workspaces.

A primeira adaptação real é a **seção técnica**, mas ela não deve ser tratada
como o produto inteiro. Ela é o primeiro pacote de configuração sobre um core
replicável.

## 1. Tese arquitetural

```text
Core replicável
+ módulos reutilizáveis
+ packs contextuais
+ workspace do cliente
+ adaptação/configuração local
= sistema operacional sob medida para um cliente, setor ou operação
```

O objetivo é permitir que a plataforma seja usada futuramente como:

- system builder operacional para PMEs e equipes internas;
- base open source reutilizável;
- pacote hospedado e mantido como serviço recorrente;
- fábrica de aplicações por workspace, cliente e domínio;
- base para futuros repositórios `system-builder-core` e apps/packs por cliente.

Regra central:

> O core fornece capacidades universais; a adaptação ensina o sistema a operar
> com o vocabulário, fluxos, papéis e regras de um cliente.

## 2. Camadas da plataforma

### 2.1 Core Platform

Camada universal, sem conhecimento de qualquer cliente específico.

Responsabilidades:

- eventos;
- auditoria;
- workflows;
- permissões;
- filas;
- documentos;
- relatórios;
- notificações futuras;
- comentários futuros;
- configuração de módulos;
- contratos públicos entre módulos.

Não deve conter termos como:

- plantao;
- sobreaviso;
- pendencia de turno;
- livro de serviço;
- técnico pleno;
- secretario técnico-operacional;
- sistema oficial específico.

Esses termos pertencem à adaptação.

### 2.2 Domain Modules

Módulos reutilizáveis de domínio operacional.

Eles podem ser usados por qualquer cliente, setor ou departamento com
configuração diferente.

Módulos atuais:

- Dashboard;
- Operations;
- Global Search;
- WorkItems;
- Service Orders;
- Assets;
- Workforce;
- Schedules;
- Shifts;
- Timesheets;
- Evidences;
- Documents;
- Legacy;
- Reports;
- Events;
- Approvals;
- Planning;
- Strategy;
- Maintenance Plans;
- Technical Projects;
- Acquisitions;
- Skills;
- Resource Needs;
- Automations;
- Suppliers;
- Inventory;
- Compliance.

### 2.3 Workspace

Workspace é a unidade de cliente, setor ou operação.

No início existira:

```text
workspace: exemplo-secao-tecnica
```

O workspace deve permitir:

- habilitar/desabilitar módulos;
- definir tipos de demanda;
- definir tipos de OS;
- definir tipos de escala;
- definir papéis;
- definir filas;
- definir workflows;
- definir templates documentais;
- definir templates de relatório;
- configurar integrações e legado.

### 2.4 Client Adaptation / Domain Pack

Adaptação e o pacote que configura o workspace.

Para a primeira versao:

```text
src/adaptations/secao-tecnica
```

No futuro:

```text
domain-packs/secao-tecnica
domain-packs/cliente-x
domain-packs/cliente-y
```

## 3. Estrutura alvo no repositorio atual

Neste momento o projeto deve continuar como um unico repositorio Next.js.

Estrutura desejada:

```text
src/
|-- platform/
|   |-- events/
|   |-- workflow/
|   |-- permissions/
|   |-- queues/
|   |-- documents/
|   |-- reports/
|   |-- audit/
|   `-- index.ts
|
|-- modules/
|   |-- work-items/
|   |-- service-orders/
|   |-- assets/
|   |-- workforce/
|   |-- schedules/
|   |-- shifts/
|   |-- documents/
|   |-- legacy/
|   |-- inventory/
|   |-- compliance/
|   `-- ...
|
|-- adaptations/
|   |-- active.ts
|   `-- secao-tecnica/
|       |-- index.ts
|       |-- terminology.ts
|       |-- demand-types.ts
|       |-- service-order-types.ts
|       |-- asset-types.ts
|       |-- shift-types.ts
|       |-- roles.ts
|       |-- queues.ts
|       |-- workflows.ts
|       |-- report-templates.ts
|       |-- document-templates.ts
|       |-- legacy.ts
|       `-- README.md
|
|-- app/
|-- db/
|-- components/
`-- lib/
```

Regra de importacao:

```ts
import { activeAdaptation } from "@/adaptations/active";
```

Evitar importar `secao-tecnica` diretamente nos módulos.

## 4. Estrutura futura de repositórios

Não separar agora.

Separar apenas quando:

1. o MVP estiver funcionando;
2. a adaptação `secao-tecnica` estiver estável;
3. surgir uma segunda adaptação real;
4. as interfaces publicas dos módulos estiverem mais maduras.

### 4.1 Futuro monorepo

```text
system-builder-platform/
|-- apps/
|   |-- secao-tecnica/
|   `-- cliente-x/
|-- packages/
|   |-- core/
|   |-- work-items/
|   |-- service-orders/
|   |-- assets/
|   |-- workforce/
|   `-- ui/
`-- domain-packs/
    `-- secao-tecnica/
```

### 4.2 Futuro multi-repo

```text
system-builder-core
secao-tecnica-app
cliente-x-app
cliente-y-app
```

Frase guia:

> Primeiro separar conceitualmente por pastas; depois separar tecnicamente por
> pacotes; por ultimo separar operacionalmente por repositórios.

## 5. Mapa dos módulos

### 5.1 Foundation / Platform

Módulos e capacidades:

- users;
- teams;
- events;
- reports;
- dashboard;
- permissions futuras;
- audit futuro;
- notifications futuras.

Natureza:

- core universal;
- pouco dependente de cliente;
- deve suportar todos os workspaces.

### 5.2 Entrada e circulação de trabalho

Módulos:

- WorkItems;
- Global Search;
- Planning;
- Operations.

Inspiracoes:

- Jira: issue, prioridade, status, workflow;
- Trello: card, quadro, responsavel, lista/status;
- Zendesk: ticket, triagem, fila de atendimento, histórico.

No produto:

```text
Ticket/Demanda
-> WorkItem
-> Triagem
-> Planejamento
-> OS ou outra execucao
```

O `WorkItem` deve ser o envelope universal.

Configuravel por workspace:

- tipos de demanda;
- labels;
- filas padrão;
- se gera OS;
- se aparece no livro de turno;
- SLA;
- responsaveis iniciais;
- workflow.

### 5.3 Execucao operacional

Módulos:

- Service Orders;
- Approvals;
- Timesheets;
- Evidences;
- Shifts.

O conceito universal:

```text
ServiceOrder = execucao autorizada de trabalho/mao de obra
```

Configuravel por workspace:

- tipos de OS;
- necessidade de ativo;
- necessidade de evidencia;
- necessidade de aprovação;
- regras de encerramento;
- templates de relatório;
- relação com WorkItems.

Evolucao futura:

- `service_order_targets`;
- `service_order_stages`;
- `service_order_tasks`;
- `approval_requests`;
- workflow instance congelada por OS.

### 5.4 Capacidade técnica e disponibilidade

Módulos:

- Workforce;
- Skills;
- Schedules;
- Resource Needs.

Configuravel por workspace:

- papéis de negócio;
- niveis profissionais;
- tipos de escala;
- regras de sobreposicao;
- competencias exigidas;
- disponibilidade e bloqueios.

Evolucao futura:

- separar cargo, papel, permissao e funcao temporaria;
- `workforce_allocations`;
- `unavailabilities`;
- `certifications`;
- `role_assignments`.

### 5.5 Ativos, infraestrutura e materiais

Módulos:

- Assets;
- Inventory;
- Maintenance Plans;
- Technical Projects;
- Acquisitions.

Conceitos universais:

- ativo como entidade de vida longa;
- estoque como recursos consumiveis ou reservaveis;
- plano como intenção técnica futura;
- projeto como iniciativa técnica;
- aquisição como necessidade, não como processo completo de compras.

Configuravel por workspace:

- tipos de ativo;
- criticidade;
- campos por tipo;
- topologia;
- tipos de material;
- fluxo de aquisição;
- documentos exigidos.

Evolucao futura:

- `asset_types`;
- `asset_relations`;
- `asset_ports`;
- `connections`;
- `custom_fields`;
- procurement workflow apos estudar regras reais.

### 5.6 Documentos, evidencias e legado

Módulos:

- Documents;
- Evidences;
- Legacy;
- Reports.

Conceitos universais:

- evidencia como prova operacional;
- documento como artefato revisavel/aprovavel;
- legado como vinculo com sistema externo;
- relatório como consolidacao.

Configuravel por workspace:

- templates documentais;
- templates de relatório;
- sistema legado;
- campos de protocolo;
- status externos;
- eventos que aparecem nos relatórios.

Evolucao futura:

- `document_templates`;
- `report_templates`;
- versionamento de documentos;
- assinatura;
- exportacao PDF;
- integration logs;
- sync jobs;
- webhooks.

### 5.7 Governança, suprimentos e conformidade

Módulos:

- Suppliers;
- Compliance;
- Automations;
- Events.

Configuravel por workspace:

- categorias de fornecedor;
- tipos de contrato;
- areas auditadas;
- severidade;
- status de achados;
- automacoes habilitadas;
- endpoints e providers.

Evolucao futura:

- policy engine;
- rules por workspace;
- automation outbox;
- webhook deliveries;
- correlation_id e causation_id em eventos.

## 6. Schema configurável por workspace

Como não há dados de produção, a arquitetura pode migrar os enums mais
específicos para tabelas configuráveis.

### 6.1 Tabelas base

```text
workspaces
workspace_module_configs
```

Campos sugeridos para `workspaces`:

- id;
- key;
- name;
- description;
- status;
- created_at;
- updated_at.

Campos sugeridos para `workspace_module_configs`:

- id;
- workspace_id;
- module_key;
- is_enabled;
- settings;
- created_at;
- updated_at.

### 6.2 Tabelas configuráveis iniciais

```text
work_item_types
service_order_types
schedule_types
business_roles
asset_types
queues
workflow_templates
workflow_states
document_templates
report_templates
```

Cada tabela configurável deve ter, no mínimo:

- id;
- workspace_id;
- key;
- label;
- description;
- is_active;
- sort_order;
- settings/payload jsonb;
- created_at;
- updated_at.

### 6.3 Colunas que devem migrar

Migrar:

- `work_items.type` para `work_item_type_id`;
- `schedules.type` para `schedule_type_id`;
- `technician_profiles.level` para `business_role_id`;
- `service_orders` deve ganhar `service_order_type_id`;
- entidades principais devem ganhar `workspace_id`.

Entidades que devem receber `workspace_id` primeiro:

- work_items;
- service_orders;
- assets;
- schedules;
- shifts;
- technical_documents;
- legacy_records;
- maintenance_plans;
- technical_projects;
- acquisition_needs;
- skill_catalog;
- resource_needs;
- automation_rules;
- suppliers;
- inventory_items;
- compliance_audits;
- reports.

## 7. Adaptação inicial: seção técnica

Workspace inicial:

```text
key: secao-tecnica
name: Seção Técnica
```

### 7.1 Tipos de demanda

- incidente;
- solicitacao;
- vistoria;
- manutencao;
- pendencia_turno;
- atividade_planejada;
- administrativo.

Cada tipo deve poder configurar:

- label;
- descrição;
- prioridade padrão;
- fila padrão;
- se pode gerar OS;
- se aparece no livro de turno;
- SLA futuro.

### 7.2 Tipos de OS

- manutencao;
- vistoria;
- atividade_administrativa;
- apoio_operacional.

Cada tipo deve poder configurar:

- necessidade de ativo;
- necessidade de apontamento de tempo;
- necessidade de evidencia;
- necessidade de aprovação;
- template de documento/relatório.

### 7.3 Tipos de escala

- expediente;
- plantao;
- sobreaviso;
- ausencia.

Cada tipo deve poder configurar:

- se exige livro de turno;
- se recebe tickets;
- se recebe OS;
- se permite sobreposicao;
- se bloqueia disponibilidade.

### 7.4 Papéis de negócio

- tecnico_trainee;
- tecnico_pleno;
- tecnico_especialista;
- supervisor_tecnico;
- secretario_tecnico_operacional;
- chefe_interino.

Não confundir:

- usuário;
- cargo;
- permissao;
- papel no processo;
- papel temporario na OS;
- papel de negócio.

### 7.5 Filas

- operacional-n1;
- triagem-técnica;
- supervisao-técnica;
- secretaria-técnica;
- livro-turno;
- planejamento-técnico.

### 7.6 Workflows iniciais

- fluxo padrão de demanda;
- fluxo padrão de OS;
- fluxo padrão de documento técnico.

No início, workflow pode documentar e orientar status.

Depois, pode evoluir para:

```text
workflow_template
-> workflow_variant
-> workflow_instance
```

## 8. Relacao com Trello, Jira e Zendesk

Essas ferramentas não devem ser copiadas diretamente. Elas servem como
referencias de padroes operacionais.

### Trello

Inspirar:

- quadro;
- card;
- listas/status;
- responsavel;
- visao visual simples;
- arrastar entre etapas futuramente.

No sistema:

- WorkItem card;
- board por workflow;
- filas por workspace.

### Jira

Inspirar:

- issue;
- tipo de issue;
- prioridade;
- workflow configurável;
- transicoes;
- histórico;
- SLA;
- filtros e views.

No sistema:

- WorkItem;
- Process/WorkflowTemplate;
- WorkflowState;
- EventLog;
- saved views futuras.

### Zendesk

Inspirar:

- ticket;
- canal de entrada;
- fila;
- triagem;
- atendimento;
- escalonamento;
- histórico;
- base de conhecimento.

No sistema:

- WorkItem como ticket operacional;
- queues por workspace;
- service catalog;
- knowledge/troubleshooting futuro.

## 9. Ordem recomendada de implementacao

1. Mergear a base visual com shadcn.
2. Criar `workspaces` e workspace seed `secao-tecnica`.
3. Criar tabelas configuráveis iniciais.
4. Migrar `work_items.type` para `work_item_type_id`.
5. Migrar `schedules.type` para `schedule_type_id`.
6. Migrar `technician_profiles.level` para `business_role_id`.
7. Adicionar `service_order_type_id` em `service_orders`.
8. Adicionar `workspace_id` nas entidades principais.
9. Criar `src/adaptations/active.ts`.
10. Criar `src/adaptations/secao-tecnica`.
11. Atualizar forms/actions/queries para buscar opções por workspace.
12. Criar documentação dos módulos e da adaptação.
13. Validar build, lint, rotas e fluxos principais.

## 10. Criterios de aceite

A etapa estara correta quando:

- existir workspace `secao-tecnica`;
- tipos de demanda vierem de `work_item_types`;
- tipos de escala vierem de `schedule_types`;
- papéis/niveis vierem de `business_roles`;
- OS puder receber `service_order_type_id`;
- entidades principais tiverem `workspace_id`;
- módulos não precisarem conhecer termos específicos da seção técnica;
- existir documentação clara de core, módulos e adaptação;
- `npm run lint` passar;
- `npm run build` passar;
- rotas principais responderem 200;
- fluxos de criar demanda, OS, técnico e escala continuarem funcionando.

## 11. Frases guia

> O módulo universal não conhece o cliente; a adaptação ensina o módulo a operar
> naquele cliente.

> O core e produto; a adaptação e projeto.

> O workspace e o limite de configuração, dados, vocabulário e regra local.

> Primeiro separe por pastas; depois por pacotes; por ultimo por repositórios.
