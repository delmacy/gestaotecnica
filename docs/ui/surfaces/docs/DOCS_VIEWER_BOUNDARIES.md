# Docs Viewer Boundaries

O Docs Viewer atua no System Builder como uma camada de leitura para o catálogo documental em Markdown, não sendo responsável pela gestão técnica ativa, workflows ou indexação de capabilities real. Abaixo definimos claramente seus limites em relação a outras superfícies:

## Docs Viewer
- É uma visão **navegacional** e **read-only** de documentos.
- Mostra categorias, caminhos (`source_path`), resumos e links.
- Apoia a leitura e descoberta documental pela pessoa Builder Architect.
- **NÃO** edita Markdown.
- **NÃO** cria, deleta, publica ou versiona documentos.
- **NÃO** substitui o GitHub como fonte da verdade dos arquivos.

## Registry View
- É a visão **técnica** de metadados e contratos operacionais e de capabilities.
- O Registry View lida com dependências e o capability model.
- **NÃO** é um leitor geral de docs para outros assuntos (como arquitetura ou decisões).

## Tasker Board
- É a visão de tarefas, status do desenvolvimento e evidências de entrega.
- Pode apontar para documentos no Docs Viewer, mas **NÃO** é um viewer documental.

## Ações explicitamente proibidas ao Docs Viewer
- Substituir Registry View (não apresenta o grafo de capabilities).
- Substituir Tasker Board (não manipula status de tarefas).
- Executar workflow de capabilities ou runtime.
- Alterar workspace ou configurações de tenants reais.