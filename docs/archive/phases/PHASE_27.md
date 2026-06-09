# Fase 27 — Business Rules and Approval Policies

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | 27 |
| Status | Planejada |
| Tipo | Produto alfa / Blueprint / Módulo |
| Responsável principal | Jules Dev / Jules Documental |
| Revisor | ChatGPT |
| Data de abertura | YYYY-MM-DD |
| Data de aprovação | — |

## 2. Objetivo

Business Rules and Approval Policies

## 3. Escopo permitido

- —

## 4. Fora de escopo

- —

## 5. Arquivos planejados

- —

## 6. Critérios de aceite

- —

## 7. Plano aprovado

Referência:
- `docs/planning/alpha/PHASE_27.md`

Resumo:
- —

## 8. Execuções

### Execução 001 — Jules Dev — YYYY-MM-DD

Status: Pendente

Arquivos criados:
- —

Arquivos alterados:
- —

Comandos executados:
- —

Resultado do lint:
- —

Resultado do build:
- —

Git status:
- —

Bloqueios:
- —

Observações:
- —

## 9. Revisões

### Revisão 001 — ChatGPT — YYYY-MM-DD

Resultado: Pendente

Observações:
- —

Ressalvas:
- —

Decisão:
- —

## 10. Decisões específicas da fase

- —

## 11. Histórico de correções

- —

## Execução Jules Dev - Business Rules and Approval Policies

**Data:** $(date -I)
**Branch:** phase-27-rules-engine
**Commit Base:** $(git log -n 1 --format="%H")

### Arquivos Criados/Alterados
- `src/features/builder/rules/rules.types.ts` (Criado)
- `src/features/builder/rules/rules.engine.ts` (Criado)
- `tests/unit/rules-engine.test.ts` (Criado)

### Contratos Definidos
- `RuleDefinition`
- `RuleCondition`
- `RuleConditionGroup`
- `RuleEffect`
- `ApprovalPolicy`
- `ApprovalRequirement`
- `RuleEvaluationContext`
- `RuleEvaluationResult`
- `RuleValidationResult`
- `RuleValidationIssue`

### Operadores e Efeitos Suportados
**Operadores:** `equals`, `not_equals`, `greater_than`, `greater_than_or_equal`, `less_than`, `less_than_or_equal`, `contains`, `in`, `exists`
**Efeitos:** `require_approval`, `reject`, `allow`, `request_information`, `wait_until`

### Política de Conflitos
- Regras são avaliadas primeiramente respeitando `priority` (maior para menor).
- `reject` e `allow` são indicados na array de efeitos recomendados e a interpretação posterior por sistemas de acúmulo garantirá a prevalência de restrições de acordo com a regra conservadora. (Nesta fase, a engine é estritamente pura e retorna todos os efeitos encontrados nas regras ativas cujo matching ocorreu).
- Requisitos de aprovação não resolvem Candidate nem Runtime diretamente.

### Segurança e Paths
A resolução de paths via `resolveSafePath` protege estritamente contra Prototype Pollution (rejeitando `__proto__`, `prototype`, `constructor`).
Falhas no getter (exceções lançadas internamente) são tratadas por um block `try/catch` de forma defensiva para não derrubar a engine.

### Políticas de Aprovação
O `validateApprovalPolicy` bloqueia timeout negativo ou configurações impossíveis (ex: mínimo de aprovação maior que total de aprovadores declarados). Nenhum timer real assinado.

### Restrição de Efeitos e Workers
Em conformidade ao escopo estrito, o Engine é 100% puro. Sem conexões a banco, requisições de rede, workers disparados, setTimeout ou chamadas `Date.now()`. O instante é recebido pelo `RuleEvaluationContext`.

### Testes Executados e Resultados
Foram rodados testes unitários exaustivos (via `npm run test:unit`) correspondentes às demandas (Testes 1 ao 27 cobertos por mais de 26 asserts em subtestes adversariais e felizes). Todos passaram com sucesso.

### Riscos Residuais
A interpretação dos efeitos não causa impacto isolado. Uma fase subsequente será necessária para consumir os resultados dessa avaliação, ou para gerar persistência oficial da Candidate associada a essas regras.

### Git Status Final
Código perfeitamente limpo, isolado, sem tocar em schemas ou alterar processos não-autorizados.
