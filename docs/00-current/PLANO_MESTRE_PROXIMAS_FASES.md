# Plano Mestre de Próximas Fases - System Builder

Este documento fica preservado como resumo histórico das nove fases. A fonte canônica atual para planejamento comercial, sprints, percentuais de maturidade e conversão em tasks é:

- `docs/product-roadmap/COMMERCIAL_DELIVERY_PLAN.md`
- `docs/product-roadmap/MODULE_MATURITY_ASSESSMENT.md`
- `docs/product-roadmap/PROJECT_BREAKDOWN.md`
- `docs/product-roadmap/TASK_INDEX.md`

Em caso de conflito entre este arquivo e `docs/product-roadmap/*`, prevalece `docs/product-roadmap/*`.

## Atribuição de Papéis

- **Codex:** Líder / Revisor / Gatekeeper
- **Jules:** Executor Operacional Completo

## Estrutura de Fases

### Fase 1: Consolidação do Estado Real
- **Objetivo:** Estabelecer um diagnóstico preciso e reprodutível do repositório, garantindo que o ambiente e as ferramentas base funcionem de ponta a ponta sem degradação.
- **Ações Chave:** Verificação e correção de discrepâncias, elaboração do plano mestre, execução dos gates iniciais e auditoria dos recursos.

### Fase 2: Persistência
- **Objetivo:** Estabelecer a camada base e inquebrável de armazenamento de dados e modelos (schema) no banco de dados.
- **Ações Chave:** Criação, migração e validação de tabelas, assegurando aderência estrita às regras do Drizzle, relacionamentos e restrições estabelecidas na arquitetura do Postgres para separação Platform x Runtime.

### Fase 3: Vertical Mínimo
- **Objetivo:** Construir uma infraestrutura funcional "end-to-end" de uma única feature core, servindo como fundação para a arquitetura do projeto.
- **Ações Chave:** Implementar um fluxo de dados completo que conecte UI, API, regra de negócio e camada de banco de dados para validar a solidez do "esqueleto" do sistema, atestando o funcionamento da camada de adaptações e domínios.

### Fase 4: Actions / Workflow Engine
- **Objetivo:** Desenvolver o núcleo operacional de automações através do Action e Workflow Engine, permitindo a orquestração reativa do sistema.
- **Ações Chave:** Estruturar o registro de actions, validações rigorosas com Zod (ex: contratos de segurança JSON via PlatformKernel), engine de workflows assíncronos e tratativas de eventos.

### Fase 5: Gestão Técnica
- **Objetivo:** Estabelecer os contornos do primeiro cliente interno do System Builder, modelando o produto "Gestão Técnica".
- **Ações Chave:** Transformação do cliente em domínios concretos, implementando capabilities específicas, workflows restritos a esse cliente e definindo a governança técnica de sua operação, de acordo com o Client Repository Boundary.

### Fase 6: Blueprints
- **Objetivo:** Solidificar a capacidade do System Builder de gerar, manter e versionar "Blueprints" como moldes para outras aplicações.
- **Ações Chave:** Abstração dos componentes construídos na Fase 5 para modelos reutilizáveis (Blueprints), viabilizando rápida instanciação de regras e processos.

### Fase 7: Governança
- **Objetivo:** Expandir e aplicar controle fino sobre quem (e sob quais regras) pode interagir e gerir os componentes e dados do ecossistema.
- **Ações Chave:** Consolidar painéis de administração, logs auditáveis unificados, validações de arquitetura estritas e governança operacional e documental sobre processos.

### Fase 8: Integrações
- **Objetivo:** Integrar o System Builder com entidades e serviços externos via canais de entrada e saída, fortalecendo a conectividade.
- **Ações Chave:** Conexões com sistemas externos, manipulação de webhooks (como n8n) e suporte a provedores terceiros de identidade e envio de sinais.

### Fase 9: Produto Operável
- **Objetivo:** Concluir o ciclo para entrega da aplicação final, unindo todas as peças para uso em produção.
- **Ações Chave:** Validação end-to-end pesada, certificação da paridade Frontend/Backend, refinamentos de UI/UX e execução dos gates finais de qualidade.

---
> A Fase 1 estabelece apenas a organização e o diagnóstico, preparando a fundação para a implementação a partir da Fase 2.
