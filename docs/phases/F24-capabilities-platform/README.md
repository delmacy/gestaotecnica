# F24 — Universal Capabilities Platform

Status: `planned`

## Objetivo

Consolidar o registry e transformar capabilities universais em pacotes instaláveis, versionáveis e reutilizáveis por workspace.

## Resultado de produto

O Builder descobre uma capability, verifica dependências, instala uma versão em um workspace e recebe módulos, contratos e navegação coerentes sem acoplamento ao cliente.

## Escopo incluído

- registry de capabilities;
- manifests e dependências;
- instalação, ativação, desativação e versão;
- capabilities prioritárias de organização, pessoas, clientes, requests, cases, work, scheduling, inventory/assets, documents/approvals/audit;
- frontend parity e evidência de instalação.

## Fora de escopo

- reimplementar módulos já funcionais sem inventário;
- marketplace comercial externo;
- federação e distribuição remota de packages;
- customizações específicas do System Trading ou Gestão Técnica dentro do core universal.

## Dependências e gates

- F22 validada;
- contratos de Process Mirroring suficientes para relacionar processos e capabilities;
- inventário do registry, manifests e módulos existentes;
- política de versão, rollback e compatibilidade.

## Definição de pronto

Uma capability versionada pode ser instalada em dois workspaces distintos, com dependências, permissões, rotas e dados isolados, e pode ser desativada ou atualizada com impacto explícito.
