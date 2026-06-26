# Gaps do WorkforceModule

## WORKFORCE_DATABASE_PROVISIONING
Atualmente, o WorkforceModule utiliza a tabela `builder.process_candidates` como camada de persistência transitória para evitar alterações em migrations compartilhadas e schemas centrais.
Isso permite o isolamento por `workspaceId` e suporte a campos estendidos (competências, funções, etc.), mas não é a solução definitiva.
O modelo final exige tabelas Runtime próprias no schema `identity` ou um novo schema `workforce`.

## SCHEDULING_GAP
As seguintes funcionalidades não foram implementadas e dependem do módulo de Scheduling:
- Montagem de escalas e calendários operacionais.
- Gestão de regimes de 24 horas, sobreaviso ou plantão.
- Distribuição automática de tarefas baseada em capacidade.
- Cálculo de cobertura de equipe e alertas de conflitos.

## HUMAN_RESOURCES_DEPENDENCY
O Workforce consome dados básicos de trabalhadores, mas depende de um módulo de HR completo para:
- Gestão de contratos legais e CLT.
- Folha de pagamento e benefícios.
- Histórico de cargos e promoções.
- Avaliação de desempenho formal.
