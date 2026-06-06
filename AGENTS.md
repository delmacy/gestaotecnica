# AGENTS.md - System Builder Platform

Este arquivo contém as diretrizes mestras para IAs e desenvolvedores atuando neste repositório.

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
- **Bancos Separados:**
    - `system_builder_dev` (Plataforma/Metamodelo)
    - `gestao_tecnica_dev` (Operação Real)

## 3. Regras de Código e Dados
- **Drizzle Schemas:** Use schemas PostgreSQL explicitamente conforme `docs/database/SCHEMA_STRATEGY.md`.
- **JSONB:** Use para payloads flexíveis e snapshots, nunca para evitar modelagem necessária.
- **workspace_id:** Obrigatório em todas as consultas e tabelas operacionais.
- **Imutabilidade:** Eventos (`event_logs`) e trilhas de auditoria devem ser imutáveis.

## 4. Ordem de Modelagem
Antes de criar uma nova funcionalidade, documente em `docs/`:
1. Qual capacidade organizacional ela representa?
2. Qual processo ela suporta?
3. Como será rastreada?

## 5. Documentação de Referência
- `docs/foundation/MANIFESTO.md`
- `docs/foundation/AI_CONSTITUTION.md`
- `docs/foundation/ONTOLOGY.md`
- `docs/architecture/PLATFORM_VS_CLIENT.md`

## Registro histórico por fase

Além dos documentos de planejamento, o projeto mantém registro histórico em:

`docs/phases/`

Regras:
- Cada fase tem um arquivo próprio.
- Jules Dev pode apenas acrescentar relatório de execução ao arquivo da fase que implementou.
- Jules Dev não deve apagar ou sobrescrever execuções anteriores.
- Jules Dev não deve alterar revisões anteriores.
- Jules Documental estrutura os arquivos de fase e mantém o board.
- `WORK_BOARD.md` mostra o estado atual.
- `docs/phases/**` preserva histórico.

## 7. Sincronização de Ambiente
- Como Jules Documental e Jules Dev atuam em instâncias e sessões diferentes, **é obrigatório** que Jules Dev atualize seu ambiente local (`git pull` ou fetch/rebase da branch principal/atual) antes de iniciar a implementação. Isso garante que o agente desenvolvedor tenha acesso aos últimos documentos de planejamento, contexto e regras recém-atualizados pelo agente documental.
