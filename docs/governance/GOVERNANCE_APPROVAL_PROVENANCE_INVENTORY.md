# Inventário de Governança: Aprovação, Proveniência e Auditoria

Este documento mapeia os ativos reais no repositório `gestaotecnica` que sustentam a governança de processos, documentos e ações.

## 1. Tabela de Evidências

| Ativo | Caminho | Símbolo/Tabela | Tipo de Evidência | Ator? | Decisão? | Timestamp? | Versão? | Hash? | Política? | Limitações | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Process Status** | `src/platform/workflows/contracts/process-definition.ts` | `ProcessDefinitionStatusSchema` | Contract (Zod) | Não | Não | Não | Não | Não | Não | Valida o formato dos status permitidos. | CONFIRMED |
| **Process Version** | `src/platform/workflows/contracts/process-definition.ts` | `ProcessVersionSchema` | Contract (Zod) | Sim | Não | Sim | Sim | Não | Parcial | `publishedById` e `publishedAt` são validados se status for `published`. | CONFIRMED |
| **Trace Receipt** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptSchema` | Contract (Zod) | Sim | Parcial | Sim | Não | Sim | Não | Transportador de evidência técnica; não é um registro de decisão semântica. | CONFIRMED |
| **Trace Actor** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptActorSchema` | Contract (Zod) | Sim | Não | Não | Não | Não | Não | Tipos: user, service, agent, system, external. | CONFIRMED |
| **Platform Actor** | `src/platform/contracts/actor.ts` | `ActorReferenceSchema` | Contract (Zod) | Sim | Não | Não | Não | Não | Não | Tipos: human, system, worker, integration. | CONFIRMED |
| **Trace Hash** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptHashSchema` | Contract (Zod) | Não | Não | Não | Não | Sim | Não | Provê integridade via SHA-256/SHA-512. | CONFIRMED |
| **Form Status** | `src/components/builder/form-builder/schema/form-schema.ts` | `FormStatusSchema` | Contract (Zod) | Não | Não | Não | Não | Não | Não | draft, published, archived. | CONFIRMED |
| **Document Table** | `src/db/runtime/schema/documents.ts` | `documents` | DB Schema | Não | Não | Sim | Não | Não | Não | Possui campo de status `draft`. | CONFIRMED |
| **Trace Table** | `src/db/runtime/schema/documents.ts` | `trace_receipts` | DB Schema | Sim | Não | Sim | Não | Sim | Não | Persiste `checksum_sha256` vinculado a versões de documentos. | CONFIRMED |
| **Compliance Audit** | `src/db/legacy/schema.ts` | `compliance_audits` | DB Schema | Não | Não | Sim | Não | Não | Não | Registro histórico de auditorias de conformidade. | CONFIRMED |
| **Action Execution** | `src/db/runtime/schema/workflow.ts` | `action_executions` | DB Schema | Sim | Parcial | Sim | Não | Não | Não | Registra rastro de execução (`status`, `actor_id`). | CONFIRMED |

## 2. Respostas às Perguntas Obrigatórias

1. **Quais entidades já possuem draft/published/archived?**
   - `ProcessDefinition` e `ProcessVersion`.
   - `FormDefinition` (via `FormStatusSchema`).
   - `documents` (tabela de runtime).

2. **Onde ator e timestamps são registrados?**
   - Campos de timestamp (`createdAt`, `updatedAt`, `publishedAt`) e IDs de ator (`createdById`, `publishedById`, `actor.id`) estão presentes em diversos contratos e esquemas de banco de dados mapeados na Tabela de Evidências.

3. **Existe conceito real de aprovação?**
   `NÃO`. Existe o status `published`, mas não há uma entidade "ApprovalDecision" que capture a intenção semântica de um aprovador vinculado a uma política.

4. **Existe conceito real de revisão?**
   `NÃO`. Não há contratos canônicos para fluxos de revisão ou status `in_review`.

5. **TraceReceipt pode registrar decisão?**
   `PARTIAL`. O `TraceReceipt` pode registrar o rastro técnico de uma ação, mas ele atua como um transportador de evidência (carrier), não como a definição da decisão em si.

6. **Quais campos faltam para aprovação formal?**
   - `policyId`: Referência à política de aprovação aplicada.
   - `decision`: Resultado explícito (ex: APPROVED, REJECTED).
   - `justification`: Justificativa da decisão.
   - `signature` (Opcional): Assinatura digital para garantias superiores de autenticidade.

7. **Como ligar aprovação a uma versão exata?**
   Via referência ao ID e Hash da versão do ativo dentro do registro de decisão. O `TraceReceipt` pode ser usado para vincular a evidência técnica a este registro.

8. **Onde a política de aprovação deveria viver?**
   Em um módulo de governança centralizado (`src/platform/governance/policies/`), desacoplado da lógica de execução.

9. **Como evitar que hash seja confundido com aprovação?**
   O hash garante apenas a **Integridade** (o conteúdo não mudou). A aprovação é um **Ato Semântico** de um ator autorizado.

10. **Quais entidades precisarão governança primeiro?**
    1. `process definitions`: Críticas para a conformidade operacional.
    2. `form definitions`: Críticas para a integridade na coleta de dados.

## 3. Distinções de Governança

- **Integridade (Hash):** Garantia técnica de que o conteúdo não foi alterado.
- **Autenticidade de Aprovação:** Registro da decisão por um ator autenticado pelo sistema.
- **Assinatura Digital (Opcional):** Mecanismo de garantia superior (ex: JWS) para cenários que exigem maior evidência de autoria.
- **Disponibilidade (Publicação):** Transição de estado que torna o ativo utilizável.
- **Rastreabilidade (Traceability):** Capacidade de reconstruir a cadeia de eventos e evidências técnicas.

## 4. Prioridades de Governança

| Entidade | Necessidade de Aprovação | Justificativa |
| :--- | :--- | :--- |
| **Process Definitions** | **Crítica** | Regras de negócio e conformidade. |
| **Form Definitions** | **Alta** | Interface de captura e validação de dados. |
| **Utility Apps** | **Média** | Lógicas de cálculo e decisão. |
| **Actions** | **Média** | Unidades de execução atômicas. |
| **Datasets** | **Média** | Dados de referência para automação. |
| **Integrations** | **Baixa** | Configurações técnicas de conectividade. |
| **View Definitions** | **Baixa** | Elementos de apresentação visual. |

## 5. Gate E Readiness

- O contrato de rastreabilidade e as definições de proveniência (`TraceReceiptSchema`, `ApprovalDecisionSchema`) estabelecem a fundação documental exigida para Gate E Readiness, sem implicar suporte em banco de dados ou schemas instaláveis via drizzle.
