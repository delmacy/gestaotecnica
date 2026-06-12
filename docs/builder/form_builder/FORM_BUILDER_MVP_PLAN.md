# Form Builder - MVP Plan

## 1. Objetivo do MVP
Fornecer a superfície interativa (Studio) para desenhar conceitualmente a montagem de um formulário (`Form Blueprint`), operando 100% sobre dados estáticos locais. O objetivo é visualizar como as capabilities abstratas se ligam a inputs concretos (textos, números, seleções) antes de se implementar o motor gerador real de APIs/tabelas/componentes.

## 2. O que o módulo faz
- Lista os Form Blueprints indexados localmente no Mock Data.
- Apresenta um Canvas central onde os campos do form são listados.
- Contém uma Field Palette (menu lateral/seção) simulando adição de tipos de dados (text, number, date, checkbox).
- Exibe abas/painéis laterais com propriedades do campo (Field Detail), validações (Validation Rules), vínculos com o sistema (Bindings) e advertências (Governance Warnings).
- Disponibiliza uma aba de "Preview", onde o form montado pode ser "testado" (apenas visualmente).
- Indica visualmente o status da fonte de dados e prontidão (ex: synthetic, real_pending).

## 3. O que o módulo não faz
- Não converte o Blueprint em uma Drizzle Migration.
- Não salva formulários reais usando as APIs de backend do Next.js.
- Não atualiza o banco local ou remoto de configurações.
- Não gera código fonte para o projeto (sem CodeGen real).
- Não tem funcionalidade Drag-and-Drop complexa persistida.

## 4. Personas
- UX Architect
- Process Analyst

## 5. Entidades mínimas (Conceituais / Typescript Interfaces)
- FormBlueprint
- FormSection
- FormField
- FormFieldType
- FormFieldValidation
- FormLayoutRule
- FormBinding
- FormPreviewState
- FormGovernanceWarning
- FormReadinessStatus
- FormVersionDraft

## 6. Telas/seções mínimas
- Blueprint List (Lista Lateral)
- Form Canvas (Área Central de montagem)
- Field Palette (Lista de tipos de campos que poderiam ser adicionados)
- Field Detail (Propriedades visuais do campo - Label, Placeholder, Required)
- Validation Rules (Configurações de mínimo/máximo, regex)
- Layout Sections (Agrupamentos lógicos do Formulário)
- Preview Panel (Test Drive do form)
- Binding Panel (Mapeamento do Campo x Capability)
- Governance Warnings (Alertas de PII e segurança)
- Readiness Checklist (Status atual de validação e aprovação do form)

## 7. Fluxo de uso
1. UX Architect abre o módulo e vê o aviso de "Mock Mode".
2. Seleciona o blueprint "Technical Service Intake Form — Synthetic".
3. Visualiza o Canvas listando "Device Type", "Issue Description", "Date of Purchase".
4. Clica em "Issue Description" e o painel de propriedades (`Field Detail`) é ativado, exibindo informações.
5. Transita para a aba "Preview", vendo a formatação final de um textarea ou input correspondente.

## 8. Dados estáticos permitidos
Apenas um arquivo TS (`form-builder-data.ts`) exportando um objeto massivo cobrindo Blueprints sintéticos para os cenários solicitados (Technical Service, Clinic Appointment, Workshop Repair).

## 9. Dados reais futuros
No futuro, a UI enviará uma representação JSON completa do schema (`FormBlueprint`) via POST request para um Server Action que acionará o gerador de runtime, atualizará o banco de dados e poderá inclusive gerar componentes React automatizados.

## 10. Regras de schema
Um campo (`FormField`) pertence a uma seção (`FormSection`). Ele possui tipo (`FormFieldType`) e status.

## 11. Regras de validação
Campos mockados exporão quais validações estão contidas (`required`, `min_length`, etc.).

## 12. Regras de layout
Visualização puramente linear por seções lógicas.

## 13. Regras de binding com process/capability
A interface mostrará a qual `Process Step` ou `Capability` o campo se vincula (ex: `Issue Description` amarrado ao campo descritivo da capability `work_orders`).

## 14. Gaps conhecidos
Não haverá validação em tempo de digitação no painel "Preview" se for complexa. O Mock deve focar no Layout arquitetural e disposição da informação. Ações como arrastar campos (`Drag and Drop`) podem ser simuladas ou omitidas se aumentarem exageradamente a complexidade técnica desta fase puramente documental/mock.

## 15. Critérios de aceite
- O Builder Studio de forms renderiza corretamente.
- A navegação entre blueprints no painel lateral atualiza o canvas.
- A mudança de abas do menu de propriedades funciona.
- O modo "Preview" gera um render visual condizente com os campos.

## 16. Próximas tasks
- DEV-READINESS-FORM-BUILDER-001
- DEV-FORM-BUILDER-001
