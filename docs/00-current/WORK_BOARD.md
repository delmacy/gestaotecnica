# Work Board — System Builder

## 1. Estado atual

| Campo | Valor |
|---|---|
| Fase técnica atual | Fase 17A |
| Fase documental atual | Fase 16C |
| Última fase técnica aprovada | Fase 16 |
| Última fase documental aprovada | Fase 12B |
| Próxima fase técnica | Fase 17A |
| Próxima fase documental | Planejamento 17B–17E |
| Responsável técnico | Jules Dev |
| Responsável documental | Jules Documental |
| Revisor | ChatGPT |
| Dono do projeto | Delmacy |

## 2. Trilhas de trabalho

| Trilha | Responsável | Status | Observação |
|---|---|---|---|
| Documentação/contexto | Jules Documental | Em andamento | Mantém 3–4 fases futuras |
| Implementação | Jules Dev | Pendente | Implementará a fase técnica 17A |
| Revisão | ChatGPT | Sob demanda | Revisa merges e coerência |
| Decisão de produto | Delmacy | Ativo | Aprova direção e prioridades |

## 3. Fila técnica

| Ordem | Fase | Tipo | Status | Responsável | Depende de | Observação |
|---:|---|---|---|---|---|---|
| 1 | Fase 17A | Técnica | Pendente | Jules Dev | Fase 16/16B | Runtime schema e contratos p/ runtime mínimo |
| 2 | Fase 17B | Técnica | Planejada | Jules Dev | Fase 17A | Runtime repository p/ leitura e escrita de instâncias |
| 3 | Fase 17C | Técnica | Planejada | Jules Dev | Fase 17B | Runtime service (Regra de inicialização) |
| 4 | Fase 17D | Técnica | Planejada | Jules Dev | Fase 17C | Server action para disparo da inicialização |
| 5 | Fase 17E | Técnica | Planejada | Jules Dev | Fase 17D | Interface mínima (botão/shell) UI para ação de inicializar |

## 4. Fila documental

| Ordem | Fase | Status | Responsável | Objetivo |
|---:|---|---|---|---|
| 1 | Fase 16C | Concluída | Jules Documental | Context packs, índices e WORK_BOARD criados/atualizados. |
| 2 | Planejamento 17B | Pendente | Jules Documental | Detalhar estrutura e contratos do runtime repository. |
| 3 | Planejamento 17C | Pendente | Jules Documental | Detalhar orquestração do runtime service. |
| 4 | Planejamento 17D | Pendente | Jules Documental | Especificar payload para a nova Server Action. |

## 5. Bloqueios

| ID | Bloqueio | Responsável | Status | Resolução esperada |
|---|---|---|---|---|
| B-001 | Revisão pendente da 16B | ChatGPT / Delmacy | Aberto | Confirmar merge/revisão da Fase 16B antes de autorizar codificação final da Fase 17A (Runtime mínimo). |

## 6. Decisões recentes

| Data | Decisão | Impacto |
|---|---|---|
| Atual | Granularidade Estrita Fase 17 | Fase 17 dividida em A, B, C, D e E isolando schema, db access, logic, actions e UI. Isso evita quebras e garante entregas atômicas e testáveis. |
| Atual | Criação do Work Board e Anti-escopo | Centralização da governança documental que dita ritmo para a instância DEV sem código misturado. |

## 7. Handoff para Jules Dev

```text
Próxima fase técnica: Fase 17A — Runtime schema e contratos

Resumo:
Criar os contratos lógicos do Typescript (interfaces) e as definições do esquema Drizzle necessárias para iniciar a primeira camada do "Runtime". O foco total é habilitar o registro de execução para um processo Publicado, através de instâncias (`process_instances`).

Arquivos principais a criar/modificar:
- `src/db/runtime/schema/workflow-runtime.ts` (ou similar/designado no seu plan).
- Types base para instâncias (sem interface completa de etapas ainda).

Context pack obrigatório:
- `docs/context-packs/runtime.md`
- `docs/00-current/ANTI_ESCOPO_ATUAL.md`

Regra de parada:
Apenas garanta que o ambiente compile com os novos schemas (não rode DB push) e forneça os arquivos criados. Não implemente repositories, APIs ou UI. Verifique o git status.
```

## 8. Handoff para Jules Documental

```text
Próxima fase documental: Planejamento 17B e 17C

Resumo:
Aguardar aprovação ou andamento da 17A e começar a esboçar a modelagem de código para o Repository (17B) e a lógica de Service (17C).

Entregáveis:
Prompts prontos para a instância Dev implementá-los usando Injeção de Dependências, sem acoplar com APIs Web e especificando respostas padronizadas (ok/error).
```

## 9. Última revisão ChatGPT

| Campo | Valor |
|---|---|
| Última revisão | YYYY-MM-DD (Pendente/Não registrada nesta view recém-criada) |
| Resultado | Aguardando |
| Observações | Esperando a validação final da documentação (16C) e do código da Fase 16B. |
