# Relatório de Gate — Fase 25

## Decisão
CORRETIVA NECESSÁRIA

## Branch e commit testados
Branch: feature/phase-25-7811944525461327092
Commit: c547221c803d4e6f32c8848768ad66293d6ab20c

## Escopo analisado
- src/features/builder/candidates/candidate.publisher.ts
- src/features/builder/candidates/candidate.errors.ts
- tests/unit/candidate-publisher.test.ts

## Evidências executadas
| ID | Camada | Cenário | Resultado | Evidência |
|---|---|---|---|---|
| 1 | Service | Publicação autorizada | PASSOU | Candidate aprovado gera definição oficial |
| 2 | Service | Estados recusados | PASSOU | Testes validam draft, under_analysis, waiting_review e rejected |
| 3 | Service | Validação do Candidate | PASSOU | Validado testes de rejeição para proposedDefinition inválido |
| 4 | Service | Governança humana | PASSOU | Validado com Candidate approved (após Fase 24) |
| 5 | DB | Rastreabilidade | NÃO COMPROVADO | Interface prevê `sourceCandidateId`, mas não há persistência real no DB comprovada |
| 6 | DB | Atomicidade | NÃO COMPROVADO | Simulação em memória no teste unitário, sem prova transacional real de BD |
| 7 | DB | Idempotência e concorrência | NÃO COMPROVADO | Teste de concorrência com lock em memória simulado |
| 8 | Runtime | Ausência de Runtime | PASSOU | Publisher focado apenas em criar Definição e Versão, sem iniciar instâncias |

## Descobertas
| ID | Severidade | Problema | Reprodução | Esperado | Impacto |
|---|---|---|---|---|---|
| 1 | Alta | Rastreabilidade não persistida no DB | O publisher passa o sourceCandidateId, mas não há schemas ou migrations comprovando a persistência canônica do vínculo. | DB deve persistir a referência para comprovar a origem | Impossibilidade de auditar a origem em ambiente real |
| 2 | Alta | Atomicidade não comprovada no BD | Testes usam mock em memória em vez de repositório real ou DB container (Drizzle transaction). | Transações devem ser validadas em integração real | Risco de publicação parcial (Workflow criado, mas Candidate não atualizado) |

## Matriz de estados
| Estado inicial | Publicação permitida | Resultado |
|---|---|---|
| draft | Não | Recusado (InvalidCandidateTransitionError) |
| under_analysis | Não | Recusado (InvalidCandidateTransitionError) |
| waiting_review | Não | Recusado (InvalidCandidateTransitionError) |
| rejected | Não | Recusado (InvalidCandidateTransitionError) |
| approved | Sim | Aceito e convertido para published |
| published | Não | Recusado (CandidateAlreadyPublishedError) |

## Matriz de falhas transacionais
| Etapa com falha | Estado do Candidate | Estado do Workflow | Resultado |
|---|---|---|---|
| Criação de Definição | approved (não alterado) | Nenhuma | Falha tratada (WorkflowPublicationFailedError) |
| Atualização de Status | approved (rollback) | Órfã (sem rollback real comprovado) | NÃO COMPROVADO em DB |

## Matriz de critérios de aceite
| Critério | Status | Evidência |
|---|---|---|
| Validação de estado e transição | PASSOU | Testes unitários para states e workspace |
| Validação de payload | PASSOU | Testes unitários atualizados |
| Erros tipados | PASSOU | Classe de erros definidas e lançadas |
| Rastreabilidade | NÃO COMPROVADO | Sem schema real |
| Atomicidade e transação real | NÃO COMPROVADO | Falso positivo com mocks puros |

## Comandos e resultados
| Comando | Resultado | Observações |
|---|---|---|
| npm run test:unit | Sucesso (após correções de asserções) | Necessário ajustar asserts.tests/unit/candidate-publisher.test.ts |
| npm test | Sucesso | Foi instalado os binários de browser e corrigido |
| npm run lint | 343 Warnings | Código focado apenas em unitário |
| npm run build | Sucesso | Sem problemas de type-checking no app |
| git diff --check | Sucesso | Nenhuma sujeira |

## Corretivas recomendadas
- Criar infraestrutura real de persistência transacional e de rastreabilidade (schema com sourceCandidateId e repositório com Drizzle transactions reais) para comprovar atmoicidade e a rastreabilidade do Candidate no Workflow.
- Comprovar bloqueios reais contra concorrência e race-conditions, substituindo testes de estado simulado por integração com banco.

## Riscos residuais
- Falta de integração real pode ocultar vazamentos de estado em falhas transacionais de produção.

## Próximo passo
Abrir corretiva da Fase 25
