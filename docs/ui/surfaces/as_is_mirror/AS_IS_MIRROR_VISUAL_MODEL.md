# As-Is Mirror Visual Model

## 1. Objetivo visual
Criar uma interface clara, informativa e estruturada que permita ao usuário compreender o processo atual (As-Is) mapeado e todas as suas nuances (gaps, incertezas, candidatos), diferenciando claramente esta visualização de um workflow operacional executável.

## 2. Layout recomendado
- O layout usará a estrutura do `Builder Shell`, aproveitando a sidebar de navegação.
- Superfície dividida em 3 colunas ou seções principais:
  1. Barra lateral/esquerdar: Lista de processos espelhados (`Process Mirror List`).
  2. Área central: Mapa visual do processo (`Step Map`).
  3. Barra lateral/direita ou Painéis colapsáveis: Detalhes da etapa (`Step Detail Panel`).

## 3. Áreas da tela
- **Global Header (da surface):** Título, status global, e badge persistente de "Synthetic Demo / Not Runtime Workflow".
- **Filtros e Controles:** Opções para filtrar visualmente gaps, riscos, status de validação.
- **Área principal de mapa:** Área ampla para exibir os `cards` de processo interligados.

## 4. Lista de processos espelhados
- Uma lista contendo o título do mirror, status (ex: `synthetic_only`, `needs_real_validation`), e a fonte associada.

## 5. Mapa de etapas
- Visualização linear (vertical ou horizontal) das etapas (Steps).
- Cards simples conectados por setas/linhas.
- Os cards devem exibir: nome da etapa, tipo (ex: `intake`, `decision`), e ícones/badges para gaps, riscos ou evidências associadas.

## 6. Painel de detalhe da etapa
- Ao clicar em um card de etapa, o painel exibe todas as informações daquela etapa, separadas por abas ou seções expansíveis.

## 7. Handoffs
- Seção no detalhe da etapa exibindo de quem para quem a ação passa (`AsIsHandoff`), com os papéis envolvidos.

## 8. Inputs/outputs
- Listagem de dados de entrada necessários para a etapa e saídas geradas por ela.

## 9. Sistemas/documentos
- Lista de sistemas (ex: ERP legado, Planilha) e documentos (ex: PDF de OS, Foto) tocados na etapa.

## 10. Evidências vinculadas
- Exibição de artefatos que comprovam a etapa (ex: simulação de anexos, links textuais simulados).

## 11. Gap overlay
- Visualização em destaque no mapa e detalhes caso existam problemas associados à etapa.

## 12. Riscos/incertezas
- Exibição visual de níveis de confiança (`low`, `high`, `conflicting`) com ícones ou cores (ex: vermelho/amarelo para low/conflicting).

## 13. Capability candidates
- Tags/Labels sugerindo quais capacidades do builder (ex: "forms", "approvals") podem cobrir a necessidade da etapa no futuro.

## 14. Status de validação
- Em evidência no header do processo e nas etapas.

## 15. Badges de origem de dados
- Indicação clara se os dados são `mock`, `synthetic`, `real_pending`, `real_blocked`.

## 16. Badges de confiança
- Níveis de confiabilidade na informação (High, Medium, Low, Unknown).

## 17. Limites do MVP
- Sem renderização em canvas complexo (React Flow etc) inicialmente, podendo ser cards sequenciais flexbox simples para priorizar os dados e regras sobre a interatividade gráfica complexa.
- Apenas interações de click simples para abrir detalhes. Nenhum drag'n'drop nesta fase.
