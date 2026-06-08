# DDD Guidelines — System Builder

## 1. Objetivo
O projeto System Builder não busca adotar um DDD (Domain-Driven Design) cerimonial completo ou burocrático. O objetivo é adotar um **DDD pragmático** para garantir que o código reflita com clareza as intenções de negócio e seja de fácil manutenção. Os pilares dessa abordagem são:
- **Linguagem ubíqua:** Utilizar a mesma terminologia no código, nas interfaces e na documentação.
- **Bounded contexts claros:** Delimitar bem as fronteiras entre os módulos do sistema.
- **Regras de domínio testáveis:** Isolar a lógica de negócio para facilitar a escrita de testes rápidos e confiáveis.
- **Application services/Use cases:** Orquestrar operações através de casos de uso explícitos que mapeiam as ações do usuário ou do sistema.
- **Repositories como portas:** Abstrair a persistência de dados através de interfaces (Ports), facilitando a troca ou mockagem de banco de dados.
- **Adapters de infraestrutura:** Isolar tecnologias específicas (como ORMs, chamadas HTTP, bibliotecas externas) atrás de adaptadores.
- **UI operando casos de uso:** Os componentes visuais não devem conter lógica de negócio; eles apenas invocam os casos de uso ou exibem o estado.
- **Eventos/receipts para rastreabilidade:** Utilizar eventos de domínio para comunicar mudanças de estado e registrar recibos ("receipts") rastreáveis de integrações externas.

## 2. Princípios

- **The Principle is the Process:** O processo é a espinha dorsal de tudo que o System Builder faz.
- **Follow the Process:** Toda funcionalidade deve respeitar a forma e os limites dos processos definidos.
- **Understand. Mirror. Evolve:** A arquitetura deve primeiro entender o domínio, refletir esse entendimento no código e evoluir a partir dessa base.
- **Postgres é Source of Truth:** O banco de dados PostgreSQL é a fonte definitiva da verdade operacional. O estado persiste nele e não em camadas transitórias.
- **n8n é borda, não domínio:** O n8n (e ferramentas similares de automação) serve apenas como meio de transporte de sinais e integrações de borda, sem executar ou controlar a lógica de domínio do System Builder.
- **Paperclip/agentes propõem; humanos aprovam:** Entidades de Inteligência Artificial ou sistemas externos podem sugerir alterações, criar rascunhos ou gerar métricas, mas qualquer publicação de processo requer aprovação humana explícita.
- **Process Candidate é ponte entre observação e processo formal:** Uma proposta de processo originada externamente não vira workflow automaticamente. Ela se torna um `Process Candidate`, aguardando revisão.
- **Runtime executa processo publicado, não rascunho:** A execução (`runtime`) deve se apoiar apenas em versões publicadas, testadas e aprovadas de processos, ignorando drafts ou work-in-progress.
- **Workspace isolation é obrigatório:** Todas as operações que afetam dados técnicos ou processuais devem estar contidas no contexto do workspace correspondente.
- **JSONB é permitido para payload/snapshot/evidence, não para fugir de modelagem:** O uso de `JSONB` no PostgreSQL é liberado apenas para dados que são naturalmente flexíveis (ex: payloads externos brutos, snapshots passados) e **nunca** para substituir tabelas e relacionamentos necessários para o domínio de negócio.

## 3. Bounded Contexts iniciais

### Platform / Builder Context
Responsável por:
- Process candidates
- Process definitions
- Versions
- Publication
- Capabilities
- Governance

### Agent Gateway Context
Responsável por:
- Agent submissions
- Payload contracts
- correlation_id
- Idempotency
- Receipts
- Anti-corruption layer de agentes

### Integration Boundary Context
Responsável por:
- n8n webhooks
- Signal inbox
- Payload bruto externo
- Assinatura/verificação
- HTTP 202
- Não processar regra de negócio profunda

### Observation Context
Responsável por:
- Observations
- Evidence consolidation
- Promoção humana para Process Candidate

### Runtime Context
Responsável por:
- Process instances
- Action executions
- Step transitions
- Events de execução

### Workspace Governance Context
Responsável por:
- Consentimento
- Autoria/origem
- Permissões
- Auditoria
- Visualização de governança

### Adaptation / Client Context
Responsável por:
- Gestão Técnica
- Capacidades instaladas
- Regras específicas do cliente
- Configuração por workspace

## 4. Camadas recomendadas

- **Domain Model:**
  - Entidades
  - Value objects
  - Invariantes
  - Domain events
- **Application Layer:**
  - Use cases
  - Orchestration
  - Autorização
  - Transação
  - Chamada a ports
