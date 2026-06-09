# Platform vs Client: System Builder

Este documento descreve a relação conceitual e técnica entre a plataforma core e as aplicações/blueprints construídos sobre ela.

## 1. System Builder (A Fábrica)
O System Builder é o motor e a ferramenta de construção. Ele é agnóstico em relação ao domínio de negócio específico.

**Responsabilidades:**
- Registry de Módulos e Capacidades.
- Engine de Workflow (Execução de Processos).
- Definição de Blueprints.
- Metamodelo de Dados (Schemas dinâmicos).
- Marketplace de soluções reutilizáveis.

## 2. Gestão Técnica (O Produto)
A "Gestão Técnica" (ou Operações Técnicas) é o primeiro **Blueprint** aplicado da plataforma. É uma configuração específica de módulos e processos voltada para a gestão de ativos, ordens de serviço e força de trabalho.

**Responsabilidades:**
- Instâncias de Ativos.
- Execução de Ordens de Serviço reais.
- Dados de usuários operacionais.
- Documentos técnicos gerados.

## 3. Regra de Ouro
**Nunca transforme a Gestão Técnica na plataforma.**

Se uma funcionalidade for genérica o suficiente para ser usada em outros contextos (ex: aprovações, notificações, anexos), ela deve pertencer à **Plataforma (Platform/Core)**. Se for específica de manutenção e ativos, pertence ao **Blueprint/Aplicação (Runtime/Client)**.
