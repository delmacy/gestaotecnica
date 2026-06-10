# Capability Model

O Registry referencia slug, versão, tipo, dono, contratos, dependências, compatibilidade, status e localização documental. O conteúdo de cada capability vive em `../capabilities/universal/`.

**Regra Principal:**
Capabilities são pacotes de domínio (entidades, processos, regras, eventos). Não são telas, tabelas, departamentos ou integrações. Quando sobreposições ocorrem, devem ser resolvidas via composição e orquestração, e nunca por absorção de responsabilidades alheias.
