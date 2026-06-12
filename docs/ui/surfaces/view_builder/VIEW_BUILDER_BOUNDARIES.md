# View Builder Boundaries

Este documento estabelece as regras estritas de limite arquitetônico (boundaries) para a superfície View Builder.

## View Builder (Escopo desta Fase)

O View Builder **DEVE**:
- Desenhar views mockadas visualmente.
- Organizar campos, colunas, filtros, sorting, grouping e preview em memória cliente.
- Preparar schema estático futuro (definição do que uma view vai precisar quando o runtime nascer).
- Relacionar (visualmente/via schema) views com forms, capabilities e process steps.

O View Builder **NÃO DEVE**:
- Salvar view real no banco.
- Gerar rota real para o builder ou runtime via código gerado.
- Gerar componente React real e gravá-lo no sistema de arquivos.
- Gerar query SQL real.
- Consultar banco de dados.
- Chamar API ou Server Actions que alterem estado do servidor.
- Executar view real com dados de produção/banco.
- Criar workflow/steps reais.
- Instalar capability em um Workspace.
- Alterar workspace real (usar o default estático/mockado).
- Desbloquear runtime.
- Desbloquear Grupo D do desenvolvimento.

## Relações com Outras Superfícies

### Form Builder
- O Form Builder define formulários e campos (também operando como design-only).
- O Form Builder pode alimentar (via mock predefinido) os campos disponíveis para o View Builder selecionar ao construir uma view do tipo tabela ou detail.

### Workflow Builder
- Superfície futura para montar fluxos e automatizações.
- **Não deve** ser implementada, tocada ou integrada ativamente nesta fase. O View Builder pode apenas citar que se conecta a um passo no esquema mock.

### Registry View
- O Registry View lista capabilities e módulos.
- Não substitui e nem é substituído pelo View Builder. Eles coexistem; o Registry View exibe dados, enquanto o View Builder desenha o formato de exibição.
