# Estratégia de Banco de Dados

Para garantir a integridade e evitar a contaminação de dados, o System Builder separa os dados estruturais da plataforma dos dados operacionais dos clientes.

## 1. Bases de Dados Separadas (Desenvolvimento)

- **`system_builder_dev`**: Guarda a plataforma, não a operação.
- **`gestao_tecnica_dev`**: Guarda a operação real do primeiro caso de uso.

### Por que separar?
1. **Evolução Independente:** Mudanças no metamodelo da plataforma não devem corromper dados operacionais sem uma migração controlada.
2. **Escalabilidade Multi-tenant:** Facilita a futura migração para um modelo onde cada cliente possui seu próprio banco de dados (Tenant Isolation).
3. **Segurança:** Isola configurações globais e registros de módulos de payloads sensíveis dos clientes.

## 2. Row Level Security (RLS)
Futuramente, utilizaremos RLS no PostgreSQL para garantir que um workspace nunca acesse dados de outro, mesmo que compartilhem o mesmo banco runtime.

## 3. MinIO e Armazenamento
Arquivos nunca são armazenados no PostgreSQL.
- O banco guarda metadados e referências.
- O MinIO guarda os blobs/bytes.
- Toda referência de arquivo deve conter o `workspace_id`.
