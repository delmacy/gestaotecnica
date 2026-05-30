# Manual de Uso e Configuração - System Builder Platform

Este manual descreve como utilizar e configurar as capacidades fundamentais da System Builder Platform implementadas até a Fase 19.

## 1. Conceitos Fundamentais

A plataforma separa rigorosamente a **Fábrica** (Platform) do **Produto** (Runtime).

- **Platform:** Define as capacidades, módulos e blueprints (o "como fazer").
- **Runtime:** Executa a operação real, instâncias de processos, documentos e eventos (o "fazer").

---

## 2. Configuração de Banco de Dados

A plataforma suporta separação física de dados através de variáveis de ambiente:

- `PLATFORM_DATABASE_URL`: Conexão para o banco da fábrica.
- `RUNTIME_DATABASE_URL`: Conexão para o banco operacional do cliente.

Ambas possuem fallback para `DATABASE_URL` para facilitar o desenvolvimento local.

---

## 3. Gestão de Processos (Workflow Engine)

O coração da plataforma é o motor de workflow agnóstico localizado em `src/platform/workflow-engine/`.

### Como criar um processo:
Atualmente, a criação de processos é feita via metadados no banco de dados (schema `workflow`):
1. Defina um `process_definition`.
2. Crie uma `process_version` publicada.
3. Defina os `states` (estados) e `transitions` (transições).
4. Associe `actions` (ações) às transições.

### Execução:
Utilize o `WorkflowEngineService` para:
- `createInstance()`: Iniciar um novo processo.
- `executeAction()`: Disparar uma ação que pode mudar o estado ou atualizar o payload.

---

## 4. Formulários Dinâmicos

A plataforma permite coletar dados sem escrever código React específico para cada formulário.

### Componentes:
- **`DynamicFormRenderer`**: Recebe uma lista de campos e gera um formulário completo com validação Zod.
- **Campos Suportados:** `text`, `textarea`, `number`, `date`, `boolean`.

### Configuração:
Os campos são definidos na tabela `field_definitions` e agrupados em `forms` através de `form_fields`.

---

## 5. Memória Operacional e Evidências

### Armazenamento (Storage)
O `MinioStorageService` gerencia o upload de arquivos.
- **Regra:** O banco guarda o metadado (`storage.objects`) e o SHA-256; o MinIO guarda os bytes.
- **Configuração:** Ajuste as variáveis `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY` e `MINIO_SECRET_KEY`.

### Documentos
Arquivos tornam-se **Documentos** quando ganham contexto de negócio.
- **Rastreabilidade:** Todo documento versionado gera um `trace_receipt` com código de verificação único.

### Timeline
A `ProcessInstanceTimeline` é o componente visual que agrega todos os fatos:
- Mudanças de estado.
- Atualizações de dados.
- Documentos anexados.
- Notificações enviadas.

---

## 6. Notificações

Utilize o `NotificationService` para enviar alertas internos.
- As notificações podem ser genéricas ou vinculadas a uma instância específica de processo.
- Elas aparecem automaticamente na timeline operacional do processo vinculado.

---

## 7. Laboratório de Validação (Lab)

Para testar as capacidades sem interferir no sistema de Gestão Técnica, acesse:
`http://localhost:3000/admin/lab/workflow`

No Lab você pode:
1. Criar instâncias de teste.
2. Preencher formulários dinâmicos.
3. Executar ações e ver a mudança de estado em tempo real.
4. Anexar evidências e enviar notificações.
5. Ver a timeline agregada.

---

## 8. Guia de Desenvolvimento

### Localização do Código:
- `src/platform/`: Core agnóstico da plataforma.
- `src/db/platform/schema/`: Schemas da fábrica.
- `src/db/runtime/schema/`: Schemas operacionais.
- `src/db/legacy/`: Código antigo da Gestão Técnica.

### Princípios:
1. **Follow the Process:** Espelhe a realidade operacional.
2. **Imutabilidade:** Eventos nunca são apagados.
3. **Multitenancy:** O `workspace_id` é obrigatório em todas as tabelas do Runtime.
