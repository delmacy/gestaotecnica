# Docs Viewer Visual Model

## 1. Objetivo Visual
Fornecer uma interface clara, estruturada e de fácil navegação para o catálogo de documentos em modo read-only. A visão deve transparecer que a interface utiliza um índice estático simulado, não sendo capaz de editar ou salvar arquivos reais.

## 2. Layout Recomendado
O layout baseia-se num design do tipo master-detail dentro do padrão estabelecido pelo `Builder Shell`.

- **Header da superfície:** Título da página, breadcrumbs, e aviso explícito de modo read-only/mock.
- **Área principal dividida:**
  - Lado esquerdo: Filtros e listagem em formato de lista ou grid de cards.
  - Lado direito (ou modal lateral): Painel de detalhe focado no documento selecionado.

## 3. Áreas da Tela

1. **Header / Top Bar (Específica do Docs Viewer)**
   - Título: Docs Viewer
   - Bloco de aviso permanente: "Docs Viewer is read-only and uses static mock index"

2. **Painel de Busca e Filtros (Topo ou Esquerda)**
   - Input de busca textual (Título, Slug, Path).
   - Filtros dropdown ou selectores para Categorias, Módulos e Status.
   - Botão para limpar filtros.

3. **Lista/Cards de Documentos (Centro)**
   - Exibição dos itens em cards ou lista.
   - Cada item deve mostrar Título, Resumo, Badges de Categoria e Status.

4. **Painel de Detalhe (Lateral Direita ou Overlay)**
   - Título completo e Slug.
   - Badges consolidados (Categoria, Fase, Status).
   - Resumo longo do documento.
   - Seção de "Source Path" (caminho relativo no repositório).
   - Seção de "Links Relacionados" (Documentos e Tarefas do Tasker).
   - Aviso de "Read Only".

## 4. Categorias Documentais
As categorias devem ser identificadas visualmente com badges de cores e/ou ícones distintos. Exemplos: `manifest`, `architecture`, `ui_contract`, `tasker`, etc.

## 5. Busca
Input simples que filtra instantaneamente (client-side mock logic) por atributos textuais como `title`, `slug`, `source_path`.

## 6. Filtros
Filtros por dropdown permitindo seleção múltipla ou simples para `categoria`, `módulo` e `status`.

## 7. Lista/Cards de Documentos
O card deve possuir um título proeminente, um excerpt e badges curtos. Clicar no card abre o Painel de Detalhe.

## 8. Painel de Detalhe
Deve ter visualização focada nos metadados do documento. O painel deve deixar evidente que não é um editor de Markdown.

## 9. Seção de Links Relacionados
Lista ou tags clicáveis referenciando slugs ou IDs de outros documentos / tasks, embora inicialmente a ação possa ser apenas visual.

## 10. Seção de Status Documental
Exibição do status de desenvolvimento ou prontidão do doc.

## 11. Badges de Categoria
Elementos visuais chave para distinção rápida (ex: cor azul para arquitetura, cor verde para UI contracts).

## 12. Badges de Fase
Elementos indicando a fase de vida do artefato relacionado ao doc (ex: planning, development, review).

## 13. Limites do MVP
- Nenhuma renderização complexa de conteúdo de Markdown (como um parse completo visual) – O Viewer exibe "Metadados" e o caminho para o arquivo (`source_path`).
- Todos os dados são derivados do mock estático, sem requests dinâmicos ao filesystem real no client-side.