# Report: PKG-UTILITY-APP-AS-IS-INVENTORY-001

## Identificação
- **Package ID:** `PKG-UTILITY-APP-AS-IS-INVENTORY-001`
- **Módulo:** `utility-apps`
- **Status:** Documentation-only inventory complete

## Resumo do Trabalho
Foi realizado um mapeamento completo dos ativos arquiteturais no repositório `gestaotecnica` para sustentar a futura implementação de Utility Apps. O inventário foca em reuso de componentes de Builders (Form e View), Registry de Capabilities e infraestrutura de Traceability.

## Principais Ativos Reutilizáveis
- **Form Builder Schemas:** `FieldDefinitionSchema` e `ValidationRuleSchema` para I/O de utilitários.
- **View Builder Contracts:** `ViewBlueprint` para visualização de catálogos e tabelas.
- **Action Runner:** Infraestrutura de execução de lógica pura.
- **Traceability Module:** Hashing e auditoria determinística para proveniência de regras.
- **Registry:** Descoberta de capacidades via `ViewEngine`.

## Principais Lacunas
1. **Dataset Persistence:** Falta uma entidade e tabela dedicada para dados tabulares de referência (técnicos).
2. **Importação de Dados:** Ausência de parsers para CSV/Excel.
3. **Execution Sandbox:** Necessidade de isolar a execução de fórmulas de utilitários do motor de workflow.
4. **Studio Especializado:** Falta uma interface de editor para tabelas técnicas e matrizes de decisão.

## Sequência Recomendada (Roadmap)
1. `PKG-UTILITY-APP-CORE-CONTRACT-001`: Definição base.
2. `PKG-DATASET-DEFINITION-CONTRACT-001`: Estrutura de dados tabulares.
3. `PKG-FORMULA-DEFINITION-CONTRACT-001`: Padronização de expressões.
4. `PKG-DATASET-IMPORT-PORT-001`: Ingestão de arquivos externos.
5. `PKG-UTILITY-APP-EXECUTION-PORT-001`: Runtime de execução.

## Riscos Identificados
- **Performance:** Uso excessivo de JSONB para datasets volumosos.
- **Segurança:** Execução de lógica dinâmica exige sandboxing rigoroso.
- **Tipagem:** Inconsistência entre dados flexíveis de planilhas e contratos rígidos do sistema.

## Conclusão
O sistema possui uma base sólida de contratos de UI e infraestrutura de auditoria, permitindo que a implementação de Utility Apps seja feita como uma extensão natural da arquitetura atual, focando nos novos contratos de persistência de dados (Datasets) e lógica de execução.
