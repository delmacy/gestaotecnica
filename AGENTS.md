# AGENTS.md — Guia para agentes no projeto

## 1. Objetivo

Este arquivo orienta agentes como Jules, Codex ou outros assistentes que forem trabalhar neste repositório.

O projeto principal é o **System Builder**, uma plataforma para modelar, versionar, publicar e executar sistemas/processos empresariais.

## 2. Arquivos obrigatórios antes de implementar

Antes de qualquer implementação, leia nesta ordem:

```text
docs/00-current/NEXT_PHASE.md
docs/00-current/STATUS_DAS_FASES.md
docs/00-current/DECISOES_ATIVAS.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
```

Se a fase envolver arquitetura, consultar também:

```text
docs/20-architecture/DECISOES_ARQUITETURAIS.md
```

Se a fase envolver roadmap amplo, consultar:

```text
docs/10-roadmap/ROADMAP_100_FASES.md
```

## 3. Regras obrigatórias

* Não avance para fases futuras sem autorização.
* Não altere `package.json` salvo se a fase pedir explicitamente.
* Não instale dependências sem autorização.
* Não execute `db:push` sem autorização explícita.
* Não crie migrations destrutivas.
* Não apague código legado sem fase específica.
* Não conecte UI ao banco se a fase for apenas de service/repository.
* Não crie API se a fase for apenas de domínio, schema ou documentação.
* Reporte erros sem mascarar.
* Pare ao concluir o escopo da fase.

## 4. Relatório final obrigatório

Ao final de cada fase, reporte:

```text
Arquivos criados:
Arquivos alterados:
Comandos executados:
Resultado do lint:
Resultado do build:
Resultado do git status:
Desvios/erros:
```

## 5. Critério de aprovação

Uma fase só é aprovada quando a implementação corresponde ao escopo, não apenas quando compila.
