# View Builder MVP Plan

## 1. Objetivo do MVP
Criar e implementar uma superfície de `View Builder`, integrada ao Builder Shell, para montar views mockadas a partir de static schemas locais. O foco está em desenhar e simular o contrato visual sem invocar qualquer operação runtime, de banco de dados ou persistência.

## 2. O que o módulo faz
- Lista view blueprints pré-definidos (mock/synthetic).
- Permite selecionar um blueprint.
- Visualiza propriedades da view (tipo, campos exibidos, filtros, ordenação, agrupamento).
- Simula a montagem e configuração da visualização da view.
- Exibe o preview de uma view.
- Exibe binds com form, process, e capability.
- Mostra alertas (governance warnings) e readiness status.
- Simula localmente alterações de layout, tipo, propriedades visíveis dos campos etc.

## 3. O que o módulo não faz
- Não persiste/salva views reais no banco.
- Não gera componentes físicos ou rotas na aplicação em runtime.
- Não consulta dados operacionais.
- Não instala capabilities reais ou aciona server actions.
- Não altera workspaces reais.

## 4. Personas
- System Builder / Platform Architect.

## 5. Entidades mínimas
- ViewBlueprint
- ViewType
- ViewField
- ViewColumn
- ViewFilter
- ViewSortRule
- ViewGroupRule
- ViewAction
- ViewLayoutRule
- ViewBinding
- ViewPreviewState
- ViewGovernanceWarning
- ViewReadinessStatus
- ViewVersionDraft

## 6. Telas/seções mínimas
- Blueprint List
- View Type Selector
- View Canvas
- Field/Column Palette
- Filter Builder
- Sorting/Grouping Panel
- Action Panel
- Preview Panel
- Binding Panel
- Governance Warnings
- Readiness Checklist

## 7. Fluxo de uso
1. Usuário acessa `/builder/view-builder`.
2. Vê lista de blueprints (mockados) à esquerda.
3. Clica em um blueprint.
4. Painéis da direita e do centro são populados (Fields, Filters, Preview).
5. Interage (simulação) com os campos para esconder/exibir colunas ou mudar o view type.
6. A view do canvas/preview reage imediatamente baseado no estado simulado do client side.
7. Vê o aviso contínuo que nenhuma destas configurações está persistindo.

## 8. Dados estáticos permitidos
Schemas hardcoded nas classes do frontend, limitados aos casos sintéticos de MVP definidos.

## 9. Dados reais futuros
Metadados da infraestrutura builder real salvos no PostgreSQL via API, consumindo definições de processo do DB.

## 10. Regras de view schema
A estrutura tem de respeitar um format fixo para o mock renderizar corretamente os diferentes view types (Table, Kanban, etc).

## 11. Regras de filtros
Filtros são arrays de restrições mockadas (`text_contains`, `equals`, etc).

## 12. Regras de sorting/grouping
Arrays determinando se a view suporta e quais campos estão predeterminados para sort e group.

## 13. Regras de layout
Propriedades de tela como largura, visibilidade de certas badges etc.

## 14. Regras de binding com form/process/capability
Os binds existem para mapear de onde a view está a ler as origens primárias de dados (capabilities e step actions).

## 15. Gaps conhecidos
Como não há persistência, um refresh apaga o estado da simulação interativa atual da tela. Não há dados operativos preenchendo a tabela (apenas o modelo mockado indicando colunas, sem linhas reais completas dependendo da simulação de preview).

## 16. Critérios de aceite
- Todos os painéis abrem.
- Visualização estática do mock ativada corretamente.
- Sem requisições falhando ou penduradas.
- Mensagem indicando mock presente.

## 17. Próximas tasks
- Desenvolver os componentes React design-only para suportar esse plan.
