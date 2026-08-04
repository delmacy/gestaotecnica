# System Builder — documentação canônica

Esta pasta é a fonte de verdade documental do System Builder.

## Ordem obrigatória de leitura

1. `current/STATUS.md` — estado verificável do produto.
2. `current/ROADMAP.md` — ordem das fases e gates.
3. `phases/<ID>/README.md` — contrato da fase ou sprint.
4. `phases/<ID>/TASKS.md` — catálogo de tasks da fase.
5. `phases/<ID>/PROGRESS.md` — implementação, merge, validação e bloqueios.
6. `agents/OPERATING_MODEL.md` — regras para execução por agentes.

## Estrutura

```text
docs/
├── current/                 # visão atual; pequena e sempre atualizada
│   ├── STATUS.md
│   ├── ROADMAP.md
│   └── DOCUMENTATION_MIGRATION.md
├── phases/                  # uma pasta por fase, sprint ou trilha executável
│   ├── F21-platform-hardening/
│   ├── F22-multi-tenant-workspace/
│   ├── F23-process-mirroring-engine/
│   ├── F24-capabilities-platform/
│   ├── F25-governance-rbac-security/
│   ├── F26-workflow-runtime-frontend/
│   ├── UX-NAV-03-operator-loop/
│   ├── UX-NAV-04-builder-identity/
│   └── ST-S01-system-trading-pilot/
├── agents/                  # contratos de trabalho de agentes
├── templates/               # modelos para novas fases, tasks e evidências
├── architecture/            # arquitetura estável e decisões estruturais
├── product/                 # visão, capacidades e experiência do produto
├── modules/                 # documentação por módulo reutilizável
├── operations/              # deploy, segurança, observabilidade e suporte
└── archive/                 # histórico; nunca é fonte de status atual
```

As pastas de domínio existentes (`capabilities/`, `process_mirroring/`, `runtime/`, `ui/` e semelhantes) permanecem válidas como conhecimento técnico. Elas não devem registrar o status global de execução.

## Fonte de verdade por assunto

| Pergunta | Fonte |
|---|---|
| Em que ponto estamos? | `current/STATUS.md` |
| O que vem depois? | `current/ROADMAP.md` |
| Qual é o escopo de uma fase? | `phases/<ID>/README.md` |
| Quais tasks pertencem à fase? | `phases/<ID>/TASKS.md` |
| O que foi implementado e validado? | `phases/<ID>/PROGRESS.md` |
| Como um agente deve trabalhar? | `agents/OPERATING_MODEL.md` |
| Onde está a prova de uma task? | pasta `evidence/` da própria fase ou link registrado em `PROGRESS.md` |
| Onde ficam documentos substituídos? | `archive/` |

## Regras de consistência

- Uma fase ou sprint possui um único ID estável e uma única pasta.
- Uma task pertence a apenas uma fase.
- Planejado, implementado, merged e validated são estados diferentes.
- Commit ou PR não encerra task sem critérios de aceite e evidência.
- `current/` não contém planos longos; apenas estado e direção.
- `archive/` não pode ser referenciado como fonte operacional atual.
- Documentos de domínio não duplicam boards ou progresso.
- Toda alteração funcional deve atualizar o `PROGRESS.md` da fase correspondente.

## Convenção de pastas de fase

```text
phases/<ID-descricao>/
├── README.md       # objetivo, escopo, gates e definição de pronto
├── TASKS.md        # catálogo estável de tasks
├── PROGRESS.md     # estado verificável e links de execução
├── DECISIONS.md    # decisões exclusivas da fase, quando necessário
└── evidence/       # evidências consolidadas; não logs brutos de agente
```

## Princípio

```text
Realidade operacional primeiro.
Contrato explícito antes do código.
Uma task, um escopo, uma evidência.
Status somente depois da validação.
```
