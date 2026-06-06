# Builder Control Plane UI

O Builder deixará de ser apenas uma tela de desenho (React Flow) para se tornar um verdadeiro Control Plane operacional, inspirado em interfaces densas e administrativas (Paperclip-like, Linear, etc.), mas **sem depender do Paperclip**.

## Componentes Chave
1. **Sidebar Fixa:** Navegação principal do sistema (Workspaces, Processos, Candidatos, Configurações).
2. **Breadcrumb:** Localização contextual rápida.
3. **Listas Densas:** Visualização em tabela/lista de processos e candidatos, com badges de status e filtros rápidos.
4. **Properties Panel (Inspector):** Contexto sempre à direita baseado no que está selecionado, seja um nó do fluxo ou as propriedades de um Process Candidate.
5. **Timeline de Atividade:** Histórico de auditoria, eventos do runtime e discussões de revisão.
