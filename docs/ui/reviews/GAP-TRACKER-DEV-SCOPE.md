# Gap Tracker Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar a UI do Gap Tracker em modo isolado (mock state), exibindo a lista e o detalhamento de gaps usando dados sintéticos.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/process-mirroring/gaps/page.tsx`
- `src/components/builder/gap-tracker/GapTracker.tsx`
- `src/components/builder/gap-tracker/GapList.tsx`
- `src/components/builder/gap-tracker/GapDetailPanel.tsx`
- `src/components/builder/gap-tracker/GapFilters.tsx`
- `src/components/builder/gap-tracker/GapRiskImpactPanel.tsx`
- `src/components/builder/gap-tracker/GapRequiredSourcesPanel.tsx`
- `src/components/builder/gap-tracker/GapMissingEvidencePanel.tsx`
- `src/components/builder/gap-tracker/GapRelationsPanel.tsx`
- `src/components/builder/gap-tracker/GapNextActionPanel.tsx`
- `src/components/builder/gap-tracker/gap-tracker-data.ts`
- `src/components/builder/gap-tracker/gap-tracker-types.ts`

## 3. Componentes candidatos
- Tabela, Cards, Badges, Tabs padrão (sem libs externas novas pesadas, usar radix existente ou nativo).

## 4. Dados mockados permitidos
- Technical Service Intake
- Clinic Appointment Intake
- Workshop Repair Intake
(Todos sintéticos).

## 5. Dados proibidos
- PII, fontes reais.

## 6. Regras visuais obrigatórias
- Aviso "Synthetic/Mock Mode".
- Badges claros para status.

## 7. Regras de interação simuladas
- Selecionar, filtrar, alterar review decision em client state.

## 8. Critérios de aceite
- Navegável na rota candidata.
- Mock renderizado.
- Zero dependência externa não autorizada.

## 9. Testes esperados
- `npm run lint`, `build` local. Testes unitários onde couber.

## 10. Gatilhos de parada
- Exigência de banco, runtime, auth real, ou markdown mutation.
