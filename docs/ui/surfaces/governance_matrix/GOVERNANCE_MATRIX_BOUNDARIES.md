# Governance Matrix Boundaries

## O que a Governance Matrix É

- Modela contratos de governança.
- Visualiza permissões futuras.
- Visualiza conflitos e segregação (SoD).
- Relaciona papéis (roles) com recursos (resources) de forma puramente teórica e design-only.

## O que a Governance Matrix NÃO É (Limites Proibidos)

A Governance Matrix **não aplica autorização real**.

A implementação desta interface **NÃO DEVE**:
- Alterar o arquivo `src/modules/auth/access-profiles.ts` ou funções como `canAccessRoute`.
- Alterar o fluxo de login ou sessões.
- Alterar usuários reais no banco de dados.
- Aplicar permissão, criar roles reais, ou gravar *grants* no banco.
- Alterar o banco de dados (schema, migrations, SQL).
- Modificar proxy ou middleware para bloquear rotas baseadas nestas configurações estáticas.
- Desbloquear o módulo de "Gestão Técnica" (Grupo D), que deve permanecer estritamente bloqueado.

## Relação com Access Profiles Existentes

Os perfis de acesso existentes (`builder`, `admin`, `operador`) podem ser representados como referências estáticas na Governance Matrix, mas **não devem ser modificados**. Eles operam independentemente do modo mock da Governance Matrix.
