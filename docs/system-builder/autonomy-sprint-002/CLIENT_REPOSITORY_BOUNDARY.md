# Fronteira de Repositórios: Plataforma, Cliente e Operações

Este documento estabelece a fronteira operacional entre o core da plataforma System Builder, os repositórios de clientes (utilizando o Gestão Técnica como cliente piloto futuro) e o repositório de operações.

## 1. Separação de Responsabilidades (O que pertence a cada lugar)

### Core da Plataforma (System Builder)
- **O que é:** O motor universal de capabilities e workflows.
- **O que pertence:** Contratos de dados (schemas, validações), motores de execução de workflows, sistema de governança, sistema de integração de componentes visuais, gerenciamento de eventos e APIs agnósticas a domínios específicos de clientes.
- **Exclusões:** Regras de negócio estritas de um único cliente, telas customizadas de um cliente que não são reaproveitáveis, ou workflows hardcoded de um domínio específico.

### Repositórios de Cliente (Ex: Gestão Técnica - Futuro Piloto)
- **O que é:** Aplicações de negócio que consomem e se constroem em cima das fundações da plataforma.
- **O que pertence:** Implementações específicas de fluxos de domínio, telas exclusivas de regras de negócio próprias, configurações e integrações com serviços proprietários, orquestrações de regras do cliente.
- **Importante:** O Gestão Técnica é visto como um **cliente piloto futuro** que testará e validará a eficácia do System Builder. Ele não atua como bloqueador para o desenvolvimento do core da plataforma.

### Operations Repo (Repositório de Operações)
- **O que é:** O painel de controle e automação da infraestrutura e engenharia.
- **O que pertence:** Automações de CI/CD (workflows do GitHub Actions reutilizáveis), ferramentas e scripts de governança operacional, definições de infraestrutura como código (IaC), manifestos de release e telemetria da frota, além de contratos de segurança e políticas do ciclo de vida dos repositórios.

## 2. Prevenção de Mistura: Customização de Cliente vs. Contratos Universais

Para evitar misturar customizações específicas com os componentes da plataforma:
1. **Design Baseado em Interfaces:** Toda funcionalidade desenvolvida no core deve ser criada visando uma interface genérica. Clientes não injetam código no core; eles fornecem configurações, payloads ou plugins respeitando as interfaces.
2. **Camada de Adaptação (Client Boundary):** Clientes devem se conectar ao core da plataforma por meio de APIs expostas e contratos (schemas definidos e controlados rigorosamente) que funcionem de maneira agnóstica.
3. **Mecanismo de Extensão:** Customizações de interface visual ou processamento que só interessam a um cliente devem viver como "Utility Apps" ou plugins hospedados fora do core, se comunicando com o System Builder através do padrão de "Action Bindings".

## 3. Fluxo de Capabilities: Do Design ao Código

Como uma *capability* evolui para ser reutilizável antes da implementação de código:
1. **Identificação da Necessidade:** Uma necessidade (mesmo originada do Gestão Técnica ou outro cliente piloto) é documentada como caso de uso.
2. **Design First & Markdown Primeiro:** O conceito é estruturado em Markdown, focando nos casos de uso genéricos sem olhar para regras estritas de domínio do cliente.
3. **Contrato (Schemas/JSON):** A estrutura de dados necessária e os eventos disparados são transformados em esquemas JSON (Contrato) antes de se tornarem código TypeScript.
4. **Implementação de Código Plataforma:** O contrato é implementado de forma segura no core da plataforma com os devidos testes agnósticos.
5. **Adoção pelo Cliente:** O repositório cliente passa a consumir ou fornecer dependências orientadas aos novos contratos.

## 4. Riscos de Acoplamento (Plataforma vs. Cliente)

Se a fronteira não for bem definida, surgem riscos de acoplamento perigosos:
- **Engessamento da Plataforma:** Desenvolver o core visando uma única regra de negócio (ex: hardcoding regras do Gestão Técnica) impossibilitará a integração de novos clientes no futuro sem grandes refatorações.
- **Dívida Técnica Circular:** Se mudanças no core obrigam o cliente a atualizar e mudanças no cliente obrigam o core a se adaptar simultaneamente, o ciclo de deploy torna-se frágil.
- **Falha em Isolamento e Segurança:** Vazamento de contratos de segurança e de negócio faz com que o System Builder não possa ser confiavelmente operado multitenant.

## 5. Critérios para a Extração de Repositórios Clientes

A decisão de criar e separar um novo repositório de cliente baseia-se na maturidade do isolamento. Os critérios para decidir isso (sem compromisso imediato de migração) são:
1. **Identidade Própria do Domínio:** O cliente possui regras de negócio ricas, fluxos de workflow próprios e UI pesadamente customizada que não seria aproveitada por outros inquilinos.
2. **Estabilidade de Contratos do Core:** O System Builder deve possuir contratos e APIs maduros (como Schemas Zod, Graph de workflows e Gestão de Eventos) o suficiente para que o cliente consiga operar como uma dependência externa.
3. **Escalabilidade de Ciclo de Vida:** Quando o tempo de build, a frequência de deployments e o modelo de governança operacional requerem separação (ex: o cliente precisa fazer deploy 10x ao dia enquanto o core da plataforma possui um ciclo de release estável e versionado semanalmente).

*Nota: Este documento estabelece diretrizes operacionais e arquiteturais, mas não atua como promessa de migração ou gatilho automático de criação de novos repositórios antes de uma decisão formal de governança.*
