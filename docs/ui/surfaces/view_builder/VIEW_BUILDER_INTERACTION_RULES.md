# View Builder Interaction Rules

Este documento define estritamente quais interações o usuário (Persona: System Builder) pode realizar na interface mockada do View Builder, e quais ações estão proibidas.

## Interações Permitidas

- Selecionar blueprint na lista lateral.
- Selecionar e alterar (simulado em memória) o view type.
- Selecionar campo/coluna nas propriedades.
- Alternar entre as abas do painel: preview, fields, filters, sorting, actions, bindings, governance.
- Filtrar os campos exibidos por tipo no painel.
- Simular ativação/desativação (toggle) local de coluna no preview.
- Simular se um campo é sortable/filterable/groupable localmente.
- Visualizar filtros configurados mockados.
- Visualizar sort/group rules configurados mockados.
- Visualizar bindings configurados mockados.
- Visualizar warnings estáticos de governance.
- Limpar seleção (reset state local do painel).

## Interações Proibidas

Qualquer interação que acione processamento no servidor, escrita em disco ou runtime.

- Salvar view real.
- Editar Markdown real via botão/interface.
- Persistir alteração de propriedades no banco.
- Gravar ou atualizar qualquer tabela no PostgreSQL.
- Consultar banco (ex: buscar lista real de capabilities).
- Chamar API ou server actions.
- Gerar migration via código gerado.
- Gerar rota real ou arquivos Next.js.
- Gerar componente real.
- Executar view real injetando dados do sistema operacional.
- Exportar dados reais (CSV/Excel).
- Upload ou download real de arquivos.
- Coletar PII do usuário real ou do gestor.
- Criar workflow real.
- Instalar capability no projeto.
- Alterar workspace configurado no back-end.
- Ações que visem desbloquear a execução do runtime.
- Ações que visem desbloquear dados do Grupo D (Gestão Técnica).
