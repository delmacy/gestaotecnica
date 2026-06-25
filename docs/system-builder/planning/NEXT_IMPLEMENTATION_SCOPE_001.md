# System Builder Next Implementation Scope 001

## Visão Geral

Este documento define os próximos candidatos de implementação para o System Builder, focando em tarefas pequenas, testáveis e com escopo limitado ao repositório, garantindo a separação entre a plataforma central e as instâncias de clientes (como a Gestão Técnica).

---

## Candidatos de Implementação (System Builder Platform)

### [ENTREGUE] Candidato 1: Implementação de Contratos de Validação para Workflows
**Status:** Entregue via `d01d4d9 feat(workflow): implement process definition validation boundary` e PRs associados (#283-#287).
**Objetivo Original:** Criar um contrato base de validação em TypeScript para os workflows da plataforma.
*Nota: Este candidato não deve mais ser executado, pois as validações em `process-definition.ts` e `process-node-edge.ts` já foram implementadas e aprovadas.*

### [DESCARTADO/DIVERGENTE] Candidato 2: Gerador de Schema de Payload de Ações
**Status:** Descartado. A arquitetura seguiu um padrão diferente.
**Motivo do Descarte:** A plataforma adotou o padrão de Registro Explícito de Ações via `initializePlatformKernel()` e `registerAction()` (conforme documentado em `ACTION_REGISTRY_OPERATOR_NOTES.md` e nos commits `f8c4f2d`, `5d25b25`), em vez de geração dinâmica de schemas de payload. O plano original divergiu da realidade técnica adotada.

### [NOVO ESCOPO] Candidato 2.1: Contrato de Execução Base para Action Handlers
**Objetivo:** Como o Action Registry atualmente exibe apenas metadados (conforme notas de operação), o próximo passo estrutural é definir o contrato de execução estrito (`ActionHandler` base) que essas definições poderão invocar futuramente.
**Arquivos/Módulos Afetados:**
- `src/platform/actions/contracts/action-handler.ts`
- `src/platform/actions/contracts/action-handler.test.ts`
**Evidência de Aceitação:** Testes unitários garantindo que um handler genérico impõe limites estritos de entrada e saída.
**Comandos de Validação:** `npm run test`
**Limites Fora de Escopo:** Não conectar este contrato ao Registry View ainda (apenas garantir a interface core). Não implementar handlers de produto.

---

## Candidatos de Implementação (Client-Specific - Gestão Técnica)

*Aviso: As tarefas nesta seção destinam-se a futuros repositórios de clientes (ex: `delmacy/gestaotecnica-client` se aplicável) ou à área designada para implementações de clientes, caso esta esteja separada arquiteturalmente.*

### [PRÓXIMO ESCOPO] Candidato 3 (Future Client): Estratégia de Migração de Schema para Gestão Técnica
**Objetivo:** Definir e implementar as migrações iniciais de banco de dados (Drizzle ORM) específicas para o modelo de dados da Gestão Técnica, criando o histórico formal de evolução do schema.
**Arquivos/Módulos Afetados:**
- `src/db/runtime/schema/` (arquivos de schema de negócio)
- `src/db/migrations/` (arquivos SQL gerados)
**Evidência de Aceitação:** Migrações geradas com sucesso (`drizzle-kit generate`) e aplicáveis com segurança (`drizzle-kit push` ou comando de migração padrão).
**Comandos de Validação:** Execução bem-sucedida de comandos de lint e geração do Drizzle.
**Limites Fora de Escopo:** Não alterar o schema core da plataforma (`src/db/platform/`). Não inserir dados de produção.
**Nota de Limite de Plataforma:** Esta task DEVE ser executada apenas no escopo do domínio `gestaotecnica` e não afetar a plataforma base.

### [PRÓXIMO ESCOPO] Candidato 4 (Future Client): Mirroring Inicial de Processos da Gestão Técnica
**Objetivo:** Criar os primeiros documentos de Process Mirroring capturando o fluxo de trabalho real da Gestão Técnica, traduzindo as operações manuais em um formato legível antes da automação.
**Arquivos/Módulos Afetados:**
- `docs/process_mirroring/gestao_tecnica/fluxo_atendimento_inicial.md`
**Evidência de Aceitação:** Documento Markdown criado, revisado e validado contra a realidade do processo (aprovação manual).
**Comandos de Validação:** N/A (Validação documental/humana).
**Limites Fora de Escopo:** Não escrever nenhum código de automação. Não criar contratos baseados neste espelho.
**Nota de Limite de Plataforma:** Pertence exclusivamente à base de conhecimento do cliente Gestão Técnica.