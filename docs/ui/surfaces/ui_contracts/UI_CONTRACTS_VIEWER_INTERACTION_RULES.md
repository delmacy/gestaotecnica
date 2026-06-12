# UI Contracts Viewer - Interaction Rules

## 1. Interações Permitidas
A interface do UI Contracts Viewer está restrita a manipulações efêmeras de estado no cliente (React State). O usuário pode:

- **Selecionar contrato:** Clicar num contrato da lista para abrir seus detalhes no painel principal.
- **Filtrar por grupo:** Usar toggle buttons (A, B, C, D) para restringir a lista a grupos específicos.
- **Filtrar por status:** Selecionar status de implementação (ex: `implemented`, `blocked`).
- **Buscar por nome, rota ou surface_id:** Digitar em um input text para refinar a lista ativa.
- **Visualizar campos obrigatórios:** Ler valores como purpose, persona, e scope sem edição.
- **Visualizar riscos:** Expandir accordion/painel sobre `frontend_risks`.
- **Visualizar evidências:** Expandir accordion/painel sobre `evidence_required`.
- **Visualizar related reviews / tasks:** Ler listas relacionadas (sem link ativo para rotas reais caso não exista).
- **Visualizar matriz de implementação:** Ver um grid ou visualização macro do estado de todos os contratos do sistema.
- **Copiar informações cruciais:** Clicar num ícone para copiar `route_candidate` ou `surface_id` para o clipboard.
- **Limpar filtros:** Botão para resetar busca e toggle buttons.

## 2. Interações Proibidas
Qualquer ação que mude o estado persistente do sistema é estritamente proibida e não deve possuir botões visíveis que enganem o usuário (ou, se possuírem, devem estar desabilitados globalmente ou não fazer nada):

- **Editar contrato:** Sem formulários ativos.
- **Salvar mudança:** Nenhum botão 'Save'.
- **Gravar banco:** Sem chamadas mutantes.
- **Chamar API:** Sem requisições de rede.
- **Gerar componente:** Botões estilo 'Generate React' não devem existir ou devem estar escondidos.
- **Gerar rota real:** Idem.
- **Ler filesystem real em runtime:** A lista e busca funcionam sobre o Array JSON injetado, não um `fs.readFileSync()`.
- **Editar Markdown:** Não usar Editores de Markdown integrados.
- **Alterar workspace:** Ação irrelevante no contexto do detalhe do contrato.
- **Instalar capability:** Ação irrelevante.
- **Desbloquear Grupo D:** Não forçar `implementation_status` para `ready_for_dev` se estiver como `blocked`.
