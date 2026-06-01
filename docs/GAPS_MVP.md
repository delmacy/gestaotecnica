# GAPS MVP - SYSTEM BUILDER

## Crítico

*   **Entidades e Campos:** Não existem kernel actions ou tabelas para definir novas entidades (ex: "Cliente", "Chamado") e seus campos dinamicamente. Atualmente as entidades são hardcoded nos módulos.
*   **Relacionamentos:** Sem mecanismo para definir relações entre entidades via Builder.
*   **View Builder Runtime:** O View Builder salva o template (ex: "Kanban"), mas não existe um motor de renderização que consuma essa definição para gerar a tela real com dados.
*   **Isolamento de Dados (Dynamic CRUD):** Como não há entidades dinâmicas, não há um CRUD genérico que respeite o isolamento por tenant para dados não estruturados.
*   **Workflow Transitions (Automated):** O `WorkflowEngineService` não executa as transições automaticamente baseado no diagrama (está implementado o salvamento do diagrama, mas não a execução reativa dele).

## Importante

*   **Permissões Dinâmicas:** Definição de roles e permissões por módulo via Builder está incompleta.
*   **Validação de Campos:** Sem suporte para regras de validação nos campos definidos no Builder.
*   **Publicação de Módulos:** O conceito de "Instalar Capability" funciona, mas a criação de um módulo do zero ("Módulo Chamados") não é suportada.

## Desejável

*   **Preview de UI:** Botão de preview no View Builder não funciona.
*   **IA de Classificação:** O nó de AI no Flow Builder é apenas visual.
*   **Dashboards Reais:** O template de Analytics Dashboard não possui motor de agregação de dados.
