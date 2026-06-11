# PM Intake Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar a casca e estrutura visual de dados do Process Mirroring Intake contendo unicamente mock data.

## 2. Arquivos candidatos prováveis
- src/app/(builder)/builder/process-mirroring/page.tsx
- src/components/builder/process-mirroring/ProcessMirroringIntake.tsx
- src/components/builder/process-mirroring/ProcessPilotList.tsx
- src/components/builder/process-mirroring/ProcessPilotDetail.tsx
- src/components/builder/process-mirroring/SourceInventoryPanel.tsx
- src/components/builder/process-mirroring/ObservationLogPanel.tsx
- src/components/builder/process-mirroring/EvidenceMatrixPanel.tsx
- src/components/builder/process-mirroring/GapTrackerPanel.tsx
- src/components/builder/process-mirroring/AsIsDraftPanel.tsx
- src/components/builder/process-mirroring/ValidationDecisionPanel.tsx
- src/components/builder/process-mirroring/CapabilityCandidatesPanel.tsx
- src/components/builder/process-mirroring/process-mirroring-data.ts
- src/components/builder/process-mirroring/process-mirroring-types.ts

## 3. Componentes candidatos
Lista, Cards, Abas (Tabs) do shadcn ou similares disponíveis.

## 4. Dados mockados permitidos
- Technical Service Intake (synthetic demo)
- Clinic Appointment Intake (synthetic demo)
- Workshop Repair Intake (synthetic demo)

## 5. Dados proibidos
Dados reais, PII, requisições de banco de dados ou API.

## 6. Regras visuais obrigatórias
Mostrar aviso explícito de mock mode / synthetic data. Diferenciar status via Badges.

## 7. Regras de interação simuladas
Selecionar piloto, trocar de abas, exibição dos dados.

## 8. Critérios de aceite
Superfície rodando no builder sem erros de SSR ou hidratação. Mock data visível corretamente.

## 9. Testes esperados
Unit tests básicos confirmando renderização da lista.

## 10. Gatilhos de parada
Se necessitar conectar a API real, banco, persistência de arquivo.
