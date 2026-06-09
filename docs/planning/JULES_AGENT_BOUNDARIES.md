# Jules Agent Boundaries

## 1. Objetivo

Definir como nomear, escopar e limitar agentes Jules por domínio e função, com a finalidade de reduzir colisões, acoplamento indevido e mitigar a necessidade de prompts gigantes. Essa taxonomia oficial direciona as responsabilidades e restrições de cada subtipo de agente.

## 2. Convenção de nomes

O formato oficial para identificar a persona e o papel do agente é:

`Jules <Role> <Domain> [Scope]`

Onde:
- `<Role>` (Obrigatório): Função primária do agente.
- `<Domain>` (Obrigatório): Bounded context ou módulo em que atua.
- `[Scope]` (Opcional): Delimitação adicional do escopo de atuação (ex: Backend, UI, E2E, Contract, Migration, Security, Integration).

## 3. Roles

Roles obrigatórios para agentes Jules:

- **Doc**: Responsável pela documentação técnica, especificação, manutenção de contratos, regras arquiteturais e handoff.
- **Dev**: Responsável por codificação de novas features, refatorações, criação de UIs, backends, esquemas de bancos de dados autorizados e integração técnica.
- **Tester**: Responsável por criação e manutenção de testes (E2E, unitários, integração) e garantia de cobertura.
- **Reviewer**: Responsável por code review, validação de pull requests, verificação de paridade e regras de DDD/arquitetura.
- **Orchestrator**: Responsável pela coordenação entre múltiplos agentes, gerenciamento de filas de tarefas, paralelização ou orquestração de entregas.

## 4. Domains

Domínios obrigatórios:

- Core
- Auth
- Builder
- Runtime
- Gateway
- Workspace
- AgentOps
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

## 5. Authorized scope by domain

Regras do que cada agente pode alterar e o que pode apenas ler em seu domínio:

### Jules Core
1. **Pode alterar**: Capability registry, module registry, process candidates, process definitions, process versions, blueprints, governance core, trace receipts.
2. **Pode apenas ler**: Outros domínios dependentes.

### Jules Auth
1. **Pode alterar**: Users, auth accounts, sessions, access profiles, login/logout, route guards, permissions base, workspace membership.
2. **Pode apenas ler**: Outras configurações do sistema.

### Jules Builder
1. **Pode alterar**: Admin UI, builder UI, control plane, candidate review UI, gateway receipts UI, navigation do builder.
2. **Pode apenas ler**: Backend definitions.

### Jules Runtime
1. **Pode alterar**: Process instances, state transitions, action executions, runtime events, outbox, runtime receipts.
2. **Pode apenas ler**: Definitions e configurations.

### Jules Gateway
1. **Pode alterar**: Agent gateway, submissions, receipts, idempotency, correlation id, external agent boundary.
2. **Pode apenas ler**: Regras e limites de API.

### Jules Workspace
1. **Pode alterar**: Workspace config, workspace settings, consent logs.
2. **Pode apenas ler**: Base users.

### Jules AgentOps
1. **Pode alterar**: Operational configuration, metadados operacionais do agente.
2. **Pode apenas ler**: Limites operacionais.

### Jules SkillPacks
1. **Pode alterar**: SKILL.md, skill.json, policies.md, examples, output schemas, forbidden actions, human approval rules.
2. **Pode apenas ler**: Códigos executáveis base.

### Módulos de Negócio (WorkIntakeModule, CaseManagementModule, DocumentWorkflowModule, ApprovalWorkflowModule, AssetManagementModule, SchedulingModule, WorkforceModule, HumanResourcesModule, InventoryModule, ReportingModule)
1. **Pode alterar no respectivo módulo**: Contracts, forms, process templates, policies, adapters próprios, UI isolada do módulo.
2. **Pode apenas ler**: Core registry.

### Jules AdaptationGestaoTecnica
1. **Pode alterar**: Vocabulário de Gestão Técnica, ordens de serviço (OS), escala técnica, ativos técnicos, telecom/elétrica/auxílios, mapping de módulos genéricos para Gestão Técnica.
2. **Pode apenas ler**: Módulos genéricos (Platform Core).

