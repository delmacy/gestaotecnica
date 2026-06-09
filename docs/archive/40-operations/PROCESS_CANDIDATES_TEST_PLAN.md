# Plano de Testes — Process Candidates

## 1. Objetivo

Validar a experiência e os contratos de Process Candidates após a conclusão da
Fase 23, cobrindo a UI da Fase 22 e a persistência real adicionada pela fase
seguinte.

## 2. Riscos prioritários

1. A UI consumir um contrato diferente do modelo persistente.
2. Busca e filtros exibirem resultados incorretos ou detalhes ocultos.
3. Dados de um workspace aparecerem em outro workspace.
4. Estados de carregamento, erro e lista vazia não serem tratados.
5. Linhas clicáveis não funcionarem por teclado.
6. A seleção permanecer apontando para um candidato removido pelos filtros.

## 3. Matriz de cenários

| ID | Camada | Cenário | Resultado esperado | Prioridade |
|---|---|---|---|---|
| PC-001 | Contrato | Validar candidato completo | Payload aceito com contrato canônico | Alta |
| PC-002 | Contrato | Validar origem `integration` e `imported` | Origens aceitas e renderizadas | Alta |
| PC-003 | Contrato | Payload sem `workspaceId` | Rejeitado antes da persistência | Alta |
| PC-004 | Integração | Listar candidatos por workspace | Retorna somente dados do workspace | Crítica |
| PC-005 | Integração | Buscar por nome | Retorna correspondências esperadas | Alta |
| PC-006 | Integração | Buscar por descrição | Retorna correspondências esperadas | Média |
| PC-007 | Integração | Filtrar por status | Retorna somente o status selecionado | Alta |
| PC-008 | Integração | Combinar busca e status | Aplica ambos os critérios | Alta |
| PC-009 | E2E | Abrir `/candidates` | Lista e filtros ficam visíveis | Alta |
| PC-010 | E2E | Selecionar candidato | Painel mostra os detalhes corretos | Alta |
| PC-011 | E2E | Filtrar candidato selecionado | Seleção é limpa ou painel sinaliza ausência | Alta |
| PC-012 | E2E | Busca sem resultado | Estado vazio é exibido | Média |
| PC-013 | E2E | Navegar na lista por teclado | Seleção funciona sem mouse | Alta |
| PC-014 | E2E | Falha ao carregar dados | Estado de erro permite recuperação | Alta |
| PC-015 | E2E | Carregamento inicial | Indicador evita tela enganosa | Média |
| PC-016 | E2E | Viewport mobile | Lista e detalhes continuam utilizáveis | Média |

## 4. Dados mínimos de teste

Preparar candidatos controlados com:

- Dois workspaces distintos.
- Todos os status canônicos.
- Todas as origens canônicas.
- Nomes semelhantes para validar busca parcial.
- Descrição ausente e descrição preenchida.
- Evidências e definição proposta.

Os testes devem remover ou isolar os dados criados. Nunca depender de dados
manuais existentes.

## 5. Critérios de aceite da corretiva

- UI usa o contrato canônico da Fase 23.
- Busca e filtro possuem testes automatizados.
- Seleção e painel de detalhes possuem testes automatizados.
- Isolamento por `workspace_id` possui teste de integração.
- Estados vazio, loading e erro possuem cobertura.
- Fluxo principal possui teste Playwright.
- `lint`, `build` e testes passam.
- Riscos não cobertos ficam explicitamente registrados.

## 6. Evidência esperada

O relatório final deve informar:

```text
Cenários implementados:
Cenários passando:
Falhas encontradas:
Correções realizadas ou propostas:
Riscos residuais:
Comandos executados:
```
