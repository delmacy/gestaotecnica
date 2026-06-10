# CAP-VAL-001 — Boundary Review

## 1. Objetivo da revisão
Revisar o catálogo universal de 24 capabilities de forma abstrata, arquitetural e documental. Como o piloto de Process Mirroring definiu a necessidade de fontes reais (`NEEDS_REAL_SOURCES_BEFORE_CAPABILITY_MATCHING`), esta revisão prepara o modelo canônico sem depender de dados do piloto. Define fronteiras, previne sobreposições indevidas e define o núcleo MVP para a Gestão Técnica.

## 2. Capabilities Avaliadas (24)
organization, people, customers, providers, requests, cases, tasks, work_orders, scheduling, resources, assets, inventory, documents, communication, approvals, audit, analytics, knowledge, compliance, sales, procurement, finance, contracts, legal.

## 3. Matriz de fronteiras

| capability | category | core_business | owns_entities | does_not_own | depends_on | used_by | cross_cutting | mvp_priority | boundary_risk | decision |
|---|---|---|---|---|---|---|---|---|---|---|
| organization | foundation | false | Workspace, Unit, Team | Person, Config | none | all | true | critical | low | maintain |
| people | foundation | true | Person, Role, Skill | Resource, User | organization | scheduling, approvals | true | critical | medium | maintain |
| customers | relationship | false | Customer, Contact | Contract, Sale | organization | requests, sales | false | future | low | maintain |
| providers | relationship | false | Provider, Contact | Contract | organization | procurement | false | future | low | maintain |
| requests | work-management | true | Request | WorkOrder, Case | communication | cases, work_orders | false | critical | high | clarify overlap with cases |
| cases | work-management | true | Case | Task | requests | tasks | false | future | high | clarify overlap with requests |
| tasks | work-management | true | Task | Case, WorkOrder | people | cases, work_orders | false | future | high | clarify overlap with work_orders |
| work_orders | work-management | true | WorkOrder | Task, Asset | requests, people | scheduling | false | critical | high | maintain as main execution unit |
| scheduling | resource | true | Appointment | Person, Asset | people, resources | work_orders | false | critical | medium | maintain |
| resources | resource | false | Resource, Pool | Person, Asset | scheduling | scheduling | true | future | high | clarify overlap with assets |
| assets | resource | true | Asset | Inventory | none | work_orders | false | medium | medium | maintain |
| inventory | resource | false | Item, Stock | Asset | none | work_orders, procurement | false | medium | high | clarify overlap with assets |
| documents | information | true | Document, Version | Knowledge | audit | cases, work_orders | true | critical | medium | maintain |
| communication | information | false | Message, Thread | Document | none | requests | true | critical | low | maintain |
| approvals | control | true | Approval | Governance, Audit | people | documents, work_orders | true | medium | high | clarify overlap with governance |
| audit | control | false | AuditLog | Approval | none | all | true | critical | medium | clarify overlap with approvals |
| analytics | intelligence | false | Dashboard, Metric | AuditLog | audit | all | true | medium | low | maintain |
| knowledge | information | false | Article, Manual | Document | documents | enablement | true | medium | high | clarify overlap with documents |
| compliance | control | false | Rule, Policy | Audit | audit | legal | true | medium | low | maintain |
| sales | commercial | false | Opportunity, Quote | Invoice, Customer | customers | finance | false | future | high | clarify overlap with finance |
| procurement | commercial | false | PurchaseOrder | Provider, Item | providers | finance, inventory | false | future | low | maintain |
| finance | commercial | false | Invoice, Payment | Sale, Purchase | contracts | sales, procurement | false | future | high | clarify overlap with sales |
| contracts | legal | false | Contract | LegalCase | customers, providers | legal | false | future | high | clarify overlap with legal |
| legal | legal | false | LegalCase | Contract | contracts, documents | none | false | future | high | clarify overlap with contracts |

## 4. Revisão de sobreposições críticas

**"requests" vs "cases" vs "work_orders"**
- **requests:** Entrada de demanda antes de virar trabalho formal. Trata a triagem, qualificação e intenção do solicitante.
- **cases:** Acompanhamento adaptativo contínuo. Não tem um fluxo linear rígido; resolve situações complexas que requerem investigação.
- **work_orders:** Execução formal de trabalho estruturado e preditivo. Possui pacote formal de execução com responsável, estado, evidência e encerramento.

**"tasks" vs "work_orders"**
- **tasks:** Unidade pequena de ação contida dentro de um contexto maior (como um case ou work_order).
- **work_orders:** Pacote formal de execução com responsável, estado, evidência e encerramento. Agrupa o esforço de entrega de valor.

