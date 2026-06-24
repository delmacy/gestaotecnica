# System Builder Next Implementation Scope 001

## Visão Geral

Este documento define os próximos candidatos de implementação para o System Builder, focando em tarefas pequenas, testáveis e com escopo limitado ao repositório, garantindo a separação entre a plataforma central e as instâncias de clientes (como a Gestão Técnica).

---

## Candidatos de Implementação (System Builder Platform)

### Candidato 1: Implementação de Contratos de Validação para Workflows
**Objetivo:** Criar um contrato base de validação em TypeScript para os workflows da plataforma, garantindo que as fronteiras do motor de workflow sejam estritas e tipadas.
**Arquivos/Módulos Afetados:**
- `src/platform/workflows/contracts/validation-contract.ts`
- `src/platform/workflows/contracts/validation-contract.test.ts`
**Evidência de Aceitação:** Testes unitários cobrindo o contrato base, verificando a rejeição de payloads inválidos e a aceitação de payloads válidos.
**Comandos de Validação:** `npm run test` (focado no arquivo `validation-contract.test.ts`).
**Limites Fora de Escopo:** Não implementar o motor de workflow em si. Não criar workflows específicos de negócio.

### Candidato 2: Gerador de Schema de Payload de Ações
**Objetivo:** Implementar um utilitário para gerar e validar schemas JSON estritos para payloads de Ações da plataforma, prevenindo injecções ou processamento de dados inseguros.
**Arquivos/Módulos Afetados:**
- `src/platform/actions/contracts/schema-generator.ts`
- `src/platform/actions/contracts/schema-generator.test.ts`
**Evidência de Aceitação:** Testes unitários demonstrando a geração de schemas utilizando `SafeJsonRecordSchema` e a rejeição de definições inseguras.
**Comandos de Validação:** `npm run test` (focado no arquivo `schema-generator.test.ts`).
**Limites Fora de Escopo:** Não migrar ações existentes para o novo gerador neste momento. Não modificar o runner de ações.

---

## Candidatos de Implementação (Client-Specific - Gestão Técnica)

*Aviso: As tarefas nesta seção destinam-se a futuros repositórios de clientes (ex: `delmacy/gestaotecnica-client` se aplicável) ou à área designada para implementações de clientes, caso esta esteja separada arquiteturalmente.*

### Candidato 3 (Future Client): Estratégia de Migração de Schema para Gestão Técnica
**Objetivo:** Definir e implementar as migrações iniciais de banco de dados (Drizzle ORM) específicas para o modelo de dados da Gestão Técnica, criando o histórico formal de evolução do schema.
**Arquivos/Módulos Afetados:**
- `src/db/runtime/schema/` (arquivos de schema de negócio)
- `src/db/migrations/` (arquivos SQL gerados)
**Evidência de Aceitação:** Migrações geradas com sucesso (`drizzle-kit generate`) e aplicáveis com segurança (`drizzle-kit push` ou comando de migração padrão).
**Comandos de Validação:** Execução bem-sucedida de comandos de lint e geração do Drizzle.
**Limites Fora de Escopo:** Não alterar o schema core da plataforma (`src/db/platform/`). Não inserir dados de produção.
**Nota de Limite de Plataforma:** Esta task DEVE ser executada apenas no escopo do domínio `gestaotecnica` e não afetar a plataforma base.

### Candidato 4 (Future Client): Mirroring Inicial de Processos da Gestão Técnica
**Objetivo:** Criar os primeiros documentos de Process Mirroring capturando o fluxo de trabalho real da Gestão Técnica, traduzindo as operações manuais em um formato legível antes da automação.
**Arquivos/Módulos Afetados:**
- `docs/process_mirroring/gestao_tecnica/fluxo_atendimento_inicial.md`
**Evidência de Aceitação:** Documento Markdown criado, revisado e validado contra a realidade do processo (aprovação manual).
**Comandos de Validação:** N/A (Validação documental/humana).
**Limites Fora de Escopo:** Não escrever nenhum código de automação. Não criar contratos baseados neste espelho.
**Nota de Limite de Plataforma:** Pertence exclusivamente à base de conhecimento do cliente Gestão Técnica.
