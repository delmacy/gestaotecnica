# Anti-Escopo do MVP

Este documento deve servir como trava para evitar que o MVP cresça demais.

## 1. Princípio

O MVP deve provar apenas o ciclo mínimo:

```text
modelar processo
↓
salvar definição
↓
pré-visualizar
↓
executar instância simples
↓
registrar evento
```

## 2. Não implementar nesta fase

* [ ] marketplace de templates;
* [ ] marketplace de integrações;
* [ ] IA geradora de sistemas;
* [ ] IA arquiteta autônoma;
* [ ] billing;
* [ ] multi-tenant avançado;
* [ ] permissões granulares complexas;
* [ ] auditoria completa;
* [ ] assinatura digital;
* [ ] motor BPMN completo;
* [ ] importador BPMN;
* [ ] exportador BPMN;
* [ ] workers distribuídos;
* [ ] filas complexas;
* [ ] execução paralela;
* [ ] retry avançado;
* [ ] compensação transacional;
* [ ] integração real com n8n;
* [ ] integração real com WhatsApp;
* [ ] integração real com e-mail;
* [ ] designer visual completo de banco;
* [ ] geração automática completa de CRUD;
* [ ] dashboards avançados;
* [ ] relatórios avançados;
* [ ] app mobile;
* [ ] modo offline;
* [ ] plugin system público.

## 3. O que pode ser mockado

* usuário atual;
* workspace atual;
* actions;
* notificações;
* documentos;
* integrações;
* permissões;
* eventos externos.

## 4. O que não pode ser mockado

* estrutura dos documentos;
* vocabulário arquitetural;
* separação builder/runtime;
* definição de processo;
* serialização de nodes/edges;
* persistência futura prevista;
* trilha mínima de evento.

## 5. Regra de parada

> Se uma tarefa exigir mais de uma camada nova de arquitetura, ela deve ser adiada para fase posterior.

Exemplo:

Errado:
“Criar nó de notificação com integração real de e-mail, credenciais, fila, retry e template engine.”

Certo:
“Criar nó notification com configuração mockada e payload serializável.”
