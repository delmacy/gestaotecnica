# AGENTS.md - System Builder Platform

Este arquivo contém as diretrizes mestras para IAs e desenvolvedores atuando neste repositório.

## 1. Princípios de Decisão
- **Follow the Process:** A realidade operacional precede a abstração técnica.
- **The Principle is the Process:** O valor está na fidelidade do espelhamento do processo.
- **Understand. Mirror. Evolve:** Não pule etapas. Compreenda antes de codificar.

## 2. Arquitetura de Separação
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
