# Contrato de task executável

Toda task deve conter os campos abaixo antes de receber estado `ready`.

## Campos obrigatórios

```yaml
id: SB-XX-00
phase: F00-example
status: planned
kind: planning|development|review|test|migration|documentation
priority: critical|high|medium|low
owner_role: planner|implementer|reviewer|tester|integrator
summary: resultado observável em uma frase
depends_on: []
blocks: []
allowlist: []
denylist: []
acceptance_criteria: []
validation_commands: []
frontend_impact: none|documented|implementation_required
data_impact: none|schema|migration|backfill|runtime
security_impact: none|auth|authorization|tenant_isolation|secrets|audit
```

## Campos de execução

```yaml
base_sha: null
branch: null
pr: null
implementation_sha: null
merge_sha: null
evidence: []
blockers: []
```

## Critérios de qualidade

Uma task deve:

- produzir um resultado verificável;
- possuir escopo pequeno o suficiente para um PR isolado;
- declarar dependências reais;
- diferenciar entrega documental de entrega funcional;
- incluir teste ou justificar tecnicamente sua ausência;
- registrar impacto de frontend e segurança;
- não depender de contexto implícito na conversa com o agente.

## Anti-padrões

Não são tasks executáveis:

- “melhorar o sistema”;
- “corrigir segurança” sem superfície e ameaça definidas;
- “implementar módulo completo” em um único PR;
- lista de arquivos sem resultado de produto;
- task que mistura migration, várias features e refatoração não relacionada;
- task cujo aceite é apenas “build passa”.

## Exemplo

```yaml
id: SB-CR-09
phase: F21-platform-hardening
status: ready
kind: migration
priority: critical
owner_role: implementer
summary: aplicar isolamento no banco para tabelas operacionais críticas
depends_on: [SB-CR-08]
allowlist:
  - src/db/**
  - drizzle/**
  - tests/integration/**
  - docs/phases/F21-platform-hardening/**
denylist:
  - system-building/**
acceptance_criteria:
  - tenant A não lê nem altera linhas do tenant B
  - migrations são reversíveis e rastreáveis
  - conexões administrativas possuem bypass explicitamente controlado
validation_commands:
  - npm run typecheck
  - npm run test:integration
frontend_impact: documented
data_impact: migration
security_impact: tenant_isolation
```
