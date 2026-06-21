# System Builder - Architecture Snapshot

Este documento fornece um retrato estático (snapshot) da arquitetura atual do **System Builder** no repositório `delmacy/gestaotecnica`. Ele descreve as camadas operacionais, os módulos mapeados, as superfícies de código, as ferramentas de verificação, os limites entre a plataforma e o cliente, além de elencar os riscos de escopo atuais. O projeto rege-se pelos princípios definidos em `docs/PROJECT_MANIFEST.md`, `docs/ARCHITECTURE.md` e `docs/GLOBAL_WORK_BOARD.md`.

**Nota Importante:** Este documento relata a estrutura baseada nas fundações e nas intenções de arquitetura descritas na documentação principal. Nenhuma declaração de prontidão de produto (product readiness) deve ser inferida daqui sem a evidência empírica apropriada por meio de testes automatizados completos e sucesso operacional validado.

---

## 1. Camadas Operacionais

Conforme estabelecido pela decisão central de arquitetura (DEC-SB-001) e o Manifesto do Projeto (`docs/PROJECT_MANIFEST.md`), o escopo divide-se nas seguintes três camadas:

### 1.1 System Builder Platform
A plataforma estrutural e o **foco imediato do desenvolvimento**.
Trata-se de uma fundação tecnológica para construir sistemas empresariais a partir do trabalho real sem estar atrelada a uma organização específica ou processos engessados predefinidos. Esta camada inclui fluxos de espelhamento, governança, módulos do núcleo de permissões e as ferramentas de UI.

### 1.2 Demo Sintética
Trata-se de um facilitador e exemplo interno. A **Demo Sintética** usa dados fictícios ou gerados (SIMULATED_OBSERVATION) com a finalidade primária de permitir que os agentes desenvolvam e demonstrem os módulos da plataforma, eliminando a necessidade de bloquear o desenvolvimento por causa de dependências com fontes de dados reais ou aprovações do cliente em um ambiente de produção.

### 1.3 Cliente Piloto (Gestão Técnica)
É a aplicação prática da plataforma dentro de uma instância real da Gestão Técnica. Funciona como o futuro **cliente piloto**, mas foi arquitetada com limites estritos para garantir que as especificidades organizacionais deste cliente não afetem os blocos universais (System Builder Platform) que compõem o sistema. O espelhamento será guiado por dados reais, porém isolado em seu próprio domínio de infraestrutura.

---

## 2. Mapeamento de Módulos (docs/ARCHITECTURE.md)

Os blocos estruturais que compõem a solução estão organizados para garantir coesão em seus domínios e independência arquitetônica:

*   **`doc`**: Governança da documentação (padrões e decisões da arquitetura).
*   **`tasker`**: Coordenador do trabalho de agentes autônomos por meio de tasks executáveis.
*   **`process_mirroring`**: Responsável pelo espelhamento do trabalho e processo real da organização.
*   **`capabilities`**: Define as entidades e contratos universais e genéricos, mapeando necessidades e não divisões departamentais.
*   **`enterprise_architecture`**: Estabelece mapas empresariais, conectando a organização.
*   **`governance`**: Define os limites da operação por meio de papéis e políticas.
*   **`enablement`**: Orienta as ações de operadores humanos com guias e materialização de instrução.
*   **`registry`**: Indexador que registra capabilities do catálogo e dependências.
*   **`ui`**: Concentra a superfície visível e os View Contracts.
*   **`workflow`**: Mantém as regras sobre os Process Contracts.
*   **`runtime`**: Motor de execução; só processa contratos de fato aprovados (Execution Contracts).
*   **`integrations`**: Define a comunicação e as fronteiras via Webhook / Signal Contracts (ex.: limites onde a plataforma dialoga com n8n).
*   **`core`**: Base compartilhada sobre o System Builder, definindo os Contratos Centrais e workspace identity.

### 2.1 Relação Modular Geral
O fluxo obedece ao princípio de compreensão e extração estrutural:
> Observed Work -> Process Mirror -> Capability Match -> Enterprise Map -> Adapted Process -> Builder Contract

---

## 3. Superfícies de Código e Estrutura do Repositório

O repositório principal contém o trabalho fundamental dividido por diretórios essenciais:

*   **`src/app`**: Front-end principal gerido através do Next.js. Nele, encontramos rotas principais focadas na Gestão Técnica e rotas especializadas para Builder (`admin`, `auth`, `builder`).
*   **`src/db`**: Diretório central do banco de dados (Drizzle ORM), declarando os esquemas unificados (`schema.ts`), interações de domínio e arquivos de seed para configuração da base. O PostgreSQL continua sendo a principal "Source of Truth".
*   **`src/agent-work`**: Camada que opera as execuções contínuas, incluindo validação, gateways e integração via agente autônomo e provas operacionais (Operational Proofs).
*   **`src/scripts`**: Conjunto de scripts utilitários (ex: provisionamento de módulos de banco e verificação de gateways) fundamentais para manter a sanidade dos testes de integração sem exigir ferramentas manuais do usuário.

---

## 4. Testes e Workflows de Integração Contínua

Existem suites rigorosas para validar o ambiente de ponta a ponta:
*   **Testes de Unidade (`tests/unit/*`)**: Asseguram a solidez técnica de componentes como o "Trace Receipt Schema", contratos da plataforma e "UtilityAppDefinitionSchema" em isolamento estrito sem vazar dados.
*   **Testes de Integração (`tests/integration/*`)**: Testes executados diretamente sobre as peças modulares (e.g., `agent-work-flow.test.ts`, `agent-gateway-idempotency.integration.test.ts`).
*   **Testes E2E (`tests/e2e/*`)**: Suite operacional do Playwright validando cenários de usuário real (e.g., o "Builder Interactivity" ou a transição para Login em área autenticada).

O desenvolvimento é validado nos workflows `.github/workflows/`, como `agent-work-integration.yml` e `agent-work-governance.yml`, que cobrem e confirmam o estado estrutural das execuções sistêmicas e auditoria perante os repositórios administrativos externos.

---

## 5. Limites e Divisões Repositoriais

Para segregar a governança e autonomia dos fluxos automáticos, aplicam-se separações:
*   **Plataforma (System Builder)**: Agnosticismo total. Vive em `delmacy/gestaotecnica` e define a ontologia lógica.
*   **Cliente Piloto**: Dados operacionais hospedados localmente (`workspace-scoped`), mas com capacidades e integrações baseadas globalmente na plataforma.
*   **Operations Repo (`delmacy/system-builder-operations`)**: Funciona como o Centro de Engenharia e Controle da Plataforma, abrigando relatórios de infraestrutura autônoma, versionamento rigoroso de schemas locais e workflows CI/CD isolados (impedindo injection vulnerabilities no produto final). Nenhuma lógica de negócio reside no *Operations*.

---

## 6. Riscos de Escopo e Conclusão

*   **Produto Inacabado**: Módulos como o `runtime` ainda requerem amadurecimento substancial do motor de regra (Capabilities Matching + Policies). Existe risco de sobreposição de regras.
*   **Prova Operacional Não Terminada**: Muitas partes do sistema são suportadas hoje através do fluxo simulado (Demo Sintética). A migração sem atrito com dados reais exige mais atenção na infraestrutura do Gateway.
*   **Limitação do Agente Autônomo**: A verificação da prontidão final de Produto requer validações via e2e que em ambientes limpos exigem passos extras de configuração. Qualquer aprovação final requer supervisão explícita.
