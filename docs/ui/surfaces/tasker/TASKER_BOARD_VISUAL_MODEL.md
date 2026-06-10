# Modelo Visual: Tasker Board

## 1. Objetivo Visual
Fornecer uma interface clara e focada em coordenação para o desenvolvimento do System Builder, permitindo que a equipe (humanos e agentes) acompanhe facilmente o status das tarefas, bloqueios e evidências. A interface deve priorizar dados textuais concisos e identificadores visuais rápidos sobre gráficos ou componentes complexos.

## 2. Layout Recomendado
- **Header:** Título da superfície ("Tasker Board"), métricas sumárias de sprint, e controles globais (busca simples, toggle Kanban/Lista).
- **Barra de Ferramentas (Toolbar):** Filtros aplicáveis rapidamente.
- **Área Principal:** Espaço flexível exibindo as colunas do Kanban ou uma tabela de lista.
- **Painel Lateral (Side Drawer / Slide-out):** Detalhamento de uma tarefa específica selecionada.

## 3. Colunas ou Agrupamentos (Kanban)
A visualização primária deve ser baseada nos status operacionais das tarefas:
1.  **Backlog**
2.  **Ready**
3.  **In Progress**
4.  **Review**
5.  **Done**
6.  **Blocked**
7.  **Cancelled** (opcional ou colapsada por padrão)

## 4. Filtros
- **Por Grupo:** Grupo A (Imediato), Grupo B (Design), Grupo C (Runtime), Grupo D (Cliente/Bloqueado).
- **Por Status:** Checkboxes para filtrar colunas/linhas específicas.
- **Por Módulo/Capability:** Ex: "UI", "Process Mirroring", "Capabilities".

## 5. Cards de Task
Cada card no Kanban deve conter informações vitais na visualização mínima:
- **ID:** (Ex: BUILDER-SHELL-001)
- **Título da Task**
- **Badges:** Prioridade, Grupo.
- **Agente Responsável:** Avatar ou nome/role.
- **Indicadores:** Ícone de bloqueio (se houver) e ícone de evidência anexada.

## 6. Painel de Detalhe (Task Detail Panel)
Ao clicar num card, abre-se um painel lateral contendo:
- Header com Título e ID.
- Botões de Transição Rápida (Ex: "Move to In Progress").
- **Resumo (Summary):** Descrição textual da tarefa.
- **Área de Dependências:** Listagem de `depends_on` e `blocked_by`.
- **Área de Evidências:** Listagem de links ou referências a artefatos (ex: `_REPORT.md`).
- **Agente Responsável:** Informação do owner da task.

## 7. Estados Visuais
- **Loading:** Skeletons nas colunas do Kanban.
- **Empty State (Geral):** Ilustração minimalista e mensagem "Backlog vazio."
- **Empty Column:** Área tracejada indicando "Arraste tarefas para cá" (mesmo que a transição seja simulada via clique na versão inicial).
- **Error:** Faixa (banner) indicando erro de leitura local.

## 8. Badges de Prioridade
- `Critical`: Vermelho vibrante
- `High`: Laranja ou Vermelho pálido
- `Medium`: Amarelo/Dourado
- `Low`: Cinza ou Azul claro

## 9. Badges de Grupo
- `Group A`: Verde (Liberado)
- `Group B`: Azul (Em planejamento)
- `Group C`: Roxo (Futuro)
- `Group D`: Vermelho/Cinza escuro (Bloqueado)

## 10. Badges de Bloqueio
- Ícone de "Cadeado" ou "Parada" nos cards.
- Fundo levemente hachurado se a tarefa inteira estiver na coluna "Blocked".

## 11. Evidência de Done
- Seção no Painel de Detalhes exibindo arquivos requeridos e fornecidos (links para Markdown).
- Exibição de um ícone "Check verde" no card quando evidências completas estão presentes.

## 12. Área de Dependências
- Bloco claro no painel, ligando visualmente a tarefa a outras (ex: "Bloqueia: XYZ-002").

## 13. Área de Agente Responsável
- Exibição da persona alocada (Ex: "Jules UI Dev"). Exigida visualmente para mover para `in_progress`.

## 14. Ações Disponíveis
- Visualização (Click no Card)
- Filtragem (Click na Toolbar)
- Transição de Status (Botões no detalhe da task ou Drag and Drop simulado no client-side)

## 15. Limites do MVP
- **Sem Drag-and-Drop obrigatório:** Botões de transição no painel de detalhe são suficientes.
- **Sem Backend Real:** Os dados serão mockados/estáticos. A persistência de mudanças será apenas client-state e resetada em refresh, sem editar arquivos `.md` verdadeiros via UI no momento.
- **Read-only de Arquivos:** As áreas de "Evidências" apenas mostrarão texto/nomes de arquivos referenciando as estruturas atuais, sem abrir/editar os conteúdos no primeiro momento.