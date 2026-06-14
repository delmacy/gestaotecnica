# Jules Reviewer Playbook

Este playbook define o fluxo de trabalho e as responsabilidades do Worker na role de **Reviewer**.

## Princípios do Reviewer

1.  **Revisão com Escopo**: O Reviewer não revisa todo o repositório. Ele foca exclusivamente nas mudanças introduzidas pelo Work Package associado ao Review Package.
2.  **Não Implementação**: O Reviewer nunca modifica a implementação. Ele apenas aprova ou solicita alterações (`changes_requested`).
3.  **Independência de Tipos**: Cada tipo de review (ex: `module`, `security`, `contract`) possui seu próprio `claim` e `receipt`. O pacote só é considerado `review_complete` após a aprovação de todos os tipos obrigatórios.

## Fluxo de Trabalho

### 1. Criação do Review Package
O processo começa quando um Work Package atinge o status `code_complete`. O sistema (ou o Integrador) cria o Review Package:

```bash
npm run agent-work -- review:create \
  --package PKG-SHARED-CONTRACTS-001 \
  --pr 155 \
  --base-sha <SHA> \
  --head-sha <SHA>
```

O comando exige um Activity Receipt existente para o mesmo package e exatamente os mesmos `base-sha` e `head-sha`. Não crie receipts retrospectivos para contornar essa validação.

### 2. Scope Check e Ownership
Antes de ser disponibilizado para os Reviewers, o sistema valida:
- **Ownership**: Garante que o worker não alterou arquivos fora de seus `Owned Paths`.
- **Review Budget**: Verifica se as mudanças estão dentro dos limites aceitáveis:
  - Máximo 20 arquivos de produção.
  - Máximo 35 arquivos totais.
  - Máximo 1500 linhas de código (excluindo gerados).
  - Máximo 3 contratos públicos alterados.

### 3. Review Claim e Lease
O Reviewer realiza o bootstrap para obter uma tarefa de revisão:

```bash
npm run agent-work -- review:claim \
  --worker jules-reviewer-01 \
  --review REV-PKG-001 \
  --type module
```
*Assim como os Work Packages, os Reviews possuem leases que expiram e exigem heartbeat.*

O primeiro claim move o Review Package de `ready` para `in_review`. Os demais tipos obrigatórios continuam elegíveis para claims independentes enquanto o package estiver `in_review`. Um tipo já decidido ou com claim ativo não pode receber um segundo claim.

### 4. Review Kit
O Reviewer consome o **Review Kit**, que contém metadados sobre a mudança, lista de arquivos afetados e o status do `scope-check`.

### 5. Tomada de Decisão (Review Receipt)
Após a análise, o Reviewer registra sua decisão usando o comando `review:approve` ou `review:request-changes`, fornecendo um JSON estruturado de entrada (`decision input`).

O decision input é obrigatório. Todos os arquivos alterados devem constar em `filesReviewed` ou `filesIntentionallyNotReviewed`. Aprovações exigem `testsVerified` não vazio e `requiredChanges` vazio; solicitações de alteração exigem ao menos um item em `requiredChanges`.

#### Estrutura do Decision Input
```json
{
  "filesReviewed": ["src/contracts/user.ts", "src/contracts/org.ts"],
  "filesIntentionallyNotReviewed": ["package-lock.json"],
  "contractsReviewed": ["UserContract", "OrgContract"],
  "dependenciesReviewed": ["drizzle-orm"],
  "testsVerified": ["tests/unit/contracts.test.ts"],
  "findings": ["Nenhum problema encontrado nas interfaces."],
  "requiredChanges": [],
  "residualRisks": ["Nenhum risco imediato."],
  "integrationNotes": "Pode ser integrado após aprovação do Lote B.",
  "documentationNotes": "Contratos atualizados conforme RFC-001."
}
```

#### Registrando a Aprovação
```bash
npm run agent-work -- review:approve \
  --review REV-PKG-001 \
  --type module \
  --token <CLAIM_TOKEN> \
  --input decision.json
```

## Estado Agregado dos Reviews

Um pacote de trabalho (`agent_work_packages`) só transita para `review_complete` quando:
1.  Todos os `review_types_required` possuem um `agent_review_receipts` com a decisão `approved`.
2.  Não existem reviews pendentes ou com `changes_requested`.

Se algum review solicitar alterações, o pacote retorna para o status `changes_requested`, e o worker original deve realizar as correções e abrir um novo ciclo de review.
