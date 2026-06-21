# Fronteira de Repositórios: Plataforma, Cliente e Operações

Este documento estabelece a fronteira operacional arquitetural (arquitetura-alvo) entre o core da plataforma System Builder, os repositórios de clientes e o repositório de operações. Ele também mapeia o **estado atual** da separação e define critérios para decisões futuras.

## 0. Estado Atual vs Arquitetura-Alvo

**Estado Atual Observável:**
Atualmente, o repositório `delmacy/gestaotecnica` concentra tanto as superfícies da plataforma (System Builder) quanto as do futuro cliente piloto (Gestão Técnica) em uma base de código unificada. A separação física em repositórios distintos para o cliente ainda não ocorreu.

**Arquitetura-Alvo Proposta:**
O modelo futuro visa isolar o core da plataforma de domínios específicos de clientes e delegar controles de infraestrutura ao repositório de operações. A extração para repositórios de clientes e a plena consolidação deste modelo são decisões futuras que dependem de aprovação formal de governança.

---

## 1. Separação de Responsabilidades (Diretrizes Propostas)

O que idealmente pertencerá a cada domínio na arquitetura-alvo:

### Core da Plataforma (System Builder)
- **O que é:** O motor universal de capabilities e workflows.
- **O que pertence:** Contratos de dados (schemas, validações), motores de execução de workflows, sistema de governança, sistema de integração de componentes visuais, gerenciamento de eventos e APIs agnósticas a domínios específicos de clientes.
- **Exclusões:** Regras de negócio estritas de um único cliente, telas customizadas de um cliente que não são reaproveitáveis, ou workflows hardcoded de um domínio específico.

### Repositórios de Cliente (Ex: Gestão Técnica - Futuro Piloto)
- **O que é:** Aplicações de negócio que consomem e se constroem em cima das fundações da plataforma.
- **O que pertence:** Implementações específicas de fluxos de domínio, telas exclusivas de regras de negócio próprias, configurações e integrações com serviços proprietários, orquestrações de regras do cliente.
- **Nota sobre o Gestão Técnica:** O Gestão Técnica é visto conceitualmente como um **cliente piloto futuro** que testará e validará a eficácia do System Builder. Ele não deve atuar como bloqueador para o desenvolvimento do core da plataforma.

### Operations Repo (Repositório de Operações)
- **O que é:** O painel de controle e automação da infraestrutura e engenharia.
- **O que pertence (Proposto):** Automações de CI/CD (workflows do GitHub Actions reutilizáveis), ferramentas e scripts de governança operacional, definições de infraestrutura como código (IaC), manifestos de release e telemetria da frota, além de contratos de segurança e políticas do ciclo de vida dos repositórios.

---

## 2. Prevenção de Mistura: Customização de Cliente vs. Contratos Universais

Para evitar misturar customizações específicas com os componentes da plataforma, propõe-se as seguintes diretrizes:

1. **Design Baseado em Interfaces:** Idealmente, toda funcionalidade desenvolvida no core deve ser criada visando uma interface genérica. Clientes não injetariam código no core, mas forneceriam configurações ou payloads respeitando as interfaces.
2. **Camada de Adaptação (Client Boundary):** Clientes conectar-se-ão ao core da plataforma por meio de APIs expostas e contratos agnósticos.
3. **Mecanismos de Extensão (Propostos):** Customizações de interface visual ou processamento que só interessam a um cliente devem viver como extensões. Padrões como "Utility Apps", plugins hospedados fora do core e integrações via "Action Bindings" são diretrizes propostas (ainda não totalmente comprovadas ou isoladas).

---

## 3. Fluxo de Capabilities: Do Design ao Código (Diretriz Proposta)

Como uma *capability* deve idealmente evoluir para ser reutilizável:
1. **Identificação da Necessidade:** Uma necessidade é documentada como caso de uso.
2. **Design First & Markdown Primeiro:** O conceito é estruturado em Markdown, focando nos casos de uso genéricos.
3. **Contrato (Schemas/JSON):** Propõe-se que a estrutura de dados necessária seja transformada em esquemas JSON rigorosos de contrato de dados antes da implementação estrita de código TypeScript.
4. **Implementação de Código Plataforma:** O contrato é implementado de forma segura no core da plataforma com os devidos testes agnósticos.
5. **Adoção pelo Cliente:** O repositório cliente passa a consumir as novas interfaces do core.

---

## 4. Riscos de Acoplamento Observados

Sem uma fronteira bem definida em código (como é o estado atual parcialmente unificado), surgem riscos que a arquitetura-alvo busca mitigar:
- **Engessamento da Plataforma:** Desenvolver o core visando uma única regra de negócio (ex: hardcoding regras do Gestão Técnica) impossibilitará a integração de novos clientes no futuro sem refatorações sistêmicas.
- **Dívida Técnica Circular:** Se mudanças no core obrigam o cliente a atualizar e mudanças no cliente obrigam o core a se adaptar simultaneamente no mesmo deploy, o ciclo de vida torna-se frágil e não escalável.
- **Falha em Isolamento e Segurança:** Vazamentos de domínios específicos para dentro do core impedem que o System Builder seja confiavelmente operado multitenant.

---

## 5. Critérios para a Extração Futura de Repositórios Clientes

A decisão de criar e separar fisicamente um novo repositório de cliente (incluindo a separação do piloto Gestão Técnica da base da plataforma) não é imediata. A extração física depende de decisão formal de governança e será baseada na maturidade dos seguintes critérios:

1. **Identidade Própria do Domínio:** O cliente já possui regras de negócio ricas, fluxos de workflow próprios e UI pesadamente customizada que não seria aproveitada de forma genérica.
2. **Estabilidade de Contratos do Core:** O System Builder deve provar possuir contratos e APIs maduros (como Schemas Zod consolidados, Graph de workflows e Gestão de Eventos) o suficiente para suportar clientes atuando como dependências puramente externas.
3. **Escalabilidade de Ciclo de Vida:** Quando assimetrias operacionais justificarem a separação (ex: quando o cliente necessitar de frequência de deployments muito superior ao ciclo de release estável e versionado semanalmente da plataforma core).

*Nota: As afirmações deste documento refletem os princípios propostos e a direção pretendida. O que está demarcado como arquitetura-alvo ou diretriz proposta representa uma capacidade a ser comprovada, testada e gradualmente separada, e não necessariamente o estado material isolado de hoje.*
