# Feature Contract — Fase X

## 1. Identificação

- Fase:
- Nome:
- Tipo: Backend / Frontend / Full-stack / Documental / Gate
- Dependências:
- Fase frontend vinculada:
- Status:

## Jules Agent Boundary

- Jules responsável (Jules <Role> <Domain> [Scope]):
- Domínio autorizado:
- Domínios proibidos:
- Arquivos permitidos:
- Arquivos proibidos:
- Pode paralelizar?
- Com quais agentes?
- Conflitos esperados:
- Regra de parada se tocar outro domínio (registre como gap e não implemente):

## 2. Objetivo

Descrever em 3 a 6 linhas o que será entregue.

## 3. Problema que resolve

Explicar qual lacuna do produto ou arquitetura a fase fecha.

## 4. Domínio / DDD

Campos obrigatórios (ver docs/planning/DDD_FEATURE_CONTRACT_ADDENDUM.md):

- Bounded Context:
- Ubiquitous Language:
- Aggregate/Entity principal:
- Value Objects:
- Invariantes:
- Domain Events:
- Application Use Case:
- Anti-Corruption Layer:
- Repository Port:
- Infrastructure Adapter:
- Transaction Boundary:
- Consistency/Idempotency:
- Workspace Scope:
- Audit/Trace:

## 5. Escopo permitido

Listar arquivos, módulos, schemas ou áreas que podem ser alterados.

## 6. Fora de escopo

Listar explicitamente o que NÃO pode ser feito.

## 7. Entidades e contratos

Quando houver backend/banco:

- Entidade:
- Schema:
- Campos:
- Tipos:
- Índices:
- Constraints:
- workspace_id:
- created_by:
- origin:
- status:
- audit fields:

## 8. Estados e transições

Quando houver workflow/status:

- Estados permitidos:
- Transições permitidas:
- Transições proibidas:
- Quem pode executar:
- O que acontece em erro:

## 9. Services, repositories e actions esperados

- Repository:
- Service:
- Server Action:
- API Route:
- Query:
- Adapter:

## 10. UI esperada

Quando houver frontend:

- Rota:
- Persona:
- Área autenticada:
- Componentes:
- Estado vazio:
- Loading:
- Erro:
- Sucesso:
- Permissões:
- Links/navegação:

## 11. Testes obrigatórios

- Unit:
- Integration:
- E2E:
- Build:
- Lint:
- git diff --check:

## 12. Frontend impact

- Área afetada:
- Rota(s):
- Usuário/persona:
- Workspace/global:
- Estados cobertos:
- Teste visual/E2E:
- Gap frontend pendente:

## 13. Critérios de aceite

Lista objetiva do que precisa estar verdadeiro.

## 14. Regra de parada

O ponto exato onde Jules Dev deve parar.

## 15. Prompt para Jules Dev

Prompt pronto, sem ambiguidade.

## 16. Prompt para Jules Tester

Prompt pronto, com comandos e critérios.

## 17. Riscos e decisões

- Riscos técnicos:
- Riscos de produto:
- Decisões tomadas:
- Gaps intencionais:
