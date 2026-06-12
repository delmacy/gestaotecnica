# UI Contracts Viewer - Visual Model

## 1. Objetivo visual
Criar uma interface limpa, orientada a leitura, focada em apresentar a riqueza de dados dos contratos de UI (metadata pesada) de maneira organizada sem sobrecarregar cognitivamente o desenvolvedor. Deve ter clara aparência "Read-only".

## 2. Layout recomendado
Modelo Master-Detail (Lista à esquerda, painel de detalhes expansivo à direita). Usar a estrutura do `BuilderShell` (Topbar + Sidebar já existentes).

## 3. Áreas da tela
- **Topbar Interna:** Breadcrumbs, título ("UI Contracts Viewer"), botão fantasma para abrir filtros, e uma barra de pesquisa proeminente.
- **Aviso Banner:** "Read-only / Static Index" claramente posicionado abaixo da Topbar ou dentro dela (ex: Badge laranja ou amarelo).
- **Sidebar Interna (Contract List):** Lista dos contratos categorizados.
- **Main View (Panel Detail):** Onde as propriedades do contrato selecionado são renderizadas.
- **Tabs (Detail View):** Alternância entre "Contract Data" e "Implementation Matrix".

## 4. Lista de contratos
- Itens de lista contendo `surface_name`, pílulas de status (`implemented`, `blocked`, etc) e uma indicação visual do grupo (A, B, C, D).

## 5. Painel de detalhe
- Cabeçalho: Título grande, badge de surface_id ao lado do título, ícone "copy" para a route_candidate e surface_id.
- Grid de 2 colunas para "Purpose", "Persona", "Scope", "Workspace Status".
- Acordeões ou seções blocadas para arrays/dados ricos: Data Inputs, Data Outputs, Commands, Permissions.

## 6. Matriz de implementação
- Uma visão gráfica simples (pode ser uma grade de cards menores ou barras) mostrando todos os contratos agrupados, ilustrando o avanço da plataforma.

## 7. Filtros por grupo
- Botões de alternância rápida (Toggle Group): Grupo A (Platform Base), Grupo B (Design), Grupo C (Runtime), Grupo D (Client).

## 8. Filtros por status
- Select dropdown ou check boxes múltiplos (ex: "Mostrar apenas `implemented` ou `blocked`").

## 9. Busca textual
- Input de busca que filtra a lista instantaneamente pelo nome da superfície, rota (ex: `/builder/tasker`) ou surface_id.

## 10. Campos obrigatórios do contrato
Renderizar de forma imutável (textos simples, sem inputs de form):
- surface_id
- surface_name
- route_candidate
- implementation_status

## 11. Riscos e evidências
- Seção destacada (possivelmente com bordas ou fundo sutil de alerta) para exibir os `frontend_risks` e `evidence_required`.

## 12. Related reviews
- Uma lista em bullet-points, meramente indicativa visualmente, mostrando as tasks de review associadas àquele contrato.

## 13. Badges de grupo
- Cores distintas por grupo para facilitar mapeamento. Ex:
  - Grupo A: Azul
  - Grupo B: Roxo
  - Grupo C: Amarelo
  - Grupo D: Cinza/Vermelho (bloqueado)

## 14. Badges de implementação
- Cores de semáforo convencionais adaptadas: Verde (done), Azul claro (ready_for_dev), Cinza (documented), Laranja (blocked).

## 15. Limites do MVP
- Nenhuma das pílulas ou itens pode acionar modais de edição.
- Clicks em links de "Related Reviews" farão "no-op" ou copiarão o texto para a área de transferência, pois a integração nativa com o board real ou o github não está presente.
- Bloco de aviso fixo: "This viewer does not edit Markdown contracts".
