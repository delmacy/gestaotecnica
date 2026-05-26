# Blueprint Core, Workspaces e Adaptacoes

Este blueprint organiza a plataforma como um **core operacional reutilizavel**,
capaz de receber adaptacoes por cliente/setor atraves de workspaces.

A primeira adaptacao real e a **secao-tecnica**, mas ela nao deve ser tratada
como o produto inteiro. Ela e o primeiro pacote de configuracao sobre um core
replicavel.

## 1. Tese arquitetural

```text
Core replicavel
+ modulos reutilizaveis
+ workspace do cliente
+ adaptacao/configuracao local
= sistema operacional sob medida
```

O objetivo e permitir que a plataforma seja usada futuramente como:

- aplicacao da sala/secao tecnica;
- base open source reutilizavel;
- system builder operacional para PMEs;
- pacote hospedado e mantido como servico recorrente;
- base para futuros repositorios `gestaotecnica-core` e `sala-tecnica-app`.

Regra central:

> O core fornece capacidades universais; a adaptacao ensina o sistema a operar
> com o vocabulario, fluxos, papeis e regras de um cliente.

## 2. Camadas da plataforma

### 2.1 Core Platform

Camada universal, sem conhecimento da secao tecnica.

Responsabilidades:

- eventos;
- auditoria;
- workflows;
- permissoes;
- filas;
- documentos;
- relatorios;
- notificacoes futuras;
- comentarios futuros;
- configuracao de modulos;
- contratos publicos entre modulos.

Nao deve conter termos como:

- plantao;
- sobreaviso;
- pendencia de turno;
- livro de servico;
- tecnico pleno;
- secretario tecnico-operacional;
- sistema oficial especifico.

Esses termos pertencem a adaptacao.

### 2.2 Domain Modules

Modulos reutilizaveis de dominio operacional.

Eles podem ser usados pela secao tecnica ou por outro cliente com configuracao
diferente.

Modulos atuais:

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

Workspace e a unidade de cliente, setor ou operacao.

No inicio existira:

```text
workspace: secao-tecnica
```

O workspace deve permitir:

- habilitar/desabilitar modulos;
- definir tipos de demanda;
- definir tipos de OS;
- definir tipos de escala;
- definir papeis;
- definir filas;
- definir workflows;
- definir templates documentais;
- definir templates de relatorio;
- configurar integracoes e legado.

### 2.4 Client Adaptation / Domain Pack

Adaptacao e o pacote que configura o workspace.

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

Evitar importar `secao-tecnica` diretamente nos modulos.

## 4. Estrutura futura de repositorios

Nao separar agora.

Separar apenas quando:

1. o MVP estiver funcionando;
2. a adaptacao `secao-tecnica` estiver estavel;
3. surgir uma segunda adaptacao real;
4. as interfaces publicas dos modulos estiverem mais maduras.

### 4.1 Futuro monorepo

```text
gestaotecnica/
|-- apps/
|   `-- sala-tecnica/
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
gestaotecnica-core
sala-tecnica-app
cliente-x-app
cliente-y-app
```

Frase guia:

> Primeiro separar conceitualmente por pastas; depois separar tecnicamente por
> pacotes; por ultimo separar operacionalmente por repositorios.

## 5. Mapa dos modulos

### 5.1 Foundation / Platform

Modulos e capacidades:

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

### 5.2 Entrada e circulacao de trabalho

Modulos:

- WorkItems;
- Global Search;
- Planning;
- Operations.

Inspiracoes:

- Jira: issue, prioridade, status, workflow;
- Trello: card, quadro, responsavel, lista/status;
- Zendesk: ticket, triagem, fila de atendimento, historico.

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
- filas padrao;
- se gera OS;
- se aparece no livro de turno;
- SLA;
- responsaveis iniciais;
- workflow.

### 5.3 Execucao operacional

Modulos:

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
- necessidade de aprovacao;
- regras de encerramento;
- templates de relatorio;
- relacao com WorkItems.

Evolucao futura:

- `service_order_targets`;
- `service_order_stages`;
- `service_order_tasks`;
- `approval_requests`;
- workflow instance congelada por OS.

### 5.4 Capacidade tecnica e disponibilidade

Modulos:

- Workforce;
- Skills;
- Schedules;
- Resource Needs.

Configuravel por workspace:

- papeis de negocio;
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

Modulos:

- Assets;
- Inventory;
- Maintenance Plans;
- Technical Projects;
- Acquisitions.

Conceitos universais:

- ativo como entidade de vida longa;
- estoque como recursos consumiveis ou reservaveis;
- plano como intencao tecnica futura;
- projeto como iniciativa tecnica;
- aquisicao como necessidade, nao como processo completo de compras.

Configuravel por workspace:

- tipos de ativo;
- criticidade;
- campos por tipo;
- topologia;
- tipos de material;
- fluxo de aquisicao;
- documentos exigidos.

Evolucao futura:

- `asset_types`;
- `asset_relations`;
- `asset_ports`;
- `connections`;
- `custom_fields`;
- procurement workflow apos estudar regras reais.

### 5.6 Documentos, evidencias e legado

Modulos:

- Documents;
- Evidences;
- Legacy;
- Reports.

Conceitos universais:

- evidencia como prova operacional;
- documento como artefato revisavel/aprovavel;
- legado como vinculo com sistema externo;
- relatorio como consolidacao.

Configuravel por workspace:

- templates documentais;
- templates de relatorio;
- sistema legado;
- campos de protocolo;
- status externos;
- eventos que aparecem nos relatorios.

Evolucao futura:

- `document_templates`;
- `report_templates`;
- versionamento de documentos;
- assinatura;
- exportacao PDF;
- integration logs;
- sync jobs;
- webhooks.

### 5.7 Governanca, suprimentos e conformidade

Modulos:

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

## 6. Schema configuravel por workspace

Como nao ha dados de producao, a arquitetura pode migrar os enums mais
especificos para tabelas configuraveis.

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

### 6.2 Tabelas configuraveis iniciais

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

Cada tabela configuravel deve ter, no minimo:

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

## 7. Adaptacao inicial: secao-tecnica

Workspace inicial:

```text
key: secao-tecnica
name: Secao Tecnica
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
- descricao;
- prioridade padrao;
- fila padrao;
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
- necessidade de aprovacao;
- template de documento/relatorio.

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

