# Form Builder - Visual Model

## 1. Objetivo visual
Fornecer uma interface de "Studio de Criação" imersiva e limpa, dividida em colunas funcionais, permitindo ao Architect analisar as configurações granulares do formulário (bindings, validações e governance) e testar a visualização.

## 2. Layout recomendado
Layout focado em produtividade. Semelhante a IDEs ou construtores de site.
- A aplicação usa a Topbar e Sidebar do Builder Shell.
- O container do "Form Builder" utilizará flexbox com 3 ou 4 colunas verticais ou abas de navegação claras para não afogar a tela de informações.

## 3. Áreas da tela
1. **Left Panel:** Lista de `Form Blueprints`.
2. **Center Panel (The Canvas/Preview):** A representação visual das seções e dos campos que pertencem ao Blueprint selecionado.
3. **Right Panel (Properties/Inspector):** As abas com os detalhes da estrutura (Field Palette para adicionar novos campos, Field Settings do campo selecionado).

## 4. Lista de blueprints
Menu lateral simples com os formulários disponíveis para "edição". Deve exibir as tags de "Synthetic" ou "Mock".

## 5. Field palette
Uma aba no painel direito listando componentes de UI arrastáveis/clicáveis (Short Text, Paragraph, Dropdown, Date Picker, etc).

## 6. Canvas do formulário
A área central onde os campos são listados sequencialmente. Ao clicar num campo, ele ganha destaque visual e abre suas configurações no painel direito.

## 7. Painel de detalhe do campo
Exibe, para o campo ativo:
- Label
- Placeholder
- Required (Toggle visual)
- Field Key (Nome interno na base de dados)

## 8. Painel de validação
Exibe as regras aplicadas ao campo ativo (ex: `min_length: 10`, `Regex: [a-z]`).

## 9. Preview do formulário
Uma aba no Canvas Central (alternando entre `Design` e `Preview`) que renderiza os componentes finais simulando a tela que o usuário final ou técnico verá.

## 10. Binding com process/capability
Uma aba na área de propriedades que mostra a qual `Process Step` ou `Capability` este campo alimenta os dados. Ex: "Este campo alimenta o payload da Request de Criação da OS".

## 11. Warnings de governance
Painel global ou atrelado a campos sensíveis, disparando avisos vermelhos/amarelos para detecção de PII.

## 12. Readiness/status
Pílulas de status no header do Canvas detalhando se o Blueprint está `ready_for_demo`, `needs_real_sources`, etc.

## 13. Badges de origem de dados
Marcadores de cores vivas no header avisando "Data Source: Synthetic Mock".

## 14. Badges de status
Avisos "Not Runtime Form" ou "Read-only in Phase 1".

## 15. Limites do MVP
- O Mock não precisa implementar bibliotecas de Drag and Drop (DnD) complexas como `@hello-pangea/dnd` ou `react-beautiful-dnd` nesta fase se o custo for alto. Apenas clicar para simular seleção é aceitável.
- As mudanças feitas no painel direito (ex: trocar Label) devem refletir no Canvas usando `useState` nativo do React, mas a aba "Salvar Formulário" será ignorada (no-op).
- A submissão na aba de Preview não envia dados, apenas limpa os inputs ou mostra um log visual no console simulado no client.
