# Registry View Boundaries

## Registry View

- **Propósito:** Visão técnica read-only.
- **Conteúdo:** Mostra metadados e contratos estruturados do sistema.
- **Dependências:** Mostra dependências formais (depends_on, used_by).
- **Rastreabilidade:** Mostra links documentais (source_document, document_links).
- **Público-alvo:** Apoia arquitetos, desenvolvedores do System Builder.

## Capability Explorer

- **Propósito:** Visão de produto.
- **Conteúdo:** Navegação amigável e exploratória das capabilities oferecidas.
- **Interação:** Simulação de request install.
- **Público-alvo:** Apoia o entendimento funcional por parte de usuários, administradores e PMs.

## Restrições do Registry View (O que NÃO deve fazer)

- Não edita registry.
- Não instala capability.
- Não versiona capability.
- Não cria migration.
- Não cria tabela de banco de dados.
- Não altera workspace.
- Não gera runtime (código ou n8n).
- Não substitui o Capability Explorer (são visões complementares, uma técnica e outra de produto).
