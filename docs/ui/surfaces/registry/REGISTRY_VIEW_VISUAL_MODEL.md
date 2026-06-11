# Registry View Visual Model

1. **Objetivo visual:** Prover uma interface clara, técnica e de fácil leitura para desenvolvedores e arquitetos consultarem o catálogo e as dependências do sistema.
2. **Layout recomendado:** Master-Detail (Lista/Tabela à esquerda ou acima, com painel de detalhes deslizante à direita).
3. **Áreas da tela:**
   - **Header da superfície:** Título, badge indicativo de "Read-Only" e "Mock Mode".
   - **Barra de Busca e Filtros:** Logo abaixo do header.
   - **Área principal (Lista/Grid):** Listagem dos itens do registry.
   - **Painel Lateral (Detail Panel):** Exibe as informações completas do item selecionado.
4. **Filtros:**
   - Por tipo de item (capability, dependency_rule, etc).
   - Por status (documented, ready_for_design, etc).
5. **Busca:** Textual por nome ou slug.
6. **Cards ou tabela:** Linhas limpas ou cards técnicos com ícones indicativos do tipo e badges de status.
7. **Painel de detalhe:**
   - Título, tipo, status e badge de risco.
   - Descrição e notas.
   - Fonte (Source Document).
8. **Seção de dependency rules:** Exibição clara de "Depends On" e "Used By".
9. **Seção de capability model:** Visualização ou links para modelos de entidades e processos associados.
10. **Seção de document links:** Links rápidos para a documentação raiz (Markdown).
11. **Badges de status:** Cores semânticas (ex: verde para ready, cinza para future, vermelho para blocked).
12. **Badges de risco:** Cores indicativas (verde para low, amarelo para medium, laranja para high, vermelho para critical).
13. **Limites do MVP:**
    - Renderização de grafos complexos fica para fases futuras.
    - Exibição focada em listas e metadados estruturados.
    - Totalmente baseado em Mock Data e Read-only.
