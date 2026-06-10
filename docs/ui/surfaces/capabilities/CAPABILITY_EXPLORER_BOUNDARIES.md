# Fronteiras entre Capability Explorer e Registry View

A arquitetura do System Builder separa estritamente a "descoberta e simulação" (Capability Explorer) da "gestão técnica e contratos formais" (Registry View). Este documento esclarece esses limites.

## Capability Explorer

O **Capability Explorer** é a vitrine amigável.
- **Propósito:** Superfície de navegação, descoberta, busca, entendimento arquitetural e simulação de intenção de uso.
- **Público (Persona):** Usuário da plataforma (Platform Admin, Workspace Admin, Product Manager) focado em entender quais capacidades de negócio o System Builder pode oferecer ao seu workspace.
- **Funcionalidades Permitidas:**
  - Mostrar catálogo de capacidades.
  - Mostrar dependências arquiteturais (o que precisa do que).
  - Exibir resumos e links para documentações operacionais.
  - Simular uma solicitação de "Instalação" ou "Habilitação" (Request Install) para um workspace.

### O que o Capability Explorer NÃO DEVE fazer:
- **NÃO DEVE** editar ou alterar o registry global de capabilities.
- **NÃO DEVE** versionar (criar novas versões semânticas) uma capability.
- **NÃO DEVE** publicar uma capability recém-desenvolvida.
- **NÃO DEVE** realizar a instalação real de uma capability no runtime.
- **NÃO DEVE** criar tabelas de banco de dados ou rodar migrations reais.
- **NÃO DEVE** criar rotas de API ou gerar módulos de código-fonte dinamicamente.
- **NÃO DEVE** alterar configurações reais e persistentes de um tenant (workspace).

## Registry View (Escopo Futuro)

A **Registry View** (não incluída nesta task) é o painel de engenharia sob o capô.
- **Propósito:** Superfície futura para visualizar o índice técnico canônico, gerenciar o ciclo de vida, versionamento de pacotes e metadados formais do registry (semelhante ao npm registry ou portal de APIs).
- **Público (Persona):** Capability Architect, System Builder Devs.
- **Diferença Principal:** O Registry View lida com o *contrato técnico* (ex: versão 1.0.2 requer Drizzle Schema X, emite eventos Y, possui dependências de pacote Z), enquanto o Explorer lida com o *contrato de negócio/produto* (ex: O módulo de "Work Orders" depende de "People" para funcionar).

O Capability Explorer **NÃO É** a mesma coisa que a Registry View e não deve herdar suas responsabilidades técnicas.
