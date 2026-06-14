# Wave Integration Policy

Este documento descreve as políticas de integração e consolidação de pacotes de trabalho aprovados na branch de integração da Wave.

## O Papel do Integrator

O Integrador é o Worker responsável por garantir a harmonia do repositório durante a consolidação da Wave.

- **Não repete o module review**: O Integrador confia nas aprovações dos Reviewers para a lógica interna dos pacotes.
- **Não amplia o pacote**: O Integrador não adiciona funcionalidades novas.
- **Ajuste de Agregadores**: O Integrador é o **único** autorizado a ajustar arquivos agregadores compartilhados (ex: arquivos de index, registros centrais de módulos) para evitar conflitos de merge.
- **Bloqueio de integração**: Não integra pacotes sem reviews completos ou com falhas em testes de integração.

## Fluxo de Integração

### 1. Pacotes Aprovados e Review Receipts
Um pacote só entra na fila de integração após receber todos os `Review Receipts` com status `approved`.

### 2. Integration Kit
O Integrador gera um **Integration Kit** para visualizar a ordem de merge e os riscos:

```bash
npm run agent-work -- integration-kit --wave WAVE-01-FOUNDATION
```
O Kit fornece:
- Ordem sugerida de merge baseada no `mergeOrder`.
- Matriz de colisões amarelas (interseções de contratos).
- Comandos de rollback sugeridos.

### 3. Merge Order
A integração deve respeitar estritamente a ordem definida na Wave. Para a Wave 01:
1. Shared Contracts
2. Runtime Types
3. Event Types
4. Operation Docs
5. Runtime Tenancy (apenas após Runtime Types)

### 4. Integration Branch
Todo o trabalho é mergeado na branch `integration/wave-NN` (ex: `integration/wave-01`).
- Conflitos de merge em `Owned Paths` indicam falha no `collision-engine` e devem ser reportados.
- Conflitos em agregadores são resolvidos exclusivamente pelo Integrador.

### 5. Testes Pós-Merge
Após cada merge na branch de integração, os testes globais devem ser executados:
```bash
npm run test:unit
npm run test:integration
```
Se houver falha, a integração é interrompida.

### 6. Integration Receipt
*Nota: O comando `receipt:integration` está planejado, mas ainda não disponível na CLI (DOCUMENTATION_IMPLEMENTATION_GAP).*

## Rollback de Integração

Se uma instabilidade for detectada após o merge de múltiplos pacotes:
1.  O Rollback é realizado na **ordem reversa** do merge (LIFO).
2.  Cada pacote é removido da branch de integração através de `git revert` ou reset da branch (em ambiente controlado).
3.  O status do pacote é atualizado para `blocked` ou `ready` para nova correção.

## Finalização da Wave

Uma Wave é considerada concluída quando todos os pacotes previstos foram integrados com sucesso na branch de integração e esta foi mergeada na branch `main` através de uma PR final, após validação de fumaça (smoke tests) em ambiente de homologação.
