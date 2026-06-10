# Decisão de Validação do Piloto (Pilot Validation Decision)

## Documento: PM-PILOT-003_VALIDATION_DECISION.md
**Referência da Task:** PM-PILOT-003

---

## 1. Contexto da Decisão
A task PM-PILOT-002 levantou o cenário e arquitetou os artefatos base (`SOURCE_INVENTORY`, `OBSERVATION_LOG`, `EVIDENCE_MATRIX`, `AS_IS_MIRROR_DRAFT` e `COLLECTION_GAPS`) utilizando dados inteiramente sintéticos/simulados em função do bloqueio de fontes reais.

Na presente task, PM-PILOT-003, procedemos com a revisão estrutural e lógica desses rascunhos. Foi atestado que os gaps existentes na captura de informações são críticos (especialmente as ausências de Consentimento GAP-006, as provas da UI do Sistema GAP-003 e as comprovações de shadow IT GAP-002 e GAP-001). Tentar avançar o modelo de capability matching com essas suposições gerará contratos de interface completamente irreais.

## 2. Status Decidido

**Decisão:** `NEEDS_REAL_SOURCES_BEFORE_CAPABILITY_MATCHING`

## 3. Justificativa
* Não podemos aprovar para Capability Matching uma modelagem que dependa 100% de premissas artificiais para os canais de comunicação, fluxos de permissão (Supervisores) e estrutura de dados de entrada do cliente final.
* O roteiro de entrevistas já está construído (`HUMAN_VALIDATION_SCRIPT.md`), mas precisa ser executado por um humano antes de submeter os dados ao arquiteto do sistema (CAP-VAL-002).
* O gap GAP-006 (Falta de consentimento) proíbe eticamente e arquiteturalmente a publicação desse espelho.

## 4. Requisitos para Reversão do Bloqueio
Para alterar o status e habilitar a fase `CAP-VAL-002`, o Product Owner / Cliente precisará fornecer:
1. **Consentimento Explícito (GAP-006):** Aceite formal para rodar o processo.
2. **Entrevistas/Transcrições (GAPs 001, 002, 004, 005):** Respostas fundamentadas às questões levantadas em `HUMAN_VALIDATION_SCRIPT.md`, com prints anonimizados de suporte (WhatsApp e Planilhas).
3. **UI do Sistema Antigo (GAP-003):** Print anonimizado/borrado da tela em que a OS é criada hoje.
