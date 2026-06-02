# Anti-Escopo Atual — System Builder

## 1. Objetivo

Evitar crescimento descontrolado do escopo durante as próximas fases.

## 2. Anti-escopo até a Fase 20

Não implementar antes do MVP técnico:

* marketplace;
* billing;
* multi-tenant avançado;
* IA geradora completa;
* integração real com n8n;
* workers distribuídos;
* filas complexas;
* execução paralela;
* retry avançado;
* documentos reais;
* notificações reais;
* form builder avançado;
* view builder avançado;
* registry completo;
* permissões granulares;
* app mobile;
* modo offline.

## 3. Anti-escopo da Fase 12B

Nesta fase, não fazer:

* não alterar código;
* não alterar banco;
* não criar migrations;
* não alterar package.json;
* não criar API;
* não mexer em UI;
* não criar service/repository;
* não executar comandos de banco;
* não mover documentos antigos de forma arriscada;
* não apagar documentos antigos.

## 4. Anti-escopo da próxima Fase 12 técnica

Na Fase 12 técnica, não fazer:

* não conectar UI ao banco;
* não criar botão salvar;
* não criar API route;
* não criar runtime;
* não criar process_instances;
* não criar events;
* não criar registry;
* não mexer em `src/builder/*`;
* não alterar package.json;
* não instalar dependências.

## 5. Regra de parada

> Se uma tarefa exigir mais de uma camada nova de arquitetura, ela deve ser dividida em nova fase.

Exemplo errado:

```text
Criar botão salvar, API, banco, publicação, runtime e evento.
```

Exemplo correto:

```text
Criar apenas service/repository de persistência, sem UI.
```
