# Relatório de Inventário: PKG-GOVERNANCE-APPROVAL-PROVENANCE-INVENTORY-001

## Sumário Executivo

Este pacote realizou o mapeamento exaustivo dos ativos de governança, aprovação e proveniência no repositório. Foi identificada uma base sólida para integridade (via `TraceReceipt`) e versionamento (via `ProcessVersion`), mas uma lacuna significativa na formalização de decisões de aprovação e políticas de governança.

## Ativos Encontrados

- **Integridade:** `TraceReceiptSchema` em `src/platform/documents/traceability/contracts.ts` provê hashing e vinculação de atores a ações.
- **Identidade Histórica:** `ProcessVersionSchema` em `src/platform/workflows/contracts/process-definition.ts` já implementa imutabilidade básica e status de publicação.
- **Atores:** `ActorReferenceSchema` (Platform) e `TraceReceiptActorSchema` (Traceability) definem as entidades que podem realizar ações.
- **Auditoria Passiva:** Timestamps de criação e atualização presentes em todas as tabelas de banco de dados (`src/db/runtime/schema/`).

## Lacunas Identificadas

1. **Decisão de Aprovação:** Não existe um objeto ou contrato que represente explicitamente "Aprovado por X sob a justificativa Y".
2. **Políticas de Governança:** O sistema não possui registro de "quem tem autoridade para aprovar o quê" fora das permissões básicas.
3. **Assinatura Digital:** Embora o hash garanta integridade, não há uso formal de JWS/JWE para garantir o vínculo criptográfico forte entre o aprovador e o ativo.
4. **Cadeia de Proveniência:** A ligação entre a origem de um processo (ex: um rascunho ou builder) e sua versão publicada não é rastreada de forma unificada.

## Entidades Prioritárias para Governança

1. **Process Definitions:** Devido ao impacto direto na operação do negócio.
2. **Form Definitions:** Pelo risco de conformidade na coleta de dados.
3. **Utility Apps:** Pela criticidade das regras de cálculo e decisão que automatizam.

## Recomendações

- Adotar o `TraceReceipt` como o container universal para evidências de governança.
- Implementar um contrato de `ApprovalDecision` que referencie o `id` de um `TraceReceipt`.
- Evoluir o status `published` para ser condicional à existência de um recibo de aprovação válido conforme a política do workspace.

## Sequência de Pacotes Proposta

1. `PKG-APPROVAL-DECISION-CONTRACT-001`
2. `PKG-APPROVAL-POLICY-CONTRACT-001`
3. `PKG-VERSION-PUBLICATION-SERVICE-001`
4. `PKG-TRACE-APPROVAL-RECEIPT-001`
5. `PKG-GOVERNANCE-QUERY-PORT-001`
