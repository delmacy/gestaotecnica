# As-Is Mirror Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar os componentes de interface (UI) e a página principal para o "As-Is Mirror Board", utilizando exclusivamente dados sintéticos em memória (mock data) para aprovar visual e estruturalmente o conceito de espelhamento As-Is.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/process-mirroring/as-is/page.tsx`
- `src/components/builder/as-is-mirror/AsIsMirrorBoard.tsx`
- `src/components/builder/as-is-mirror/AsIsMirrorList.tsx`
- `src/components/builder/as-is-mirror/AsIsStepMap.tsx`
- `src/components/builder/as-is-mirror/AsIsStepCard.tsx`
- `src/components/builder/as-is-mirror/AsIsStepDetailPanel.tsx`
- `src/components/builder/as-is-mirror/AsIsHandoffPanel.tsx`
- `src/components/builder/as-is-mirror/AsIsEvidencePanel.tsx`
- `src/components/builder/as-is-mirror/AsIsGapOverlayPanel.tsx`
- `src/components/builder/as-is-mirror/AsIsCapabilityPanel.tsx`
- `src/components/builder/as-is-mirror/as-is-mirror-data.ts`
- `src/components/builder/as-is-mirror/as-is-mirror-types.ts`

## 3. Componentes candidatos
- Componentes da biblioteca padrão de UI (`lucide-react`, wrappers padrão se aplicável) ou Tailwind CSS simples.
- Gerenciamento de estado via `useState` local do React.

## 4. Dados mockados permitidos
- 3 exemplos completos de processo As-Is: Technical Service Intake, Clinic Appointment, Workshop Repair.
- Mínimo de 6 etapas e complexidades por exemplo (handoffs, gaps, capacidades).

## 5. Dados proibidos
- PII (Informação Pessoal Identificável) real.
- Chamadas de API, Queries de Banco, Actions Next.js que interajam com ORM real.

## 6. Regras visuais obrigatórias
- Aviso claro e persistente na UI: "Synthetic Demo / Not Runtime Workflow".
- Evidências visuais de incertezas (badges/ícones vermelhos ou amarelos para `low`/`unknown`).

## 7. Regras de interação simuladas
- Clicar em um Process Mirror muda a visão ativa no `AsIsMirrorBoard`.
- Clicar num passo altera o conteúdo do Painel Lateral (`AsIsStepDetailPanel`).

## 8. Critérios de aceite
- Todos os arquivos e rotas devem ser acessíveis no navegador sem estourar erros de Next.js.
- Todas as estruturas do mock devem ser processadas visualmente (gaps, inputs, outputs, etc).
- As restrições e limites de dados reais devem estar claros para a Persona.

## 9. Testes esperados
- `npm run build` deve passar sem falhas de tipagem.
- Componentes isolados não devem quebrar o resto do projeto.

## 10. Gatilhos de parada
- Parar o dev se for identificado que algum componente depende fortemente de uma biblioteca nova de terceiros (ex: ReactFlow complexo). Substituir por flexbox layout simples.
