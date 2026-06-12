# Parity Matrix - Form Builder

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Exibir lista de form blueprints | VISUAL_MODEL.md | Painel lateral esquerdo | Sim (Static Schema) | PLANEJADO | N/A | Mockar dados |
| Exibir canvas de formulário | MVP_PLAN.md | Área central renderizando sequencia lógica | Sim (Static Schema) | PLANEJADO | N/A | Construir Canvas |
| Exibir field palette | VISUAL_MODEL.md | Tab no painel lateral direito | Sim | PLANEJADO | N/A | Criar UI Palette |
| Exibir field detail | VISUAL_MODEL.md | Painel interativo de propriedades (Inspector) | Não (Reflete estado local) | PLANEJADO | N/A | Criar Properties UI |
| Exibir field_type | STATIC_SCHEMA_CONTRACT.md | Texto ou Ícone no Inspector/Canvas | Não | PLANEJADO | N/A | Mapear FieldTypes visualmente |
| Exibir required/optional | STATIC_SCHEMA_CONTRACT.md | Toggle e asterisco no Canvas | Não | PLANEJADO | N/A | Configurar estado `isRequired` |
| Exibir validation rules | MVP_PLAN.md | Tab secundária no Inspector | Sim | PLANEJADO | N/A | Renderizar Regras Mockadas |
| Exibir preview | MVP_PLAN.md | Alternância de aba Canvas -> Preview renderizando Inputs finais | Não | PLANEJADO | N/A | Criar aba de preview limpa |
| Exibir bindings com process/capability | MVP_PLAN.md | Tab terciária no Inspector | Sim | PLANEJADO | N/A | Renderizar Mock de conexões |
| Exibir governance warnings | MVP_PLAN.md | Card/Alerta vermelho ou amarelo | Sim | PLANEJADO | N/A | Renderizar mock pii_risk |
| Exibir readiness status | STATIC_SCHEMA_CONTRACT.md | Badge superior no Canvas/Form Header | Sim | PLANEJADO | N/A | Criar Badges |
| Operar design-only | BOUNDARIES.md | Sem actions de persistência, aviso visível | Não | PLANEJADO | N/A | Verificar ausência de actions |
| Não persistir formulário real | BOUNDARIES.md | Nenhum ORM trigger | Não | PLANEJADO | N/A | Auditar código |
| Não gerar migration/schema | BOUNDARIES.md | Nenhum comando Drizzle | Não | PLANEJADO | N/A | Auditar código |
| Não depender de banco | BOUNDARIES.md | Totalmente static client state | Não | PLANEJADO | N/A | Auditar código |
| Manter Grupo D bloqueado | BOUNDARIES.md | Status GT visualizado como blocked, e aviso explicitado | Sim (Mock GT Blueprint) | PLANEJADO | N/A | Mockar form "real_blocked" |
