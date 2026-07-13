# Plano de Implementação: Governança, Aprovação e Proveniência

Este documento propõe a sequência de pacotes para implementar a governança formal, baseando-se no inventário de ativos.

## 1. Sequência de Pacotes (Roadmap)

### PKG-APPROVAL-DECISION-CONTRACT-001: Contrato de Decisão Semântica
- **Objetivo:** Definir o registro de decisão (ApprovalDecision) contendo ator, decisão, justificativa, hash do ativo e referência à política.
- **Abordagem:** Separar a decisão (ato semântico) da evidência técnica (TraceReceipt).
- **Escopo:** `src/platform/governance/contracts/approval-decision.ts`.

### PKG-APPROVAL-POLICY-CONTRACT-001: Contrato de Política de Governança
- **Objetivo:** Definir as regras que determinam quando uma aprovação é necessária.
- **Estratégia:** Publicação é orientada por política; nem todo ativo ou workspace exige aprovação obrigatória.
- **Escopo:** `src/platform/governance/contracts/approval-policy.ts`.

### PKG-VERSION-PUBLICATION-SERVICE-001: Serviço de Publicação Orientado a Política
- **Objetivo:** Orquestrar a transição para `published` validando se as exigências da `ApprovalPolicy` aplicável foram satisfeitas.
- **Escopo:** `src/platform/governance/application/publication.service.ts`.

### PKG-TRACE-APPROVAL-RECEIPT-001: Evidência Técnica de Aprovação
- **Objetivo:** Utilizar o `TraceReceipt` como um transportador opcional de evidências para reforçar a rastreabilidade das decisões de aprovação.
- **Escopo:** `src/platform/documents/traceability/approval-receipt.ts`.

### PKG-GOVERNANCE-QUERY-PORT-001: Consulta Unificada de Governança
- **Objetivo:** Prover uma porta de consulta para reconstruir o histórico de governança e integridade de ativos.
- **Escopo:** `src/platform/governance/ports/governance-query.port.ts`.

## 2. Modelo Conceitual Recomendado

O modelo deve distinguir claramente:
1. **Ativo (Asset):** O conteúdo (ex: `ProcessVersion`).
2. **Decisão (ApprovalDecision):** O registro semântico do ato de aprovação.
3. **Evidência (TraceReceipt):** O rastro técnico opcional que vincula a decisão ao estado do sistema.
4. **Política (ApprovalPolicy):** A regra que define os requisitos de governança para a publicação.

## 3. Premissas de Implementação

- **Integridade != Aprovação:** O hash garante integridade técnica; a aprovação garante conformidade semântica.
- **Assinaturas Digitais são Opcionais:** O sistema deve suportar aprovações baseadas em identidade autenticada, reservando assinaturas criptográficas (JWS/JWE) para cenários de alta garantia.
- **Flexibilidade de Publicação:** A obrigatoriedade de aprovação deve ser configurável via política, permitindo publicação direta onde apropriado.

## 4. Gate E Readiness

- Os pacotes e contratos definidos garantem o suporte lógico de rastreabilidade (Gate E Readiness), priorizando a paridade documental (contracts, audit policies) sem forçar persistência antecipada em banco de dados.
