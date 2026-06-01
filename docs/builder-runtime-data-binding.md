# Builder Runtime Data Binding

## Capacidade organizacional
O Builder representa a capacidade de compor, auditar e publicar uma arquitetura operacional a partir do System Builder. A tela deve refletir o metamodelo real da plataforma, não uma demonstração fixa.

## Processo suportado
O arquiteto navega por organizações, workspaces, capacidades instaladas, processos, automações, telas e entidades. Cada nó vem das tabelas operacionais ou do registry da plataforma, permitindo ativar uma capability em um workspace real e publicar esse workspace.

## Rastreabilidade
As leituras usam os bancos separados da plataforma/runtime. Instalações de capabilities persistem em `workspace_module_configs`; processos e flows vêm do schema `workflow`; entidades vêm do schema `workspace`; capabilities disponíveis vêm do schema `registry`. A timeline usa eventos e execuções reais do workspace selecionado.