**"resources" vs "assets" vs "inventory"**
- **resources:** Algo alocável ou reservado para uso no tempo (pessoas, salas, veículos genéricos).
- **assets:** Bem controlado com identidade única, ciclo de vida longo, depreciação e manutenção.
- **inventory:** Itens consumíveis/comercializáveis gerenciados em lote, com saldo e movimentação (peças, insumos).

**"documents" vs "knowledge"**
- **documents:** Registros formais, arquivos, versões, evidências e anexos atrelados a um processo ou transação.
- **knowledge:** Conhecimento estruturado e reutilizável, manuais, FAQs, procedimentos e artigos para capacitação e consulta.

**"approvals" vs "governance" vs "audit"**
- **approvals:** Decisão humana explícita/autorização dentro de um fluxo ativo que bloqueia ou permite transições.
- **governance:** Políticas, papéis, limites de alçada, separação de funções e responsabilidades estruturais.
- **audit:** Trilha factual, automática e imutável do que aconteceu, sem capacidade de decidir ou bloquear processos.

**"contracts" vs "legal"**
- **contracts:** Acordos, termos, vigência, partes, obrigações financeiras e operacionais, renovação e distrato.
- **legal:** Casos jurídicos, litígios, prazos judiciais, riscos contingentes, audiências e decisões judiciais.

**"sales" vs "finance"**
- **sales:** Conversão de interesse em venda, funil de oportunidades, propostas e negociação comercial.
- **finance:** Cobrança, faturamento, pagamento, contas a pagar/receber, conciliação bancária e liquidação.

**"people" vs "customers" vs "providers"**
- **people:** Atores internos ou profissionais executores do serviço, sujeitos a escala e alocação.
- **customers:** Quem solicita, compra ou recebe valor da organização (pode ser externo ou unidade de negócio interna).
- **providers:** Quem fornece bens, serviços ou insumos para a organização.

## 5. Dependências

### Obrigatórias
- `work_orders` depende de `people` para execução, `documents` para evidência e `audit` para rastreabilidade.
- `approvals` depende de `people` para identidade do autorizador.
- `people` depende de `organization` para vinculação estrutural.

### Opcionais
- `work_orders` pode depender de `assets` se o trabalho ocorrer em equipamentos.
- `requests` pode converter em `cases` ou `work_orders`, mas dependendo do modelo de negócio, pode fluir para um ou outro.

## 6. Classificação das Capabilities

### Capabilities Transversais
organization, people, documents, communication, approvals, audit, analytics, knowledge, compliance, resources. Podem ser usadas por diversas capabilities de negócio, não controlam o fluxo principal sozinhas.

### Capabilities de Negócio
customers, providers, requests, cases, work_orders, sales, procurement, finance, contracts, legal. Controlam o ciclo de vida do domínio core.

### Capabilities Estruturais
organization, people. Formam a fundação do sistema.

## 7. Capabilities que devem permanecer fora do MVP
Para o primeiro System Builder aplicado à Gestão Técnica, as seguintes ficam de fora:
sales, procurement, finance, contracts, legal, providers, customers, cases, resources.
Estas capabilities não devem entrar no primeiro MVP se não forem estritamente necessárias ou provadas via Process Mirroring.

## 8. MVP Capability Core Recomendado
O núcleo mínimo para o MVP da Gestão Técnica:
- **organization**
- **people**
- **requests**
- **work_orders**
- **documents**
- **audit**
- **communication**
- **scheduling**

**Capabilities complementares:**
- **assets**
- **inventory**
- **approvals**
- **analytics**
- **knowledge**
- **compliance**

## 9. Decisões recomendadas
Criar decisão em `DECISIONS.md` para assegurar que:
- As 24 capabilities são mantidas como catálogo universal.
- O primeiro MVP usa apenas um subconjunto (MVP Capability Core).
- Capabilities setoriais só nascem após Process Mirroring ou necessidade comprovada.
- Sobreposições devem ser resolvidas por composição, não absorção indevida.

## 10. Riscos de acoplamento
- Absorver `audit` dentro de operações de negócio em vez de usar eventos transversais.
- Misturar `approvals` com `governance`, tentando usar regras duras onde deve haver fluxo de autorização.
- Fundir `tasks` e `work_orders` em uma única tabela que não escala para contextos complexos e simples simultaneamente.

## 11. Critério para considerar CAP-VAL-001 aprovada
- Este documento (`CAP-VAL-001_BOUNDARY_REVIEW.md`) e `CAP-VAL-001_REPORT.md` criados.
- Regras documentadas em `DECISIONS.md` e `DEPENDENCY_RULES.md`.
- Atualizações feitas no Tasker.
- Nenhum código de UI, banco, ou runtime alterado.