### 7.4 Papeis de negocio

- tecnico_trainee;
- tecnico_pleno;
- tecnico_especialista;
- supervisor_tecnico;
- secretario_tecnico_operacional;
- chefe_interino.

Nao confundir:

- usuario;
- cargo;
- permissao;
- papel no processo;
- papel temporario na OS;
- papel de negocio.

### 7.5 Filas

- operacional-n1;
- triagem-tecnica;
- supervisao-tecnica;
- secretaria-tecnica;
- livro-turno;
- planejamento-tecnico.

### 7.6 Workflows iniciais

- fluxo padrao de demanda;
- fluxo padrao de OS;
- fluxo padrao de documento tecnico.

No inicio, workflow pode documentar e orientar status.

Depois, pode evoluir para:

```text
workflow_template
-> workflow_variant
-> workflow_instance
```

## 8. Relacao com Trello, Jira e Zendesk

Essas ferramentas nao devem ser copiadas diretamente. Elas servem como
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
- workflow configuravel;
- transicoes;
- historico;
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
- historico;
- base de conhecimento.

No sistema:

- WorkItem como ticket operacional;
- queues por workspace;
- service catalog;
- knowledge/troubleshooting futuro.

## 9. Ordem recomendada de implementacao

1. Mergear a base visual com shadcn.
2. Criar `workspaces` e workspace seed `secao-tecnica`.
3. Criar tabelas configuraveis iniciais.
4. Migrar `work_items.type` para `work_item_type_id`.
5. Migrar `schedules.type` para `schedule_type_id`.
6. Migrar `technician_profiles.level` para `business_role_id`.
7. Adicionar `service_order_type_id` em `service_orders`.
8. Adicionar `workspace_id` nas entidades principais.
9. Criar `src/adaptations/active.ts`.
10. Criar `src/adaptations/secao-tecnica`.
11. Atualizar forms/actions/queries para buscar opcoes por workspace.
12. Criar documentacao dos modulos e da adaptacao.
13. Validar build, lint, rotas e fluxos principais.

## 10. Criterios de aceite

A etapa estara correta quando:

- existir workspace `secao-tecnica`;
- tipos de demanda vierem de `work_item_types`;
- tipos de escala vierem de `schedule_types`;
- papeis/niveis vierem de `business_roles`;
- OS puder receber `service_order_type_id`;
- entidades principais tiverem `workspace_id`;
- modulos nao precisarem conhecer termos especificos da secao tecnica;
- existir documentacao clara de core, modulos e adaptacao;
- `npm run lint` passar;
- `npm run build` passar;
- rotas principais responderem 200;
- fluxos de criar demanda, OS, tecnico e escala continuarem funcionando.

## 11. Frases guia

> O modulo universal nao conhece o cliente; a adaptacao ensina o modulo a operar
> naquele cliente.

> O core e produto; a adaptacao e projeto.

> O workspace e o limite de configuracao, dados, vocabulario e regra local.

> Primeiro separe por pastas; depois por pacotes; por ultimo por repositorios.
