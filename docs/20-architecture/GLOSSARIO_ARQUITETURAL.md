# Glossário Arquitetural do System Builder

## Workspace
Ambiente lógico onde processos, módulos, usuários, dados e configurações pertencem a um cliente, equipe ou organização.

## Organization
Agrupamento superior de workspaces. No MVP pode ser simplificado ou até existir apenas como estrutura futura.

## Module
Conjunto funcional de telas, entidades, regras e processos relacionados a uma área de negócio. Exemplos: Helpdesk, Workforce, Assets, Service Orders.

## Capability
Capacidade registrada na plataforma. Representa algo que o sistema sabe oferecer, como abrir ticket, gerar documento, enviar notificação ou criar ordem de serviço.

## Registry
Catálogo técnico e funcional da plataforma. Guarda capabilities, actions, events, entidades, tipos de campo, views e integrações disponíveis.

## Process Definition
Modelo abstrato de um processo. Define nós, conexões, regras, configurações e metadados.

## Process Version
Versão congelada de uma process definition. Uma instância de execução deve apontar para uma versão específica, para preservar histórico.

## Process Node
Bloco visual no canvas. Pode representar etapa humana, formulário, decisão, aprovação, documento, notificação, integração ou encerramento.

## Process Edge
Conexão entre dois nós. Representa transição, fluxo, condição ou caminho possível dentro do processo.

## Builder Draft
Estado editável de um processo enquanto está sendo construído. Pode não estar publicado nem disponível para execução.

## Published Process
Processo versionado, validado e pronto para ser instanciado no runtime.

## Runtime
Camada que executa processos publicados. Ela cria instâncias, avança etapas, registra dados e emite eventos.

## Process Instance
Execução real de um processo publicado. Exemplo: um ticket específico, uma ordem de serviço específica ou uma solicitação administrativa específica.

## Process Step
Registro de uma etapa executada ou pendente dentro de uma process instance.

## Event
Registro de algo relevante que aconteceu. Exemplo: process.started, step.completed, document.generated.

## Action
Operação executável registrada no sistema. Exemplo: ticket.create, notification.send, document.generate.

## Trace Receipt
Comprovante de rastreabilidade de uma ação ou etapa. Pode conter hash, autor, data, payload, entidade afetada e evento associado.

## View
Representação visual de dados ou processos. Exemplo: tabela, kanban, calendário, dashboard, detalhe, formulário.

## Form
Estrutura de entrada de dados composta por campos, validações e comportamento.

## Field
Unidade básica de entrada em um formulário. Exemplo: texto, número, data, seleção, usuário, arquivo, referência.

## Entity
Objeto de negócio persistente. Exemplo: ticket, ordem de serviço, ativo, técnico, escala, documento.

## Platform
Camada do System Builder responsável por definir, configurar, versionar e orquestrar módulos/processos.

## Runtime App
Aplicação ou área onde os processos e módulos criados no builder são usados pelos usuários finais.

## Legacy/Public
Parte antiga ou transitória do sistema que ainda existe no schema public ou em módulos anteriores. Deve ser isolada gradualmente.
