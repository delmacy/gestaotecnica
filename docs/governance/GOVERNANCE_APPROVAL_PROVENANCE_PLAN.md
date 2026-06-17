# Plano de Implementação: Governança, Aprovação e Proveniência

Este documento propõe a sequência de pacotes para implementar a governança formal no sistema, baseando-se nos ativos identificados no inventário.

## 1. Sequência de Pacotes (Roadmap)

### PKG-APPROVAL-DECISION-CONTRACT-001: Contrato Canônico de Decisão
- **Objetivo:** Definir o esquema Zod para uma decisão formal de aprovação.
- **Evidência:** Necessidade de campos como `decision` (enum), `justification` e `policyReference` identificados como lacunas no inventário.
- **Escopo:** `src/platform/governance/contracts/approval-decision.ts`.

### PKG-APPROVAL-POLICY-CONTRACT-001: Contrato de Política de Governança
- **Objetivo:** Definir como as políticas de aprovação (quem pode aprovar o quê) são estruturadas.
- **Evidência:** Ausência de local para regras de governança além de permissões RBAC simples.
- **Escopo:** `src/platform/governance/contracts/approval-policy.ts`.

### PKG-VERSION-PUBLICATION-SERVICE-001: Serviço de Publicação com Governança
- **Objetivo:** Orquestrar a mudança de status de `draft` para `published` exigindo uma decisão de aprovação válida.
- **Evidência:** O status `published` já existe em `ProcessVersion` e `FormDefinition`, mas a transição é direta e sem evidência de decisão.
- **Escopo:** `src/platform/governance/application/publication.service.ts`.

### PKG-TRACE-APPROVAL-RECEIPT-001: Recibo de Rastreabilidade para Aprovações
- **Objetivo:** Estender o uso de `TraceReceipt` para registrar decisões de aprovação com integridade garantida.
- **Evidência:** `TraceReceipt` já possui suporte para `subject` do tipo `process` e `action`. O novo pacote formalizará o uso de `TraceReceipt` como prova de aprovação.
- **Escopo:** `src/platform/documents/traceability/approval-receipt.ts`.

### PKG-GOVERNANCE-QUERY-PORT-001: Porta de Consulta de Governança
- **Objetivo:** Prover uma API unificada para consultar o histórico de aprovações e proveniência de qualquer ativo (Processo, Documento, Formulário).
- **Evidência:** Dispersão de dados de status e auditoria entre `process_versions`, `trace_receipts` e `compliance_audits`.
- **Escopo:** `src/platform/governance/ports/governance-query.port.ts`.

## 2. Modelo Conceitual Recomendado

O modelo deve separar claramente:
1. **Ativo (Asset):** O conteúdo versionado (Ex: `ProcessVersion`).
2. **Manifestação (ApprovalDecision):** O ato de um ator decidir sobre um ativo.
3. **Prova (TraceReceipt):** O registro imutável que vincula a Decisão ao Ativo via Hash.
4. **Política (ApprovalPolicy):** A regra que valida se uma Manifestação é suficiente para publicar um Ativo.

## 3. Estratégia de Transição

- **Curto Prazo:** Implementar contratos de decisão e política.
- **Médio Prazo:** Integrar com `TraceReceipt` para garantir não-repúdio.
- **Longo Prazo:** Migrar as tabelas de `compliance_audits` legado para o novo motor de governança.
