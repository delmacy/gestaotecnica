# Estratégia de Banco de Dados

## 1. Banco unificado

O System Builder utiliza o banco PostgreSQL `tec_db`, organizado por schemas
explícitos para preservar as fronteiras entre plataforma e operação.

### Por que unificar agora?

1. **Consistência transacional:** Process Candidates aprovados podem ser
   publicados em Workflow Definitions atomicamente.
2. **Operação simples:** migrations, backups e testes usam uma única conexão.
3. **Separação preservada:** schemas continuam delimitando Platform e Runtime.
4. **Evolução gradual:** separação física futura só será adotada quando houver
   necessidade comprovada e estratégia de consistência distribuída.

## 2. Configuração

```text
DATABASE_URL=postgresql://.../tec_db
PLATFORM_DATABASE_URL=postgresql://.../tec_db
RUNTIME_DATABASE_URL=postgresql://.../tec_db
```

Preparação e validação:

```text
npm run db:setup:unified-test
npm run test:integration
```

## 3. Isolamento

- `workspace_id` permanece obrigatório em dados operacionais.
- RLS poderá ser adotado futuramente.
- Tabelas devem permanecer no schema correspondente ao seu domínio.

## 4. MinIO e armazenamento

Arquivos não são armazenados no PostgreSQL. O banco mantém metadados e
referências; o MinIO mantém os blobs.
