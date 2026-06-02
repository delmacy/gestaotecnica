# Documentação do System Builder

## Estrutura

```text
00-current/
  Documentos que representam o estado atual do projeto e devem ser lidos antes de cada fase.

10-roadmap/
  Roadmap macro e milestones de longo prazo.

20-architecture/
  Decisões arquiteturais duráveis.

40-operations/
  Processo de trabalho, validação e colaboração com agentes.

90-archive/
  Documentos históricos, auditorias antigas e planos substituídos.
```

## Regra de leitura

Para implementar uma fase, normalmente basta ler:

```text
../AGENTS.md
00-current/NEXT_PHASE.md
00-current/STATUS_DAS_FASES.md
00-current/DECISOES_ATIVAS.md
00-current/ANTI_ESCOPO_ATUAL.md
```

## Regra de arquivamento

Documentos antigos, substituídos ou contraditórios devem ser movidos futuramente para:

```text
90-archive/
```

Ao arquivar, adicionar no topo:

```md
> Documento histórico. Não usar como fonte principal de implementação.
> Fonte atual: docs/00-current/
```
