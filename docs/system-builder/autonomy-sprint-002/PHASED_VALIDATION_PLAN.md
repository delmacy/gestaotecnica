# Plano de Validação por Fases - System Builder

Este documento estabelece o plano de validação por fases (Phased Validation Plan) para o System Builder, com o objetivo de conectar de forma rigorosa a documentação, os contratos, os testes operacionais e a implementação, prevenindo regressões, "alucinações" do agente e perda de dados.

O princípio central é garantir que a prontidão documental seja separada da prontidão de desenvolvimento, e que a progressão entre fases exija evidências reais, não simuladas.

---

## Separação de Prontidão (Readiness)

Para garantir a qualidade, o ciclo de vida da feature é dividido em dois estados de prontidão:

1. **Prontidão Documental (Document Readiness):** A feature está pronta para iniciar o desenvolvimento apenas quando o contrato (dados e processos) e o modelo/entendimento do problema estiverem claros e formalizados.
2. **Prontidão de Desenvolvimento (Development Readiness):** A feature está pronta para ser mesclada no código apenas quando todas as fases de testes operacionais e evidências práticas forem aprovadas.

---

## Fases de Validação

O ciclo de desenvolvimento passa pelas seguintes fases obrigatórias.

### Fase 1: Documentação Executável

O primeiro passo é garantir que o que será desenvolvido faz sentido do ponto de vista arquitetural e de negócios, com base no princípio *Markdown first*.

- **Entrada:** Escopo ou requisito do usuário/tarefa.
- **Saída:** Documentos no formato Markdown descrevendo claramente o problema, solução e limites (ex: `README.md`, manifesto do projeto).
- **Evidência:** Revisão aprovada do arquivo Markdown por um membro técnico.
- **Bloqueios Comuns:** Ambiguidade nos requisitos, escopo não bem definido, documentação desatualizada que induz a erros.
- **Critério de Passagem:** Aprovação explícita da documentação e definição arquitetural base clara.

### Fase 2: Contrato de Dados/Processo

Definição estrita das entradas e saídas que o sistema ou o componente irá aceitar e produzir, garantindo tipagem rigorosa.

- **Entrada:** Documentação Executável (Fase 1).
- **Saída:** Esquemas de validação (ex: Zod em TS, JSON Schema, esquemas de BD), interfaces ou contratos de processos.
- **Evidência:** Arquivos `.ts` contendo as definições de schemas exportadas e testáveis (ex: `docs/contracts/...` com referências concretas).
- **Bloqueios Comuns:** Uso de `any`, validação parcial de payloads, schemas flexíveis demais, proxies maliciosos ou desserialização insegura.
- **Critério de Passagem:** Regras rigorosas de segurança documentadas e aplicadas nas definições de schema (ex: `additionalProperties: false`).

### Fase 3: Fixtures ou Demo Sintética

Geração e provisão de dados de teste realistas que imitam o comportamento em produção (Demo Sintética).

- **Entrada:** Contrato de Dados (Fase 2).
- **Saída:** Arquivos com mocks, fixtures testáveis ou banco de dados com `seed` inicial validado.
- **Evidência:** Scripts rodados com sucesso (`npm run db:seed`, `drizzle-kit push`, relatórios de importação de mock).
- **Bloqueios Comuns:** Dados "alucinados" ou em formato inválido comparado aos contratos. Dependência de dados não reprodutíveis localmente.
- **Critério de Passagem:** Aplicação sobe e renderiza/consome os fixtures em ambiente local ou mock sem erros de contrato.

### Fase 4: Testes Unitários e Integração

Desenvolvimento com TDD ou validação com testes exaustivos baseados nas fixtures.

- **Entrada:** Fixtures (Fase 3), Código implementando a lógica em relação aos Contratos (Fase 2).
- **Saída:** Código dos testes em execução com cobertura das features e tratamento de erros.
- **Evidência:** Execução de suítes e logs contendo sucesso da execução real dos testes (`npm run test:unit`, `npm run test:e2e`). Resultados fakes são proibidos.
- **Bloqueios Comuns:** Testes dependentes do ambiente, "flaky tests", testes simulados onde não houve validação autêntica.
- **Critério de Passagem:** A suíte deve ser executada completamente, retornando sucesso (Exit Code 0), sem uso de asserts falsos.

### Fase 5: GitHub Actions

Validação sistêmica por CI/CD.

- **Entrada:** Código do produto + testes + YAML de Actions configurado ou reaproveitado de `system-builder-operations`.
- **Saída:** Checks executados via pipelines automatizados e padronizados.
- **Evidência:** Relatório de logs (GitHub Step Summary), indicando o status (com `NOT_CONFIGURED` ou `DRY_RUN` se aplicável) ou sucesso da run de Action anexado como log real.
- **Bloqueios Comuns:** Injeção de dependências inseguras, pin de actions inseguros (ex: usar `@main` em vez de SHA), ausência de isolamento em runners.
- **Critério de Passagem:** Logs reais comprovando a aprovação no build, tests e lint na pipeline automatizada com os SHAs fixos.

### Fase 6: Validação de PR por Reviewer/Tester

O Pull Request deve ser pequeno, independente, contendo as alterações estritas e aguardando a revisão técnica/humana.

- **Entrada:** O repositório pronto para submissão, checks de fase 5 rodados.
- **Saída:** PR aberto contendo a thread de review.
- **Evidência:** "Receipts" (recibos de execução local), evidência de teste prático copiado para a descrição do PR.
- **Bloqueios Comuns:** PRs grandes mudando arquivos sem relação, falta de evidências registradas (Ex: o agente omite que não rodou os testes).
- **Critério de Passagem:** Validação manual documentando a execução prática com a matriz de comandos no PR e review aprovada sem intervenções silenciosas.

### Fase 7: Promoção para Implementação de Código

Incorporação do artefato na branch principal de forma segura.

- **Entrada:** PR aprovado (Fase 6).
- **Saída:** O código sendo incorporado à `main` via `merge` assíncrono.
- **Evidência:** O commit de merge presente no repositório.
- **Bloqueios Comuns:** Mudanças nos contratos após testes, merge conflict, PR corrompido.
- **Critério de Passagem:** O pipeline pós-merge executou perfeitamente e o estado final corresponde à evidência previamente registrada.

---

*Regra de Honestidade: Se um teste ou validação não foi executado (ou executado parcialmente), ele deve ser declarado como 'não testado' ou 'falhou'. Inventar, simular sucesso ou declarar falsos positivos é estritamente proibido durante todo o plano de validação por fases.*