## 6. Forbidden scope by domain

Regras do que é estritamente proibido para cada domínio:

### Jules Core
- **Proibido**: Auth, módulos específicos, adaptação Gestão Técnica, UI operacional específica.

### Jules Auth
- **Proibido**: Gateway, runtime engine, capability modules, adaptation Gestão Técnica.

### Jules Builder
- **Proibido**: Core schema sem contrato, auth rules sem Jules Auth, runtime engine.

### Jules Runtime
- **Proibido**: Adaptation-specific rules, auth, module registry.

### Jules Gateway
- **Proibido**: N8n signal inbox (salvo fase explícita), Paperclip real sem autorização, auth, runtime engine.

### Jules Workspace
- **Proibido**: Alterar dados globais independentes de workspace.

### Jules AgentOps
- **Proibido**: Core configurations e Auth.

### Jules SkillPacks
- **Proibido**: Código executável livre, publicação automática, aprovação automática, acesso a segredo, execução operacional direta.

### Módulos de Negócio (Todos)
- **Proibido**: Core registry sem contrato, runtime engine, auth, AppShell global, migration compartilhada sem aprovação.

### Jules AdaptationGestaoTecnica
- **Proibido**: Platform Core, Capability Module genérico, Auth, Runtime Engine.

### Regras Gerais (Proibido para o contexto de DOC-GOV-01 ou se não explicitamente autorizado)
- Não alterar código fora do escopo.
- Não alterar schema fora do escopo.
- Não criar migration.
- Não mexer em auth (exceto Jules Auth).
- Não mexer em Gateway (exceto Jules Gateway).
- Não mexer em Runtime (exceto Jules Runtime).
- Não mexer em AppShell.
- Não iniciar jobs de módulos sem fase.
- Não alterar status de PHASE-31.

## 7. Parallelization rule

- Documentação de módulos pode paralelizar (ex: Doc WorkIntake e Doc DocumentWorkflow).
- Implementação de módulos só pode paralelizar se não tocar em core compartilhado.
- Auth nunca deve paralelizar com UI/admin sensível.
- Runtime engine não paraleliza.
- Registry core não paraleliza.
- AppShell global não paraleliza.
- Migrations compartilhadas não paralelizam.
- Adaptação não pode alterar Core.

## 8. Collision matrix

| Combinação | Paralelo? | Motivo |
| --- | ---: | --- |
| Doc WorkIntake + Doc DocumentWorkflow | Sim | Contratos isolados |
| Dev Auth + Dev Builder | Não | Rotas/AppShell/permissões |
| Dev Gateway + Dev Builder | Cuidado | Pode tocar /admin/gateway |
| Dev Runtime + Dev Core | Não | Engine e contratos centrais |
| Doc SkillPacks + Dev 30B | Sim | Documental isolado |
| Dev WorkforceModule + Dev SchedulingModule | Cuidado | Pode compartilhar workforce/schedule |
| Dev AdaptationGestaoTecnica + Dev Core | Não | Risco de contaminação |

## 9. Prompt template

Todo prompt para a atuação de um agente Jules deve seguir esta estrutura base.

Você é `Jules <Role> <Domain> [Scope]`.

Seu domínio autorizado é:
- ...

Você NÃO pode alterar:
- ...

**Regra de parada:**
Se encontrar necessidade de modificar código ou arquivos fora do seu domínio, você deve parar imediatamente e:
- registrar como dependency/gap;
- não implementar o código fora de escopo;
- pedir a criação ou execução de uma fase específica para aquele domínio.

## 10. Final report template

O relatório final da atuação de um agente Jules deve incluir:

- Domínio atuado
- Arquivos alterados
- Boundaries respeitados
- Boundaries tocados
- Conflitos potenciais
- Dependências externas
- Próximas fases
- Status (ex: READY FOR NEXT BOX | BLOCKED | NEEDS REVIEW)
