# Model routing policy

The task file decides the minimum agent tier.

## Tiers

- `simple`: documentation, focused refactors, tests, small UI fixes, one module, no schema or workflow changes.
- `standard`: multi-file implementation inside one bounded feature, moderate domain reasoning.
- `advanced`: database schemas, migrations, authentication, authorization, workflow engine, deployment or cross-module architecture.

## Default

Use `simple` unless the task explicitly justifies a higher tier.

## Hard blocks for simple agents

A simple agent must not modify:

- `.github/workflows/**`
- `src/db/**/schema/**`
- migration files
- authentication or authorization kernels
- deployment configuration
- more than the declared allowed paths

Simple tasks should target 1-4 files, have deterministic acceptance criteria, and provide exact validation commands.
