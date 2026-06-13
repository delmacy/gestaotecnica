# Governance Matrix Visual Model

## Layout Recomendado

O layout principal será um estúdio que abriga a matriz e controles visuais.

- **Header:**
  - Título: "Governance Matrix Studio".
  - Aviso Visual: Um badge ou banner permanente escrito "Design-only / Not Enforced" e "Mock Mode".
  - Seletor de Blueprint: Lista de governance blueprints disponíveis (mockados).
- **Filtros e Controles Principais:**
  - Filtros para recursos, papéis, permissões (effects).
  - Barra para limpar filtros e comparar papéis.
- **Painel Central (A Matriz):**
  - **Linhas:** Representam Governance Resources e suas respectivas Actions.
  - **Colunas:** Representam Governance Roles.
  - **Células:** Representam a Governance Permission (o effect aplicável daquela role para aquela action). Um clique na célula seleciona a permissão detalhada.
- **Painel Lateral de Detalhes:**
  - Acionado ao selecionar uma permissão (célula), role ou recurso.
  - Abas (Tabs) do painel de detalhe:
    1. **Permission Detail:** Effect (allowed, denied, conditional, not_defined) com simulador de effect local.
    2. **Scope:** Detalhe sobre o escopo (global, workspace, etc.) com simulador de escopo local.
    3. **Approval Rules:** Regras exigidas caso o effect seja "approval_required".
    4. **Segregation of Duties (SoD):** Regras identificando funções que não podem ser combinadas.
    5. **Conflicts:** Conflitos detectados na matriz para o papel/recurso atual.
    6. **Bindings:** Vínculos com formulários, views e workflows (relacionado às ferramentas Builder).
    7. **Audit Expectations:** Dados esperados para registrar na trilha de auditoria para a ação.
    8. **Governance Warnings:** Avisos gerais e recomendações baseadas no perfil.
- **Comparação entre Papéis:**
  - View especial ou estado de filtro ativado que compara dois papéis lado a lado, realçando diferenças.
- **Resumo de Riscos:**
  - Um widget ou seção alertando sobre riscos de acesso excessivo ou falta de segregação.

*Este modelo é apenas representativo em client-side e não aplica alterações ao banco ou permissões.*
