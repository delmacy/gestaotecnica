# DEC-SB-001 — System Builder vem antes da instância Gestão Técnica

## Contexto

O projeto encontrou um bloqueio operacional nas tasks de Process Mirroring e Capability Validation (como `REAL-SRC-002` e `CAP-VAL-002`) devido à indisponibilidade momentânea de fontes reais. Este bloqueio estava impactando o desenvolvimento integral do System Builder, pois a validação do cliente "Gestão Técnica" estava atrelada à fundação da plataforma.

## Decisão

Foi decidido reestruturar o planejamento do projeto para estabelecer as seguintes diretrizes:

- O foco imediato e principal do projeto é construir o **System Builder como plataforma completa**.
- A "Gestão Técnica" será tratada como o primeiro cliente/piloto, mas sua validação operacional real será posicionada em uma fase posterior.
- Fontes reais são importantes e essenciais para validar processos operacionais reais de clientes, mas **não são requisitos bloqueantes** para a construção estrutural da plataforma base.
- O Builder está autorizado a utilizar **dados sintéticos**, fixtures e exemplos genéricos para desenvolver suas funcionalidades estruturais (Shell, Tasker Board, Intake, etc.).
- Sempre que utilizados, dados sintéticos devem ser **explicitamente marcados** como sintéticos ou `SIMULATED_OBSERVATION`.
- **Nenhum processo baseado em dados sintéticos** pode ser considerado ou tratado como um processo real validado.
- O desenvolvimento do processo operacional real da "Gestão Técnica" só será iniciado após a plataforma do System Builder estar minimamente funcional e estável.

## Impacto

Essa decisão permite o desbloqueio do desenvolvimento das ferramentas vitais do System Builder, redefinindo as dependências e separando o ciclo de vida da plataforma em relação aos seus clientes/pilotos.
