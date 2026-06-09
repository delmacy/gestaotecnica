# Jules Agent Boundaries

## 1. Objetivo

Definir como nomear, escopar e limitar agentes Jules por domínio.

## 2. Convenção de nomes

Formato:

Jules <Role> <Domain> [Scope]

Roles permitidos:

- Doc
- Dev
- Tester
- Reviewer

Domains permitidos:

- Core
- Auth
- Builder
- Runtime
- Gateway
- Workspace
- SkillPacks
- WorkIntakeModule
- CaseManagementModule
- DocumentWorkflowModule
- ApprovalWorkflowModule
- AssetManagementModule
- SchedulingModule
- WorkforceModule
- HumanResourcesModule
- InventoryModule
- ReportingModule
- AdaptationGestaoTecnica

Scopes opcionais:

- Contract
- Backend
- UI
- E2E
- Migration
- Security
- Integration

## 3. Domínios

### Jules Core

Pode atuar em:

- capability registry
- module registry
- process candidates
- process definitions
- process versions
- blueprints
- governance core
- trace receipts

Não pode atuar em:

- auth
- módulos específicos
- adaptação Gestão Técnica
- UI operacional específica

### Jules Auth

Pode atuar em:

- users
- auth accounts
- sessions
- access profiles
- login/logout
- route guards
- permissions base
- workspace membership

Não pode atuar em:

- gateway
- runtime engine
- capability modules
- adaptation Gestão Técnica

### Jules Builder

Pode atuar em:

- admin UI
- builder UI
- control plane
- candidate review UI
- gateway receipts UI
- navigation do builder

Não pode atuar em:

- core schema sem contrato
- auth rules sem Jules Auth
- runtime engine

### Jules Runtime

Pode atuar em:

- process instances
- state transitions
- action executions
- runtime events
- outbox
- runtime receipts

Não pode atuar em:

- adaptation-specific rules
- auth
- module registry

### Jules Gateway

Pode atuar em:

- agent gateway
- submissions
- receipts
- idempotency
- correlation id
- external agent boundary

Não pode atuar em:

- n8n signal inbox, salvo fase explícita
- Paperclip real sem autorização
- auth
- runtime engine

### Jules Capability Module

Pode atuar no módulo correspondente:

- contracts
- forms
- process templates
- policies
- skill packs
- adapters próprios
- UI isolada do módulo

Não pode atuar em:

- core registry sem contrato
- runtime engine
- auth
- AppShell global
- migration compartilhada sem aprovação

### Jules AdaptationGestaoTecnica

Pode atuar em:

- vocabulário Gestão Técnica
- OS
- escala técnica
- ativos técnicos
- telecom/elétrica/auxílios
- mapping de módulos genéricos para Gestão Técnica

Não pode atuar em:

- Platform Core
- Capability Module genérico
- Auth
- Runtime Engine

### Jules SkillPacks

Pode atuar em:

- SKILL.md
- skill.json
- policies.md
- examples
- output schemas
- forbidden actions
- human approval rules

Não pode atuar em:

- código executável livre
- publicação automática
- aprovação automática
- acesso a segredo
- execução operacional direta

## 4. Matriz de conflito

| Combinação | Paralelo? | Motivo |
| --- | ---: | --- |
| Doc WorkIntake + Doc DocumentWorkflow | Sim | Contratos isolados |
| Dev Auth + Dev Builder | Não | Rotas/AppShell/permissões |
| Dev Gateway + Dev Builder | Cuidado | Pode tocar /admin/gateway |
| Dev Runtime + Dev Core | Não | Engine e contratos centrais |
| Doc SkillPacks + Dev 30B | Sim | Documental isolado |
| Dev WorkforceModule + Dev SchedulingModule | Cuidado | Pode compartilhar workforce/schedule |
| Dev AdaptationGestaoTecnica + Dev Core | Não | Risco de contaminação |

## 5. Regras de paralelização

- Documentação de módulos pode paralelizar.
- Implementação de módulos só pode paralelizar se não tocar core compartilhado.
- Auth nunca deve paralelizar com UI/admin sensível.
- Runtime engine não paraleliza.
- Registry core não paraleliza.
- AppShell global não paraleliza.
- Migrations compartilhadas não paralelizam.
- Adaptação não pode alterar Core.

## 6. Template obrigatório de prompt

Todo prompt deve começar com:

Você é Jules <Role> <Domain>.

Seu domínio autorizado:

- ...

Você NÃO pode alterar:

- ...

Se encontrar necessidade fora do domínio:

- registre como dependency/gap;
- não implemente;
- peça fase específica.

## 7. Template de relatório final

O relatório deve incluir:

- Domínio atuado
- Arquivos alterados
- Boundaries respeitados
- Boundaries tocados
- Conflitos potenciais
- Dependências externas
- Próximas fases
- Status
