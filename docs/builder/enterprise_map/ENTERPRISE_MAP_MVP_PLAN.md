# Enterprise Map MVP Plan

## 1. Objetivo
Criar uma superfície visual (design-only, mock/static) para representar domínios organizacionais, capabilities, processos e outros componentes corporativos de forma sintética.

## 2. Visão Process-Driven
A visualização reflete o princípio "The principle is the process. Follow the process". Não parte de departamentos, mas mostra processos atravessando áreas e capabilities servindo processos.

## 3. Personas
Platform Admin, Enterprise Architect, Workspace Admin.

## 4. Escopo
Interface com seletor de blueprint, camadas/perspectivas, canvas de grafo visual, filtros e painéis de detalhes.

## 5. Fora de Escopo
Arquitetura real de cliente, persistência, API real, RBAC, workspaces reais, n8n, webhooks, dados reais.

## 6. Entidades
Blueprint, Layer, Node, Relationship. Tipos: Domain, Capability, Process, Value Stream, System, etc.

## 7. Camadas
- Process View
- Capability View
- Value Stream View
- Systems View
- Data View
- People/Roles View
- Risk & Gap View
- Evidence View

## 8. Perspectivas
Filtros aplicados às camadas para alterar as visualizações no canvas.

## 9. Relações
Conexões entre Nodes (contains, supports, executes, etc.).

## 10. Filtros
Domain, Readiness, Data source mode, Node Type.

## 11. Navegação
Seleção de nodes, destaque de conexões, painel lateral detalhado.

## 12. Risks/Gaps
Visualização de riscos e gaps associados aos processos/sistemas.

## 13. Evidence
Anotações de evidência em modo estático.

## 14. Relações com Process Mirroring
Exibe evidências sintéticas de gaps e processos.

## 15-19. Relações com outras ferramentas (Capabilities, Form, View, Workflow, Governance)
O mapa interage com conceitos de form builder, workflow builder, e governance matrix de forma teórica.

## 20. Critérios de aceite
Renderização sem persistência, uso de biblioteca gráfica para canvas, painéis locais, navegação fluida em mock mode, ausência de dados reais.

## 21. Evolução para Workspace Real
A rota futuramente migrará para `/[workspace_id]/enterprise-map` quando possuir dados reais persistidos e RBAC.

## 22. Próximas Tasks
Implementar prontidão de desenvolvimento, e a interface.
