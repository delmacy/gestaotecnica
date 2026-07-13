# Contrato de Decisão de Aprovação (Approval Decision)

Este documento descreve o contrato canônico para o registro semântico de decisões de aprovação no ecossistema da plataforma.

## Objetivo

O contrato `ApprovalDecision` captura o **Ato Semântico** de um ator autorizado sobre uma versão específica de um ativo (como um processo ou formulário).

Ele responde:
- **Quem decidiu?** (`actor`)
- **O que foi decidido?** (`decision`: approved, rejected, changes_requested)
- **Sobre qual ativo/versão?** (`subject`)
- **Sob qual política?** (`policyId` - opcional)
- **Quando?** (`decidedAt`)
- **Qual a justificativa?** (`justification`)
- **Qual conteúdo exato foi avaliado?** (`approvedContentHash` - opcional)

## Definições Técnicas

- **Package ID:** `PKG-APPROVAL-DECISION-CONTRACT-001`
- **Módulo:** `governance`
- **Caminho:** `src/platform/governance/contracts/approval-decision.ts`

## Regras de Negócio Implementadas

1. **Integridade vs. Aprovação:** O campo `approvedContentHash` garante a **Integridade** (o conteúdo não mudou). A aprovação é o ato de vontade do ator.
2. **Justificativa Obrigatória:**
   - Se `decision` for `rejected` ou `changes_requested`, a justificativa é **obrigatória** (mínimo 10 caracteres úteis).
   - Se `decision` for `approved`, a justificativa é opcional.
3. **Imutabilidade:** O contrato utiliza `Object.freeze` no retorno da validação para garantir que a decisão não seja alterada em runtime.
4. **Sujeitos Suportados:**
   - `process_version`
   - `form_definition`
   - `utility_app_definition`

## Relação com Trace Receipt

- **ApprovalDecision** é o registro semântico da decisão (intenção do negócio).
- **TraceReceipt** é a evidência técnica de que algo ocorreu no sistema.
- `ApprovalDecision` não depende obrigatoriamente de um `TraceReceipt` para ser válido, mas um `TraceReceipt` pode futuramente registrar a criação de uma `ApprovalDecision`.
- `TraceReceipt` não substitui a `ApprovalDecision`, pois não carrega a semântica de aprovação formal, mas sim o rastro de execução.

## Exemplo de Uso

```ts
import { ApprovalDecisionSchema } from "@/platform/governance/contracts/approval-decision";

const decision = ApprovalDecisionSchema.parse({
  id: "dec-123",
  workspaceId: "00000000-0000-4000-a000-000000000000",
  subject: {
    type: "process_version",
    id: "proc-456",
    version: 1
  },
  decision: "approved",
  actor: {
    type: "human",
    id: "user-789"
  },
  decidedAt: new Date().toISOString()
});
```

## Gate E Readiness

Este contrato fornece a definição semântica necessária para alcançar a prontidão **Gate E** sem introduzir novos esquemas de banco de dados e migrações.
