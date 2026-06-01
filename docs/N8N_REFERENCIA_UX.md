# n8n como Referência de UX para o System Builder

O n8n será usado como referência visual e interativa, não como base de domínio ou código.

## 1. O que será usado como inspiração

### Canvas visual
O usuário deve conseguir montar processos visualmente, arrastando ou adicionando blocos.

### Nodes
Cada bloco visual representa uma parte do sistema/processo.

### Edges
As conexões mostram a sequência ou condição entre etapas.

### Biblioteca de blocos
Painel com blocos disponíveis para adicionar ao processo.

### Inspector lateral
Ao selecionar um nó, o usuário configura suas propriedades em um painel lateral.

### Preview
O usuário deve conseguir visualizar como o processo se comportaria para o usuário final.

### Histórico de execução
A execução real deve gerar registros consultáveis.

## 2. O que NÃO será copiado

* código do n8n;
* stack Vue;
* modelo de nodes de automação do n8n;
* sistema completo de workers;
* marketplace de integrações;
* credenciais avançadas;
* execução distribuída;
* complexidade completa de workflow automation.

## 3. Adaptação para o System Builder

No System Builder, os nodes representam:

* etapa humana;
* formulário;
* decisão;
* aprovação;
* documento;
* notificação;
* integração;
* ação de sistema;
* evento;
* início;
* fim.

## 4. Comparação visual

```text
n8n:
Trigger → HTTP Request → Transform → Send Email

System Builder:
Ticket Aberto → Triagem → Gerar OS → Executar Serviço → Finalizar → Gerar Rastreabilidade
```

## 5. Regra de produto

> Sempre que houver dúvida, o System Builder deve priorizar a modelagem do processo de negócio, não a automação técnica.

## 6. Diretriz para implementação

* usar `@xyflow/react` para o canvas visual;
* manter modelo interno próprio;
* não acoplar domínio ao React Flow;
* criar conversores entre modelo interno e nodes/edges visuais;
* manter o builder separado do runtime.
