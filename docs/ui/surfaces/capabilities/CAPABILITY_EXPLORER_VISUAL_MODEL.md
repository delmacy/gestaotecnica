# Capability Explorer - Modelo Visual

## 1. Objetivo Visual
Fornecer uma interface clara e organizada para que o Platform Admin compreenda o ecossistema de capabilities, identifique rapidamente dependências estruturais e possa simular a solicitação de instalação dessas capacidades em workspaces, com distinção clara entre itens do MVP e expansões futuras.

## 2. Layout Recomendado
Um layout composto por uma visualização de grid de cards (para escaneabilidade rápida) com opção de alternar para lista. A área principal conterá os cards e uma barra lateral direita atuará como **Painel de Detalhe** para a capability selecionada.

## 3. Grid / Lista de Capabilities
- **Cards (Grid):** Devem conter o nome, ícone representativo, descrição curta, e os principais badges (categoria, status documental, prioridade MVP).
- **Lista (List View):** Exibição em formato de tabela para focar em status, dependências e cruzamento de informações.

## 4. Painel de Detalhe
Quando uma capability for selecionada, uma "drawer" ou painel lateral abrirá exibindo:
- Informações completas da capability.
- Entidades que ela "possui" (owns_entities) e entidades que ela "não possui" (does_not_own).
- Seções dedicadas para **Dependências** (`depends_on`) e **Uso** (`used_by`).
- Seção de fronteiras e riscos de sobreposição.
- Botão/Ação de "Simular Solicitação de Instalação".
- Links para os contratos documentais.

## 5. Filtros
Filtros devem ser persistentes no topo ou na barra lateral esquerda (se aplicável), permitindo a filtragem por:
- Categoria (ex: foundation, work-management, etc.).
- Prioridade MVP (ex: critical, high, medium, low, future).
- Status Documental (ex: documented, needs_review, blocked).

## 6. Busca
- Uma barra de busca textual (`input text`) com destaque (Hero ou Topbar específica do módulo) permitindo busca por nome ou slug.

## 7. Badges de Categoria
- Cores distintas para categorias (ex: foundation = cinza/base, work-management = azul, etc.) para fácil identificação visual.

## 8. Badges de Prioridade MVP
- Destacar capabilities "Core MVP" com badges especiais (ex: estrela ou borda de destaque) para evidenciar sua prioridade e importância inicial.

## 9. Badges de Status Documental
- Badges como `documented` (verde/sucesso), `needs_review` (amarelo/atenção), `blocked` (vermelho/erro) e `future` (cinza/inativo).

## 10. Badges de Dependência
- Alertas visuais (ícones de aviso ou links cruzados) nos cards ou painel caso a capability tenha dependências fortes (ex: `work_orders` avisando que precisa de `people`).

## 11. Relações com Outras Capabilities
- Links visuais no painel de detalhe permitindo navegar do "depends_on" diretamente para a capability citada.

## 12. Diferença entre Global Catalog e Workspace View
- **Global Catalog:** Foco total na arquitetura e documentação. Ações de instalação são secundárias.
- **Workspace View (Contexto Selecionado):** Deve exibir claramente o status de "Instalação" da capability para o tenant atual. O título ou subtítulo deve refletir o workspace ativo.

## 13. Ações Disponíveis
- Pesquisar capabilities.
- Filtrar capabilities.
- Abrir painel de detalhamento.
- Navegar para documentação externa.
- **Request Install:** Um botão de Call to Action (CTA) para simular o processo de habilitar a capability.

## 14. Limites do MVP
- **Aviso Obrigatório:** A interface deve ter um bloco de aviso ou banner explícito ("install request is simulated") alertando que o provisionamento real de banco de dados e rotas está inativo nesta fase.
- Não há progresso real de instalação a ser acompanhado em telas de loading; as interações são imediatas (simuladas em memória).
