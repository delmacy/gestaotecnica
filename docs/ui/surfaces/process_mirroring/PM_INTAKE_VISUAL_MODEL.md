# Visual Model: Process Mirroring Intake

## 1. Objetivo visual
Prover uma interface clara e organizada para gerenciamento de pilotos de processo.

## 2. Layout recomendado
Layout de painel duplo: lista lateral à esquerda, painel de detalhes principal à direita.

## 3. Áreas da tela
- Header (Aviso de Mock Mode)
- Sidebar (Process Pilot List)
- Main Content (Pilot Details & Tabs)

## 4. Lista de pilotos
- Mostra nome do piloto, status, data source mode.

## 5. Painel de detalhe do piloto
- Título, descrição, workspace label, badges de status e data source mode.

## 6. Abas/seções internas
- Sources, Observations, Evidence, Gaps, As-Is, Validation, Capabilities.

## 7. Cards de fontes
- Lista de SourceInventoryItem com tipo, descrição e status.

## 8. Lista de observações
- Lista de Observations (ator, ação, sistema).

## 9. Matriz de evidências
- Mapeamento de fontes para observações, com força da evidência.

## 10. Gaps de coleta
- Lista de CollectionGaps com tipo e descrição.

## 11. Rascunho As-Is
- Resumo do processo atual.

## 12. Decisão de validação
- Status da decisão e notas.

## 13. Capability candidates
- Lista de candidatos a capabilities com justificativas.

## 14. Badges de origem de dados
- synthetic, mock, real_pending, real_anonymized, real_blocked, mixed.

## 15. Badges de status
- draft, collecting, needs_validation, validated_synthetic, blocked_real_sources, ready_for_capability_mapping, future_real_validation.

## 16. Limites do MVP
- Apenas leitura de mock data.
