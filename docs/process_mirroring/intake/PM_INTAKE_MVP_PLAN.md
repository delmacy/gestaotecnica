# PM Intake MVP Plan

## 1. Objetivo do MVP
Criar a estrutura visual para organizar e validar informações de espelhamento de processo usando apenas mock data.

## 2. O que o módulo faz
- Lista pilotos de processo.
- Exibe fontes sintéticas, observações, evidências, gaps.
- Exibe rascunho As-Is, decisão de validação, capability candidates.

## 3. O que o módulo não faz
- Não coleta fontes reais.
- Não usa banco de dados.
- Não executa workflow.
- Não valida processo real nesta fase.

## 4. Personas
- System Builder Platform Admin / Process Analyst.

## 5. Entidades mínimas
- ProcessPilot
- SourceInventoryItem
- ConsentRecord
- Observation
- EvidenceItem
- CollectionGap
- AsIsMirrorDraft
- ValidationDecision
- CapabilityCandidate

## 6. Telas mínimas
- Process Pilot List
- Process Pilot Detail
- Source Inventory
- Observation Log
- Evidence Matrix
- Gap Tracker
- As-Is Mirror Draft
- Validation Decision
- Capability Candidates

## 7. Fluxo de uso
1. Seleciona um piloto na lista.
2. Navega pelas abas para ver os detalhes do espelhamento (Sources, Observations, etc.).

## 8. Dados sintéticos permitidos
- Dados simulados sem PII.
- Identificadores fictícios.

## 9. Dados reais futuros
- Fontes reais operacionais.
- Entrevistas, exportações de sistemas, documentos reais.

## 10. Regras de consentimento
- Requer anonimização para dados reais futuros.

## 11. Regras de anonimização
- Remoção de qualquer PII antes do uso em tela.

## 12. Gaps conhecidos
- Sem persistência real.
- Sem integração com sistema de arquivos.

## 13. Critérios de aceite
- Superfície renderiza sem erros.
- Mock data é exibido corretamente nas seções definidas.
- Aviso de mock mode visível.

## 14. Próximas tasks
- DEV-READINESS-PM-INTAKE-001
- DEV-PM-INTAKE-001
