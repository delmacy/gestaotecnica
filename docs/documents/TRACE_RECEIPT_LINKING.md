# Trace Receipt Linking

Este documento descreve as funções e regras para vinculação e verificação de cadeias de Trace Receipts no módulo de rastreabilidade.

## Conceitos

### Self-Hash (Hash Próprio)
Cada Trace Receipt possui um hash calculado sobre seu próprio conteúdo (excluindo o campo `hashes` de nível superior). Este hash garante a integridade do registro individual.
No contrato, ele é identificado por `scope = "receipt"`.

### Vínculo Direto (Link)
Um receipt pode estar vinculado a um receipt anterior através do campo `previousReceiptId`. Este vínculo estabelece a identidade da cadeia.

### Cadeia de Receipts
Uma sequência ordenada de receipts onde:
1. O primeiro item (root) não possui `previousReceiptId`.
2. Cada item subsequente aponta para o ID do item imediatamente anterior.
3. Todos os itens possuem integridade verificada via self-hash.

## API Pública

### `findTraceReceiptSelfHash`
Localiza o hash com `scope = "receipt"`. Retorna `undefined` se não houver exatamente um.
**Nota:** Espera um receipt já validado estruturalmente.

### `verifyTraceReceiptSelfHash`
Valida a estrutura do receipt (via `safeParse`) e verifica se o seu self-hash corresponde ao conteúdo recalculado.

### `verifyTraceReceiptLink`
Verifica se o receipt `current` aponta corretamente para `previous` e se ambos possuem integridade válida.

### `verifyTraceReceiptChain`
Valida uma cadeia completa de receipts, coletando todos os erros identificados (IDs duplicados, links quebrados, hashes inválidos, etc.).

## Regras de Validação e Robustez

- **Integridade:** Exige exatamente um hash com `scope = "receipt"`.
- **Identidade:** O vínculo é feito estritamente pelo campo `previousReceiptId`.
- **Imutabilidade:** As funções de verificação não modificam os objetos de entrada.
- **Ordem:** A cadeia é validada na ordem em que é recebida no array.
- **Robustez:**
  - Utiliza `safeParse` para validação estrutural.
  - Se um item for inválido, ele não é acessado novamente e recebe um ID sintético (`unknown-<index>`) para fins de relatório de erro.
  - A validação continua para os itens subsequentes mesmo após falhas estruturais em itens anteriores.
  - Vínculos com predecessores inválidos são marcados como `INVALID_PREVIOUS_RECEIPT_ID`.

## Futuras Expansões
- Validação de consistência de `workspaceId` ao longo da cadeia.
- Verificação de timestamps crescentes.
- Suporte a ramificações (branching) se necessário.