- **Infrastructure Layer:**
  - Drizzle
  - Postgres
  - Adapters
  - External integrations
- **Interface Layer:**
  - API routes
  - Server actions
  - UI components
  - Presenters/view-models

## 5. Regras de dependência

- **API Route não decide regra de domínio:** Uma rota apenas recebe a requisição, formata a resposta e chama um caso de uso.
- **React Component não decide transição de estado:** O frontend apenas exibe os botões adequados baseados nos estados fornecidos pelo backend. As decisões de "para onde vai" acontecem no backend.
- **Repository não decide regra de negócio:** Ele apenas faz o CRUD orientado ao Domínio, persistindo e recuperando os dados. Não deve lançar erros de regra de negócio, apenas de acesso a dados.
- **Service/Application Use Case não deve depender de componente de UI:** Um caso de uso não deve conhecer "botão clicado", nem retornar HTML/JSX.
- **Mapper externo é Anti-Corruption Layer:** Sempre use mappers para converter dados externos/sujos para dentro do domínio limpo.
- **Payload externo nunca entra direto no domínio:** Deve passar por validação e transformação.
- **Domínio não conhece Paperclip/n8n como implementação concreta:** O sistema apenas conhece a "origem", "tipo" ou "fonte" (ex: "Agent", "External Webhook"). A implementação técnica (se é n8n, se é zapier, se é paperclip) fica nos Adapters ou na API de borda.

## 6. Padrão de nomes recomendado

**Use Cases:**
- `SubmitAgentCandidateUseCase`
- `RegisterAgentSubmissionUseCase`
- `PromoteObservationToCandidateUseCase`
- `PublishApprovedCandidateUseCase`
- `ApproveFeatureProposalUseCase`
- `ApplyImprovementToNewVersionUseCase`

**Repositories como portas:**
- `AgentGatewaySubmissionRepositoryPort`
- `ProcessCandidateRepositoryPort`
- `ProcessDefinitionRepositoryPort`
- `ObservationRepositoryPort`

**Adapters:**
- `DrizzleAgentGatewaySubmissionRepository`
- `DrizzleProcessCandidateRepository`
- `DrizzleObservationRepository`

## 7. Invariantes obrigatórias

- Agente nunca publica workflow.
- Agente nunca aprova candidate.
- Candidate de agente nasce como draft.
- Processo publicado é imutável; mudança gera nova versão.
- Execution runtime usa versão publicada.
- `workspace_id` é obrigatório em dados operacionais.
- Submissão idempotente não gera candidate duplicado.
- Consentimento de workspace deve bloquear observação quando aplicável.
- Evento/receipt auditável não deve ser editado depois de gravado.
- Payload externo deve ser sanitizado antes de persistir.

## 8. Eventos e Receipts

- **Domain Event:** Algo que aconteceu dentro do nosso Domínio de negócio e é de interesse da aplicação responder a ele.
- **Trace Receipt:** Um recibo que atesta que o sistema de borda recebeu uma comunicação (útil para comprovar integrações).
- **Integration Signal:** Um dado cru (payload bruto) vindo de uma integração externa, antes de ser compreendido ou limpo.
- **Observation:** Uma interpretação (manual ou algorítmica) de sinais externos. Uma consolidação de evidências que pode gerar propostas.
- **Process Candidate:** Uma proposta de processo formal e que precisa passar pela governança humana.

## 9. Testes por camada

- **Domain/unit tests** para invariantes (ex: o state machine do workflow).
- **Application/use case tests** para fluxo (ex: mockando banco e testando os steps do Use Case).
- **Integration tests** para Drizzle/Postgres (testar se a persistência realmente funciona no banco real ou containerizado).
- **E2E** para UI operável.
- **Contract tests** para payload externo (Garantindo que mudanças de formato externo não quebrem o Adapter).

## 10. Anti-patterns proibidos

- Route.ts com regra de negócio pesada.
- Componente React decidindo status de workflow.
- Repository alterando estado de entidade por conta própria (ex: `if status == draft -> approve`).
- JSONB escondendo uma entidade que precisava ser relacional e modelada explicitamente.
- Status/string solta (`const status = 'draft'`) sem que exista uma transição testada ou um State Machine real validando.
- Payload externo (`req.body`) usado direto como entidade interna.
- Fase backend concluída sem a UI/gap (Violando a Frontend Parity).
- Fase de UI implementada baseada em um dado de estado que o backend não persiste/não entrega de fato.
- Misturar três fases estruturais (ex: Criar BD, Fazer API, Fazer UI Complexa) em uma única Pull Request não revisável.
