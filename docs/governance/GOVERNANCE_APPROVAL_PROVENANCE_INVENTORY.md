# Inventário de Governança: Aprovação, Proveniência e Auditoria

Este documento mapeia os ativos reais no repositório `gestaotecnica` que sustentam a governança de processos, documentos e ações.

## 1. Tabela de Evidências

| Ativo | Caminho | Símbolo/Tabela | Tipo de Evidência | Ator? | Decisão? | Timestamp? | Versão? | Hash? | Política? | Limitações | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Process Status** | `src/platform/workflows/contracts/process-definition.ts` | `ProcessDefinitionStatusSchema` | Contract (Zod) | Não | Não | Não | Não | Não | Não | Apenas enum de status. | CONFIRMED |
| **Process Version** | `src/platform/workflows/contracts/process-definition.ts` | `ProcessVersionSchema` | Contract (Zod) | Sim | Não | Sim | Sim | Não | Parcial | `publishedById` e `publishedAt` são mandatórios se status for `published`. | CONFIRMED |
| **Trace Receipt** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptSchema` | Contract (Zod) | Sim | Parcial | Sim | Não | Sim | Não | `action` registra o que foi feito, mas não uma decisão formal de aprovação. | CONFIRMED |
| **Trace Actor** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptActorSchema` | Contract (Zod) | Sim | Não | Não | Não | Não | Não | Tipos: user, service, agent, system, external. | CONFIRMED |
| **Platform Actor** | `src/platform/contracts/actor.ts` | `ActorReferenceSchema` | Contract (Zod) | Sim | Não | Não | Não | Não | Não | Tipos: human, system, worker, integration. | CONFIRMED |
| **Trace Hash** | `src/platform/documents/traceability/contracts.ts` | `TraceReceiptHashSchema` | Contract (Zod) | Não | Não | Não | Não | Sim | Não | Suporta SHA-256 e SHA-512. | CONFIRMED |
| **Form Status** | `src/components/builder/form-builder/schema/form-schema.ts` | `FormStatusSchema` | Contract (Zod) | Não | Não | Não | Não | Não | Não | draft, published, archived. | CONFIRMED |
| **Document Table** | `src/db/runtime/schema/documents.ts` | `documents` | DB Schema | Não | Não | Sim | Não | Não | Não | Possui status `draft`. | CONFIRMED |
| **Trace Table** | `src/db/runtime/schema/documents.ts` | `trace_receipts` | DB Schema | Sim | Não | Sim | Não | Sim | Não | Armazena `checksum_sha256` e link com versão de documento. | CONFIRMED |
| **Compliance Audit** | `src/db/legacy/schema.ts` | `compliance_audits` | DB Schema | Não | Não | Sim | Não | Não | Não | Legado, focado em auditoria externa/conformidade. | CONFIRMED |
| **Action Execution** | `src/db/runtime/schema/workflow.ts` | `action_executions` | DB Schema | Sim | Parcial | Sim | Não | Não | Não | Registra `status` (completed/failed) e `actor_id`. | CONFIRMED |

## 2. Respostas às Perguntas Obrigatórias

1. **Quais entidades já possuem draft/published/archived?**
   - `ProcessDefinition` e `ProcessVersion`.
   - `FormDefinition` (via `FormStatusSchema`).
   - `documents` (tabela de runtime).

2. **Onde ator e timestamps são registrados?**
   - Timestamps (`createdAt`, `updatedAt`, `publishedAt`) estão em quase todos os contratos e tabelas de runtime.
   - Ator é registrado como `createdById`, `publishedById` em workflows, e `actor.id` em `TraceReceipt`.

3. **Existe conceito real de aprovação?**
   `NÃO`. Existe o status `published`, que implica uma mudança de estado, mas não existe uma entidade ou contrato que registre explicitamente uma "Aprovação" (quem aprovou, sob qual política, com qual assinatura).

4. **Existe conceito real de revisão?**
   `NÃO`. Não há workflow de revisão ou status `in_review` nos contratos canônicos. Aparece apenas em componentes de UI de mock (`GapTracker`).

5. **TraceReceipt pode registrar decisão?**
   `PARTIAL`. O campo `action` em `TraceReceipt` possui `type` e `name`, que poderiam ser preenchidos com "approval". No entanto, não há campos para o resultado da decisão (Approved/Rejected) de forma estruturada fora do `result` de execução (success/failure).

6. **Quais campos faltam para aprovação formal?**
   - `policyId`: Referência à política de aprovação aplicada.
   - `decision`: Enum explícito (APPROVED, REJECTED, CHANGES_REQUESTED).
   - `signature`: Vínculo criptográfico (JWS/JWE) entre o ator e o hash do conteúdo.
   - `justification`: Texto explicativo da decisão.

7. **Como ligar aprovação a uma versão exata?**
   Atualmente, a melhor forma é via `TraceReceipt` apontando para o `id` da `ProcessVersion` no campo `subject`.

8. **Onde a política de aprovação deveria viver?**
   Deveria viver em um novo módulo `src/platform/governance/policies/`, definindo quem pode aprovar o quê e sob quais condições.

9. **Como evitar que hash seja confundido com aprovação?**
   O hash garante que o conteúdo não mudou (**Integridade**). A aprovação garante que um ator autorizado aceitou aquele conteúdo (**Vínculo/Vontade**). A aprovação deve *conter* o hash do conteúdo aprovado.

10. **Quais entidades precisarão governança primeiro?**
    1. `process definitions`: Por serem o motor de execução do negócio.
    2. `form definitions`: Por coletarem dados críticos.

## 3. Distinções de Governança

- **Integridade (Hash):** Garantia técnica de que os bits de um processo ou documento não foram alterados.
- **Vínculo Criptográfico (Assinatura):** Prova de que um ator específico teve acesso à chave privada no momento da manifestação.
- **Decisão (Aprovação):** Ato humano ou automatizado de validar um ativo para uso em produção.
- **Disponibilidade (Publicação):** Mudança de status que torna um ativo visível/executável pelo sistema.
- **Registro (Auditoria):** Rastro histórico passivo de quem fez o quê e quando.
- **Cadeia de Custódia (Proveniência):** Histórico de transformações desde a origem até o estado atual.
- **Identidade Histórica (Versionamento):** Capacidade de referenciar estados passados de um ativo de forma imutável.

## 4. Prioridades de Governança

| Entidade | Necessidade de Aprovação | Justificativa |
| :--- | :--- | :--- |
| **Process Definitions** | **Crítica** | Define o fluxo de valor e regras de conformidade. |
| **Form Definitions** | **Alta** | Define a interface de captura de dados e obrigatoriedade. |
| **Utility Apps** | **Média** | Regras de cálculo e conversão que impactam resultados. |
| **Actions** | **Média** | Unidades de lógica que executam mutações no sistema. |
| **Datasets** | **Média** | Dados de referência que guiam decisões automáticas. |
| **Integrations** | **Baixa** | Configurações de conectores (geralmente geridas por IT). |
| **View Definitions** | **Baixa** | Layout de apresentação (impacto menor em conformidade). |
