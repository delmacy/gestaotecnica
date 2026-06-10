# Capability Explorer - Regras de Interação e Simulação

Durante a fase atual da plataforma, o System Builder opera usando mock data para acelerar o desenvolvimento do Core independente das fontes reais da Gestão Técnica. Por isso, as interações no Capability Explorer possuem regras estritas de simulação.

## Interações Permitidas

O usuário poderá interagir com a interface realizando:
- **Buscar** capability textual (por nome ou slug).
- **Filtrar** por categoria (foundation, work-management, etc.).
- **Filtrar** por prioridade MVP (critical, high, medium, etc.).
- **Filtrar** por status (documented, future, etc.).
- **Selecionar** um card de capability para abrir.
- **Abrir painel de detalhe** e explorar informações descritivas.
- **Visualizar dependências** (depends_on).
- **Visualizar uso invertido** (used_by).
- **Visualizar links** para documentos markdown estruturais.
- **Simular "Request Install"** (solicitação de instalação).
- **Limpar filtros** e estados de busca aplicados.

## Regras Obrigatórias de Restrição

Para garantir que a UI se mantenha fiel ao seu escopo isolado no estágio atual do projeto, as seguintes regras são inegociáveis:

1. **Instalação estritamente simulada:** A ação "Request Install" ou "Habilitar Capability" não altera o banco de dados. Ela atualiza apenas o estado transiente (client-side ou memória local) para `simulated_requested`.
2. **Sem impacto no Workspace real:** O tenant/workspace real não deve receber tabelas ou privilégios de roteamento (runtime) derivados desta ação.
3. **Bloqueio de itens inativos:** Capabilities marcadas com os status `future` ou `blocked` não podem receber sequer solicitações simuladas de instalação (o botão de request deve ficar disabled/oculto).
4. **Alerta de Dependências:** Caso o usuário solicite a instalação simulada de uma capability que possua dependências não atendidas/instaladas (ex: requisitar `work_orders` quando `people` não está ativo), o painel deve exibir um aviso explícito da pendência e sugerir a instalação da base.
5. **Agnosticismo à Gestão Técnica:** A "Gestão Técnica" é o cliente/piloto futuro e não deve aparecer listada como se fosse uma capability em si. Capabilities devem permanecer universais (`work_orders`, `requests`, etc).
6. **Grupo D Isolado:** As capabilities específicas de atendimento setorial do Grupo D (relacionadas ao cliente real em aprovação, como Gestão Técnica) não devem aparecer como "prontas" (`documented` ou superior) caso ainda estejam aguardando validacões pendentes (fontes reais). Devem refletir o status de `blocked` ou `needs_review`.
7. **Isolamento de Dados de Cliente:** Sob nenhuma circunstância nomes, dados operacionais ou PIIs reais de clientes piloto podem vazar nos cards, dependências ou descrições simuladas do Explorer.
8. **Client-side Only para Mutations:** As mudanças de estado (instalar, filtrar) feitas no Capability Explorer devem permanecer no client-side. Server Actions reais para salvar intenções em banco de dados estão proibidas nesta tarefa.
