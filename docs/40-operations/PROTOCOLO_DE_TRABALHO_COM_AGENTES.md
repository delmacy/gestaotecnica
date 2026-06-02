# Protocolo de Trabalho com Agentes — Jules/Codex

## 1. Princípio

> Uma fase deve ter um objetivo pequeno, verificável e reversível.

## 2. Fluxo de trabalho

```text
1. Definir fase
2. Implementar apenas o escopo da fase
3. Rodar validações
4. Reportar arquivos alterados
5. Fazer merge
6. Revisar contra escopo
7. Atualizar STATUS_DAS_FASES.md
8. Avançar para próxima fase
```

## 3. Regras para agentes

* não avançar para fases futuras sem autorização;
* não alterar package.json salvo se explicitamente pedido;
* não instalar dependências sem autorização;
* não criar migrations destrutivas;
* não executar `db:push` sem autorização;
* não apagar código legado sem fase específica;
* não conectar UI a banco se a fase for só service;
* não criar API se a fase for só repository;
* reportar erros sem mascarar;
* parar ao concluir a fase.

## 4. Relatório final obrigatório

Todo agente deve reportar:

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

> Uma fase só é aprovada quando a implementação corresponde ao escopo, não apenas quando compila.
