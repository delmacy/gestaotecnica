# Modulo: Workflow Engine

## Configuracao

Workflows ficam em `workflow_templates` e podem ser editados em `/admin/workflows`.

Instancias em execucao ficam em `workflow_instances` e o historico auditavel de mudancas fica em `workflow_transitions`.

## Adaptacao por cliente

Configure estados, nomes, ordem, target do fluxo e regras futuras de transicao. O template e congelado em `snapshot` quando a instancia inicia, preservando o desenho usado naquele registro mesmo se o template for editado depois.

## Uso atual

Ordens de servico podem iniciar uma instancia de workflow configurada para `service_order`. A tela de detalhe da execucao exibe o painel de workflow, permite iniciar a instancia e avancar estados com nota.

## Evolucao futura

Adicionar transicoes permitidas, guardas por permissao, condicoes obrigatorias, aprovacao antes de avancar estado e sincronizacao automatica entre workflow e status operacional do modulo.
