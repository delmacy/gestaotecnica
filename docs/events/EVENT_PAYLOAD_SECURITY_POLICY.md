# EVENT PAYLOAD SECURITY POLICY

Estabelece diretrizes fundamentais e estritas de segurança, privacidade e tratamento de dados dentro do trânsito (Outbox/Delivery) e armazenamento (Event Log) de mensagens do System Builder.

## 1. Minimal Payload
Eventos não devem transportar estados enormes se puderem evitar (por ex. anexos binários, ou objetos base64 massivos). Em vez de embutir os dados crus (`fat event`), prefira apontar uma "referência de documento" para que sistemas secundários busquem o conteúdo apenas se houver permissão válida.

## 2. Segredos e Credenciais (Proibição Absoluta)
O envelope (`data`) **nunca** pode armazenar: senhas em texto puro, hashes saltados que não sejam necessários ao negócio externo, chaves de API, secrets de OAuth, tokens JWT originais, e chaves criptográficas RSA/ECDSA privadas. O banco de dados do log de eventos será visível em painéis analíticos/auditoria e deve ser tratado com menor grau de "segurança estrita transacional" que a base KMS original.

## 3. PII e Redaction
Toda Informação Pessoal Identificável (Personally Identifiable Information), quando trafegada num evento, deve futuramente contar com "Redaction".
- `sensitivity`: O envelope deve possuir uma classificação indicando PII level (low, medium, high, critical).
- `redactionPolicy`: Indica ao despachante qual o plano de "supressão", substituindo CPF por `***`, por exemplo, caso exportado para ambiente não-autoritativo.

## 4. Retenção vs. Imutabilidade e LGPD (Direito ao Esquecimento)
Sendo o Event Log append-only (imutável na base de transações arquiteturais), não se deve "deletar a linha" baseada no ID do usuário para cumprir regulamentação. Pelo contrário:
- Utiliza-se *Crypto-Shredding* em dados ultrassensíveis com chave simétrica anexada localmente no KMS. Remover a chave apaga o acesso.
- Ou: Sanitiza-se/Atualiza-se explicitamente apenas os campos PII por um job "Tombstone/GDPR".
- Logs inteiros purgam apenas com lifecycle rentention cron (por expiração tenant natural - e.g. retenção de dados após finalização de contrato de serviço).

## 5. Hashing / Encryption (Futuro)
As regras assumem que o canal `data` pode no futuro vir todo criptografado (`Encrypted Envelope Pattern`) para logs multi-tenant hospedados por provedor terceirizado. Para isso, o envelope deve definir adequadamente seu `dataSchema` e tipo genérico de forma a suportar byte/string em `data`.

## 6. Erro de Sanitização
Qualquer evento de natureza `runtime.process.instance.failed` contendo na payload "error detail" originado por exception, DEVE passar por um sanitizador de callstack e não transportar injeções de memória/DB connection params para o Event Log.

## 7. Isolamento / Acesso Perfil (RBAC)
- O acesso a visualização da fila de log e dos outboxes é estritamente demarcado a partir da propriedade `workspaceId` garantindo tenancy zero-trust.
- Futuramente será imposto um sub-profiling baseado em RBAC para permitir ou não visão administrativa analítica dos logs, ocultando logs financeiros em tenants multi-departamentais de logs operacionais.
