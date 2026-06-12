# Form Builder - Boundaries

Este documento define os limites do Form Builder, separando-o de outras ferramentas do System Builder, de acordo com o plano Grupo B.

## Form Builder (Escopo Atual)
**O que é:** Uma superfície de "Studio" para estruturar e visualizar conceitualmente os formulários (Blueprints).
**Responsabilidades:**
- Desenha os formulários mockados usando metadados e schema estático.
- Organiza a exibição de seções, campos, regras de validação e layout em "Preview".
- Demonstra o relacionamento (bindings) com capabilities e process steps.
- Exibe o status e avisa sobre dependências reais não cumpridas (ex: falta de fontes da Gestão Técnica).

## Diferenciação

**Vs. View Builder (Futuro):**
- O View Builder montará interfaces de exibição (Tabelas de grid, painéis de detalhe interativos), não a coleta inicial de dados. Ele agrupa componentes de leitura e ações complexas. O Form Builder foca na injeção de dados. Não deve ser implementado agora.

**Vs. Workflow Builder (Futuro):**
- O Workflow Builder conectará os Forms e Views numa jornada (Nó A -> Nó B). Ele cuida de transições lógicas. O Form Builder não deve implementar roteamento de fluxos lógicos.

**Vs. Registry View (Existente):**
- O Registry View lista as Capabilities catalogadas (organização documental do sistema). O Form Builder se beneficia desse catálogo para fazer os "bindings", mas atua na camada de interface e coleta.

## Fronteiras Rigorosas (Proibições)
O Form Builder, nesta fase, **não deve**:
- Salvar o Blueprint no banco de dados.
- Gerar código-fonte de schemas do ORM (`drizzle/schema.ts`).
- Modificar o schema SQL.
- Executar formulários em ambiente "Runtime" de cliente.
- Realizar submissão de dados de formulário para backend.
- Gerar APIs de tratamento do form.
- Desbloquear a visualização real para a Gestão Técnica (pois violaria a necessidade de PII real/anonimização do Grupo D).
