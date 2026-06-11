# Docs Viewer Interaction Rules

## Interações Permitidas

- Buscar documento (via input de texto que processa o mock estático baseando-se em title, slug ou path).
- Filtrar por categoria.
- Filtrar por módulo.
- Filtrar por status.
- Selecionar um documento da lista/cards.
- Abrir detalhe do documento selecionado.
- Visualizar `source_path` no detalhe.
- Visualizar links para docs relacionados (visuais/tags).
- Visualizar links para tasks relacionadas (visuais/tags).
- Copiar path ou slug (ação de clipboard simples).
- Limpar filtros.

## Interações Proibidas

- Editar arquivo Markdown.
- Salvar mudança de documento.
- Deletar documento.
- Criar documento novo.
- Publicar documento.
- Versionar documento ou integrar com Git/GitHub.
- Alterar workspace real (ações de tenants/banco de dados).
- Criar ou rodar fluxos no Runtime (n8n, actions).
- Buscar filesystem real dinamicamente via backend em runtime.