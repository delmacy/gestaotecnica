# Architecture

## Arquitetura Geral
O System Builder é uma plataforma baseada em módulos autônomos geridos por contratos bem estabelecidos em Markdown.

## Módulos Principais
- **core**: Base da aplicação, workspaces, projetos.
- **doc**: Módulo de documentação interna e regras.
- **tasker**: Gestão de tarefas, status e execuções.
- **ui**: Interface do usuário, telas, estados visuais.
- **workflow**: Definições de processos, etapas, execuções.
- **registry**: Catálogo de capacidades, módulos instaláveis.
- **integrations**: Contratos externos, n8n, webhooks.
- **runtime**: Execução de instâncias e eventos.

## Fluxo de Trabalho Conceitual
O trabalho flui do `tasker` para os módulos através de tarefas definidas. Mudanças visuais começam no `ui`, lógicas nos módulos específicos, sendo o `runtime` e o `core` os pilares finais.

## Dependências Permitidas
- Cada módulo deve depender o mínimo possível de outros.
- Contratos (API_CONTRACT, VIEW_CONTRACT, etc.) devem ser usados para comunicação intermodular.

## Dependências Proibidas
- É estritamente proibido criar dependências circulares entre módulos.
- Implementar lógicas em camadas inadequadas (ex: banco de dados avançado antes dos contratos definidos).
