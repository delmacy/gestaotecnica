# System Builder MVP

## 1. Propósito
O System Builder é uma plataforma para modelar, gerar e operar sistemas empresariais orientados por processos.
A ideia central:
- o processo vem antes da tela;
- a operação real da organização deve ser espelhada pelo sistema;
- o builder transforma processos em módulos, formulários, views, eventos, ações e runtime operacional.

> The principle is the process.

## 2. Diferença entre System Builder e n8n
- n8n = workflow automation builder;
- System Builder = business system/process builder.
O n8n serve como referência de experiência visual, não como modelo de domínio.

| Tema | n8n | System Builder |
|---|---|---|
| Unidade principal | Workflow de automação | Processo/módulo de negócio |
| Nó representa | Integração ou operação técnica | Etapa, formulário, decisão, aprovação, documento, evento ou ação |
| Resultado | Automação executável | Sistema operacional process-driven |
| Usuário principal | Operador técnico/automação | Desenvolvedor, analista de processo e cliente operacional |
| Execução | Workflow run | Process instance/runtime operacional |

## 3. Objetivo do MVP
O núcleo mínimo do MVP inclui:
1. desenhar processo em canvas visual;
2. adicionar blocos/nós;
3. conectar nós;
4. configurar nós em painel lateral;
5. salvar definição do processo;
6. pré-visualizar processo como usuário final;
7. criar instância simples de execução;
8. registrar eventos básicos;
9. manter rastreabilidade mínima.

## 4. Fluxo esperado do MVP
```text
Criar workspace
↓
Criar processo
↓
Adicionar blocos no canvas
↓
Configurar etapas
↓
Salvar definição
↓
Pré-visualizar
↓
Iniciar instância
↓
Executar etapas
↓
Registrar eventos
↓
Consultar histórico
```

## 5. Escopo funcional inicial
Os blocos iniciais são:
* start
* human_task
* form
* decision
* approval
* document
* notification
* integration
* end

## 6. Fora do escopo nesta versão
Listados explicitamente:
* marketplace;
* IA geradora completa;
* integração real com n8n;
* permissões avançadas;
* multi-tenant complexo;
* billing;
* template marketplace;
* execução distribuída;
* workers;
* filas complexas;
* designer visual completo de banco de dados;
* geração automática completa de CRUD;
* importação/exportação avançada.

## 7. Critério de sucesso do MVP
O MVP será considerado bem-sucedido quando for possível:
```text
desenhar um processo
↓
salvar a definição
↓
abrir preview
↓
iniciar uma instância
↓
avançar uma etapa
↓
registrar evento
```
