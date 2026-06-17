# Relatório de Inventário: PKG-GOVERNANCE-APPROVAL-PROVENANCE-INVENTORY-001

## Sumário Executivo

Este pacote realizou o mapeamento dos ativos de governança, aprovação e proveniência. Foi identificada uma infraestrutura sólida para integridade técnica e rastreabilidade, permitindo a futura acoplagem de um motor de decisão semântica e políticas de governança.

## Ativos Encontrados

- **Estrutura de Evidência:** `TraceReceiptSchema` define a estrutura de evidência e campos de hash.
- **Motor de Integridade:** `hashing.ts` implementa o cálculo e verificação de hashes determinísticos.
- **Preparação de Payload:** `signable-payload.ts` prepara o payload para o self-hashing do recibo.
- **Ciclo de Vida:** Status `draft`, `published` e `archived` presentes em contratos de Workflows e Formulários.
- **Atores:** Esquemas de referência de ator autenticado (`ActorReferenceSchema`).
- **Rastro Operacional:** Timestamps e IDs de criador/publicador em ativos de runtime.

## Lacunas e Definições de Governança

1. **Decisão Semântica:** Necessidade de um contrato para `ApprovalDecision` (Decisão != Hash).
2. **Políticas de Publicação:** Definição de regras que tornem a aprovação obrigatória ou opcional conforme o contexto.
3. **Alta Garantia (Opcional):** Suporte a assinaturas criptográficas (JWS/JWE) para cenários que exigem garantias superiores de não-repúdio.

## Entidades Prioritárias para Governança

1. **Process Definitions**
2. **Form Definitions**
3. **Utility Apps**

## Sequência de Pacotes Recomendada

1. `PKG-APPROVAL-DECISION-CONTRACT-001`
2. `PKG-APPROVAL-POLICY-CONTRACT-001`
3. `PKG-VERSION-PUBLICATION-SERVICE-001`
4. `PKG-TRACE-APPROVAL-RECEIPT-001`
5. `PKG-GOVERNANCE-QUERY-PORT-001`
