# AGENTS.md - System Builder Platform

Este arquivo contém as diretrizes mestras para IAs e desenvolvedores atuando neste repositório.

> **Nota de Domínio de Agentes:** Consulte sempre `docs/archive/planning/JULES_AGENT_BOUNDARIES.md` para verificar as regras de nomenclatura, limites de domínio e política de isolamento entre agentes antes de iniciar um prompt.

## 1. Princípios de Decisão

- **Follow the Process:** A realidade operacional precede a abstração técnica.
- **The Principle is the Process:** O valor está na fidelidade do espelhamento do processo.
- **Understand. Mirror. Evolve:** Não pule etapas. Compreenda antes de codificar.

## 2. Tese Arquitetural: Process Candidates & Agentes

- **Process Candidate é a Ponte:** Todo processo formal descoberto através de sinais, integrações ou observações nasce como um "Process Candidate". Ele não vai para produção sem aprovação.
- **Integração Paperclip:** O Paperclip é uma integração de agentes **futura**, não é a fonte da verdade nem uma dependência obrigatória do MVP.
- **Limites de Agentes:** Agentes podem observar a operação e propor candidatos (Process Candidates), formulários, estados, e regras, mas **nunca publicam processos em produção sozinhos**. A publicação exige aprovação de um humano (Process Owner/Arquiteto).
- **Core Platform:** O Postgres é a única Source of Truth. O System Builder é quem governa, versão e executa. O n8n é apenas um integrador de borda (signals, webhooks, eventos). A UI do Builder deve evoluir para um verdadeiro Control Plane.

## 3. Arquitetura de Separação

- **System Builder (Platform/Factory):** Localizado em `src/platform/`. É agnóstico ao negócio.
- **Blueprint/Runtime (Client/App):** Localizado em `src/adaptations/` e `src/modules/`. Representa o domínio aplicado.
- **Banco Unificado por Schemas:** Platform e Runtime usam `tec_db`.
  - Preserve a separação lógica entre schemas Platform e Runtime.
  - Use `DATABASE_URL`, `PLATFORM_DATABASE_URL` e `RUNTIME_DATABASE_URL`
      apontando para `tec_db`.
  - Não mova tabelas entre schemas para contornar contratos.

## 3. Regras de Código e Dados

- **Drizzle Schemas:** Use schemas PostgreSQL explicitamente conforme `docs/archive/database/SCHEMA_STRATEGY.md`.
- **JSONB:** Use para payloads flexíveis e snapshots, nunca para evitar modelagem necessária.
- **workspace_id:** Obrigatório em todas as consultas e tabelas operacionais.
- **Imutabilidade:** Eventos (`event_logs`) e trilhas de auditoria devem ser imutáveis.

## 4. Ordem de Modelagem

Antes de criar uma nova funcionalidade, documente em `docs/`:

1. Qual capacidade organizacional ela representa?
2. Qual processo ela suporta?
3. Como será rastreada?

## 5. Paridade Frontend Obrigatória

- Toda evolução de backend, banco, domínio, capability, workflow, form, regra,
  integração ou governança deve declarar seu impacto na interface.
- O usuário deve conseguir operar ou visualizar a capacidade dentro da área
  autenticada correta.
- Dados operacionais pertencem ao workspace selecionado; capabilities são
  globais e reutilizáveis, mas suas instalações são por workspace.
- Se uma fase for estritamente backend, ela deve registrar o motivo e criar um
  gap frontend rastreável.
- O gate de referência é `docs/archive/planning/FRONTEND_PARITY_GATE.md`.

## 6. Documentação de Referência

- `docs/PROJECT_MANIFEST.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/GLOBAL_WORK_BOARD.md`
- `docs/archive/foundation/MANIFESTO.md`
- `docs/archive/foundation/AI_CONSTITUTION.md`
- `docs/archive/foundation/ONTOLOGY.md`
- `docs/archive/architecture/PLATFORM_VS_CLIENT.md`
- `docs/archive/planning/FRONTEND_PARITY_GATE.md`

## Registro histórico por fase

Além dos documentos de planejamento, o projeto mantém registro histórico em:

`docs/archive/phases/`

Regras:

- Cada fase tem um arquivo próprio.
- Jules Dev pode apenas acrescentar relatório de execução ao arquivo da fase que implementou.
- Jules Dev não deve apagar ou sobrescrever execuções anteriores.
- Jules Dev não deve alterar revisões anteriores.
- Jules Documental estrutura os arquivos de fase e mantém o board.
- `WORK_BOARD.md` mostra o estado atual.
- `docs/archive/phases/**` preserva histórico.

## 7. Sincronização de Ambiente

- Como Jules Documental e Jules Dev atuam em instâncias e sessões diferentes, **é obrigatório** que Jules Dev atualize seu ambiente local (`git pull` ou fetch/rebase da branch principal/atual) antes de iniciar a implementação. Isso garante que o agente desenvolvedor tenha acesso aos últimos documentos de planejamento, contexto e regras recém-atualizados pelo agente documental.

## Agent Work Execution Rules
* Todo agente inicia por bootstrap
* Dev usa somente Task Kit
* Reviewer usa somente Review Kit
* Documentator usa somente Documentation Kit
* Integrator usa somente Integration Kit
* Nenhum agente amplia escopo
* Auditoria global exige package próprio
