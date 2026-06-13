# Governance Matrix Interaction Rules

## Interações Permitidas (Estritamente Local/Client-side)

- Selecionar uma matriz mockada.
- Selecionar um papel (role).
- Selecionar uma permissão (célula da matriz).
- Filtrar papéis.
- Filtrar recursos.
- Filtrar permissões por *effect*.
- Comparar dois papéis visualmente.
- Simular um *effect* local (mudando temporariamente a cor/estado de uma célula na UI).
- Simular um *scope* local.
- Visualizar abas de detalhes: conflitos, segregation rules, approval rules, bindings, audit expectations.
- Limpar filtros.

## Interações Proibidas

Nenhuma interação do usuário deve resultar em efeitos colaterais reais no backend. É estritamente proibido:

- Salvar permissão real (sem mutations de DB).
- Alterar usuário real ou `accessProfile`.
- Bloquear rota real baseada no estado da UI.
- Alterar a sessão do usuário ativo.
- Gravar no banco de dados.
- Chamar rotas de API (ex: `POST /api/...`).
- Gerar políticas (*policies*) reais.
- Alterar definições de workspace.
- Aplicar regras RBAC reais.
- Desbloquear engine de runtime.
- Desbloquear rotas restritas ao Grupo D.
