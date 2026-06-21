# Plano de Validação por Fases - System Builder

Este documento estabelece o plano de validação por fases (Phased Validation Plan) para o System Builder, com o objetivo de conectar de forma rigorosa a documentação, os contratos, os testes operacionais e a implementação, prevenindo regressões, "alucinações" do agente e perda de dados.

O princípio central é garantir que o plano seja **condicional ao tipo de entrega**. Nem toda task exige as sete fases. Entregas estritamente documentais podem encerrar na revisão documental; contratos, fixtures, testes e CI/CD são exigidos apenas quando aplicáveis ao escopo. Além disso, a separação de estados de prontidão (Readiness) e aceite é vital para o ciclo.

---

## Separação de Prontidão e Aceitação

Para garantir a qualidade e a correta transição de estados, o ciclo de vida da feature divide-se em níveis claros de prontidão e aceite:

1. **Document Readiness:** A feature tem o modelo, problema e proposta claros (Documentação Executável). Pode marcar o fim para entregas estritamente documentais.
2. **Implementation Ready:** Os contratos, testes e código base foram construídos e avaliados com sucesso localmente, prontos para CI/CD e PR.
3. **ACCEPT_DELIVERY:** O reviewer/tester atesta que a feature atende aos critérios funcionais e operacionais na PR, mesmo que existam bloqueios momentâneos na CI/CD (ex: Actions não configuradas) que permitam o aceite de entrega, mas não o merge imediato.
4. **MERGE_READY:** A PR foi aprovada, e todos os pipelines de CI/CD (verificações obrigatórias) passaram com sucesso (verde real). Nenhuma flag de `DRY_RUN` ou falha bloqueante existe.
5. **MERGE_PR:** O momento em que o código é efetivamente incorporado à branch de destino. A fase de merge e os pipelines de pós-merge **não** são critérios prévios de aceitação (pois o aceite ocorre antes da decisão de integrar e promover).

---

## Fases de Validação

O ciclo de desenvolvimento passa pelas seguintes fases, **exigidas condicionalmente com base no escopo da tarefa**.

### Fase 1: Documentação Executável
*Obrigatória para iniciar qualquer modelo arquitetural ou de sistema.*

- **Entrada:** Escopo ou requisito do usuário/tarefa.
- **Saída:** Documentos no formato Markdown descrevendo claramente o problema, solução e limites (ex: `README.md`, manifesto do projeto).
- **Evidência:** Revisão aprovada do arquivo Markdown por um membro técnico.
- **Bloqueios Comuns:** Ambiguidade nos requisitos, escopo não bem definido.
- **Critério de Passagem (Document Readiness):** Aprovação explícita da documentação e definição arquitetural base clara. Entregas puramente documentais podem terminar nesta etapa e seguir direto para validação da PR.

### Fase 2: Contrato de Dados/Processo
*Condicional: Apenas para tarefas que criam/alteram tipos, esquemas ou APIs.*

- **Entrada:** Documentação Executável (Fase 1).
- **Saída:** Esquemas de validação (ex: Zod, JSON Schema), interfaces ou contratos de processos.
- **Evidência:** Arquivos TypeScript contendo as definições de schemas (ex: `docs/contracts/...`).
- **Bloqueios Comuns:** Uso de `any`, validação parcial, esquemas permissivos demais.
- **Critério de Passagem:** Regras rigorosas de segurança documentadas e aplicadas nas definições de schema (ex: `additionalProperties: false`).

### Fase 3: Fixtures ou Demo Sintética
*Condicional: Apenas para tarefas de UI, dados sintéticos ou persistência.*

- **Entrada:** Contrato de Dados (Fase 2).
- **Saída:** Arquivos com mocks, fixtures testáveis ou `seed` para o banco de dados.
- **Evidência:** Execução de scripts (ex: `npm run db:seed`, `drizzle-kit push`, importação de mock) - se existirem e forem aplicáveis.
- **Bloqueios Comuns:** Dados "alucinados", inválidos ou de difícil reprodutibilidade local.
- **Critério de Passagem:** Sistema ou mock processam os fixtures com os dados em conformidade com o contrato.

### Fase 4: Testes Unitários e Integração
*Condicional: Apenas para tarefas que envolvem lógica de aplicação ou quebra de contratos.*

- **Entrada:** Fixtures (Fase 3), Código da feature.
- **Saída:** Código e execução dos testes com cobertura das features e tratamento de erros.
- **Evidência:** Execução real (`npm run test:unit`, `npm run test:e2e` quando existirem/aplicáveis).
- **Bloqueios Comuns:** Testes dependentes do ambiente, resultados falsificados ou "flaky".
- **Critério de Passagem:** Suítes executadas, finalizadas com sucesso (Exit 0) e logs anexados, sem asserts falsos (Implementation Ready).

### Fase 5: GitHub Actions
*Condicional: Requerida antes de um PR ser MERGE_READY.*

- **Entrada:** PR criada + rotinas do CI (`system-builder-operations`).
- **Saída:** Pipeline reportando os checks no GitHub Step Summary.
- **Evidência:** Logs e status real da Action anexados na validação.
- **Bloqueios Comuns:** Injeção insegura de dependências e falsos-positivos.
- **Critério de Passagem:** Aprovação (Success real) na automação. Se o status for `NOT_CONFIGURED` ou `DRY_RUN`, deve ser explicitamente registrado como estado parcial ou bloqueio de merge – **jamais inventar ou equivaler isso a sucesso/aprovado**.

### Fase 6: Validação de PR por Reviewer/Tester
*Obrigatória: O PR é a unidade de entrega.*

- **Entrada:** O repositório com o PR em revisão, com "Receipts" locais.
- **Saída:** PR contendo a thread de aprovação/revisão técnica.
- **Evidência:** Recibos operacionais e evidência de testes manuais descritos claramente.
- **Bloqueios Comuns:** PRs monolíticos, falta de evidência registrada ou omitir omissão de testes.
- **Critério de Passagem (ACCEPT_DELIVERY / MERGE_READY):** O revisor confirma funcionalmente a entrega (ACCEPT_DELIVERY). Para obter o MERGE_READY, a Fase 5 deve estar configurada e verde.

### Fase 7: Promoção para Implementação de Código (MERGE_PR)
*Decisão Final (Não é pré-requisito para o aceite).*

- **Entrada:** O repositório em MERGE_READY.
- **Saída:** O artefato implementado via merge.
- **Evidência:** Commit de merge e execuções de pipelines de CD/Pós-merge.
- **Nota:** A promoção, o pós-merge e eventuais deploys são eventos subsequentes que ocorrem **após a aceitação da entrega**. Não são bloqueantes para atestar que o trabalho (PR) atendeu os requisitos estabelecidos.

---

*Regra de Honestidade: Se um teste ou validação não foi executado (ou executado parcialmente), ele deve ser declarado como 'não testado' ou 'falhou'. Inventar, simular sucesso ou declarar falsos positivos é estritamente proibido durante todo o plano de validação por fases.*
