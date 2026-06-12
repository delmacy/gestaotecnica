# View Builder Visual Model

## 1. Objetivo visual
O objetivo é fornecer uma experiência "Studio" que reforce a natureza de "builder" da plataforma, mantendo o padrão visual do `Form Builder`, mas focado nas capacidades de visualização (views). O ambiente tem de transmitir imediatamente que não é uma UI de runtime e sim um design canvas, reforçado pelo uso de alertas e badges "mock/static".

## 2. Layout recomendado
Layout de Studio Típico.
- Barra superior de ferramentas (Topbar com status).
- Painel esquerdo (Lista de itens / Blueprints).
- Área central larga (Canvas / Preview da View).
- Painel direito (Propriedades e configurações).

## 3. Áreas da tela
1. **Header da superfície**: Titulo, abas primárias e estado mock/static.
2. **Left Sidebar (Blueprint List)**: Lista os blueprints estáticos carregados.
3. **Right Sidebar (Propriedades)**: Configurações como View Type, Fields, Columns, Filters, Actions, Bindings.
4. **Main Canvas (Preview)**: A pré-visualização real da montagem sendo configurada.

## 4. Lista de blueprints
A lista na lateral esquerda, pesquisável textualmente pelo nome do blueprint, permitindo pular rapidamente entre os blueprints estáticos disponíveis.

## 5. View type selector
Um dropdown ou painel de ícones para alternar o modo base do Blueprint em foco (ex: mudar de 'Table' para 'Kanban' simulando o comportamento se for suportado pelo blueprint).

## 6. Canvas da view
Uma zona cinza ou neutra que exibe renderizações estáticas da visão selecionada (e.g., uma tabela desenhada na tela, mas vazia de rows operacionais, ou populada apenas para display visual mínimo).

## 7. Painel de campos/colunas
Na sidebar direita, em uma tab `Fields`, uma lista draggable ou alternável (switches) para habilitar/desabilitar as colunas/campos no preview simulado da view no canvas central.

## 8. Painel de filtros
Tab para simular a adição e remoção de restrições globais ou do utilizador ao blueprint.

## 9. Painel de sorting/grouping
Tab controlando agrupamentos (ex: Group by Status) e critérios de ordenação padrão de cada blueprint.

## 10. Preview da view
Já englobado no *Canvas da view*, mas pode conter também placeholders demonstrando estados como carregamento ou ausência de registros mockados.

## 11. Binding com form/process/capability
Tab `Bindings` no painel de propriedades revelando os mapeamentos de dados dessa view para seus process steps geradores.

## 12. Warnings de governance
Painel de sumário com as notificações relativas ao design (ex: "Sem restrição de scope detectada").

## 13. Readiness/status
Badge principal que alerta se o schema subjacente está 'mock', 'draft' ou 'ready'.

## 14. Badges de origem de dados
Badges atreladas aos campos indicando se a origem do campo é um schema mockado ou sintético.

## 15. Badges de status
Badges para mostrar estados como 'mock_ready', 'future_runtime', no cabeçalho ou ao lado dos nomes dos blueprints.

## 16. Limites do MVP
- O arrastar (drag and drop) de colunas não será persistido.
- A navegação em listagens profundas é desativada.
- O canvas preview será de fidelidade estrutural, não renderizando widgets reativos complexos de fato, mas usando divs para representar tabelas, cards, etc.
- Tudo será estático / cliente e não gravará state no PostgreSQL.

## Modelo visual recomendado
- Header da superfície
- Aviso `Design-only / Mock Mode`
- Lista lateral de view blueprints
- Área central com preview/canvas da view
- Palette de campos/colunas
- Painel lateral de propriedades
- Tabs: Preview, Fields, Filters, Sorting, Actions, Bindings, Governance
- Bloco de aviso: “This builder does not persist, query or generate runtime views in this phase”
