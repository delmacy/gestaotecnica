# Form Builder - Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar o UI Form Builder em modo "Design-only", focado em arranjar componentes de React na tela baseando-se numa matriz JSON em um arquivo `.ts`. Deve possuir 3 colunas principais e focar em demonstrar a governança e binding com o backend.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/form-builder/page.tsx`
- `src/components/builder/form-builder/FormBuilderStudio.tsx`
- `src/components/builder/form-builder/FormBlueprintList.tsx`
- `src/components/builder/form-builder/FormCanvas.tsx`
- `src/components/builder/form-builder/FormFieldCard.tsx`
- `src/components/builder/form-builder/FormFieldPalette.tsx`
- `src/components/builder/form-builder/FormFieldDetailPanel.tsx`
- `src/components/builder/form-builder/FormPreviewPanel.tsx`
- `src/components/builder/form-builder/FormValidationPanel.tsx`
- `src/components/builder/form-builder/FormBindingsPanel.tsx`
- `src/components/builder/form-builder/FormGovernancePanel.tsx`
- `src/components/builder/form-builder/form-builder-data.ts`
- `src/components/builder/form-builder/form-builder-types.ts`

## 3. Componentes candidatos
- **Studio:** Mantém o estado global (Qual formulário, qual campo selecionado, qual aba do inspetor).
- **Canvas:** Renderiza a lista de `FormFieldCard` sequencialmente.
- **Preview:** Um switch visual que transforma a lista de cartões em Inputs normais "disabled" ou "readonly" para evitar ilusão de usabilidade.
- **Inspector (Detail, Validation, Binding, Gov):** Menus com labels fixos ou `input` read-only/disabled que espelham a propriedade no mock JSON.

## 4. Dados mock/static schema permitidos
Deve conter 3 Formulários Base: "Technical Service Intake", "Clinic Appointment", "Workshop Repair". Devem ser hardcoded.

## 5. Dados proibidos
Drizzle `db.insert()`, Drizzle `db.select()`, Fetch, Actions Server-Side.

## 6. Regras visuais obrigatórias
Manter padrão de ícones do Lucide. Usar tailwind e componentes sem dependências externas massivas de DnD (caso não seja trivial a instalação sem npm config extra).

## 7. Regras de interação design-only
Permitir selecionar (clicar) no Card dentro do Canvas, disparando a atualização do Painel de Inspector na direita.

## 8. Critérios de aceite
Tela renderiza limpa. Seleção funciona. Preview é visível. Componentes renderizam os warnings vermelhos/amarelos.

## 9. Testes esperados
- Build next OK.
- Testes limpos no repositório.

## 10. Gatilhos de parada
Se o Canvas estiver demandando uma biblioteca pesada de Drag & Drop para ser aceitável visualmente, prefira um layout estático empilhado com setas de "cima/baixo" no card, para evitar problemas de compatibilidade sem testar.
