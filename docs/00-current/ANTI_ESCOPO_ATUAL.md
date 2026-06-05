# Anti-Escopo Atual — System Builder

Este documento lista o que **NÃO DEVE** ser feito pelas IAs ou desenvolvedores até que haja autorização explícita e uma fase designada.

## 1. Anti-Escopo Permanente / Futuro

*   **Runtime:** Não criar o runtime completo de uma vez. O runtime deve ser faseado gradualmente.
*   **Events:** Não criar sistema de eventos (rastreabilidade/logs) sem fase específica.
*   **Registry/Actions:** Não criar registry de ações sem fase específica.
*   **n8n:** Não criar integração real com o n8n ainda.
*   **Billing:** Não criar nenhum sistema de cobrança/billing.
*   **Multi-tenant:** Não criar lógica de multi-tenant avançado (atualmente operamos com mock IDs de Workspace onde necessário no Builder).
*   **Permissões:** Não criar permissões complexas (RBAC/ABAC).
*   **Workers/Filas:** Não introduzir processamento em background (workers) ou filas (ex: Redis/RabbitMQ).
*   **Documentos:** Não criar sistema de gestão de documentos reais.
*   **Notificações:** Não criar sistema de notificações reais (email/push/slack).

## 2. Anti-Escopo Técnico Imediato (Regra de Ouro da Modularidade)

*   **Separação de Responsabilidades (Granularidade):** Não misturar schema, repository, service, server action e UI na mesma fase técnica. Entregue um por fase.
*   **Dependências:** Não alterar arquivos `package.json`, `package-lock.json`, `pnpm-lock.yaml`, ou `yarn.lock` sem autorização prévia e justificada.
*   **Banco de Dados:** Não executar `npm run db:push` (ou `drizzle-kit push`) ou criar migrations sem autorização explícita do usuário. As alterações de schema são planejadas iterativamente.

## 3. Anti-Escopo de Papéis (Jules Dev vs. Jules Documental)

*   **Jules Documental:** NÃO altera código (`src/**`, `app/**`, `components/**`, `db/**`, `.sql`, etc.). Sua responsabilidade é apenas com o planejamento e governança da pasta `docs/` e `AGENTS.md`.
*   **Jules Dev:** NÃO altera documentos de controle gerenciais.
*   **Gerenciamento do Board:** Apenas o **Jules Documental** é o responsável por criar e atualizar o arquivo `docs/00-current/WORK_BOARD.md` e espelhar o status entre as fases.
*   **Limites de Execução Planejada:** Jules Dev não deve executar fases futuras mesmo que os arquivos de planejamento (ex: Fases 17, 18, 19, 20) já existam e estejam em `docs/planning`. O planejamento de fases futuras representa **apenas uma fila** e direção visualizada, não é uma autorização irrestrita de implementação. Cada fase técnica deve ser executada individualmente, seguida de merge e revisão da IA Revisora e do Delmacy, antes de iniciar o prompt da próxima. A existência de documentação detalhada para fases futuras **NÃO** significa passe livre para implementação contínua.

## 4. Regra de preservação histórica

*   **Não apagar histórico de fase.**
*   **Não sobrescrever relatórios anteriores.**
*   **Jules Dev pode acrescentar relatório ao arquivo da fase, mas não editar board/status.**
*   **Correções devem ser registradas como nova entrada em “Histórico de correções”.**
*   **Planejamento futuro não autoriza implementação futura.**
