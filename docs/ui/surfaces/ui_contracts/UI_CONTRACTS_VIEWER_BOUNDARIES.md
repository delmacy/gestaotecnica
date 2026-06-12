# UI Contracts Viewer - Boundaries

Este documento define os limites operacionais e responsabilidades da superfície UI Contracts Viewer, diferenciando-a das demais áreas do System Builder.

## 1. UI Contracts Viewer

**O que faz:**
- Visualiza contratos de superfície (UiSurfaceContract) definidos em `.md`.
- Organiza metadados de UI para rápida consulta técnica.
- Mostra status, evidências exigidas e riscos.
- Apoia a transição estrutural de fases (ex: do Grupo A para o B).

**O que NÃO faz:**
- Não edita contrato real nesta fase.
- Não substitui o repositório como fonte da verdade.
- Não atualiza o Tasker Board ou qualquer outra superfície.
- Não manipula o sistema de arquivos local (filesystem).
- Não persiste dados no banco.
- Não chama APIs ou server actions.

## 2. Diferenciações

**Vs. Docs Viewer:**
- O Docs Viewer visualiza documentação geral (arquivos não estruturados) e foca na leitura de Markdown completo.
- Pode apontar para contratos de UI, mas não normaliza os campos em metadados pesquisáveis ou tabulares como o UI Contracts Viewer faz.

**Vs. Registry View:**
- O Registry View visualiza as Capabilities (arquitetura do sistema, entidades, eventos).
- Não substitui nem entra em conflito com os contratos de interface gráfica. Capabilities e Surfaces são conceitos separados.

**Vs. Tasker Board:**
- O Tasker Board acompanha tarefas (tasks), status e dependências em um board de fluxo de trabalho.
- Pode referenciar contratos, mas não é um visualizador de contratos focado nos metadados da UI.

## 3. Restrições Estritas de Implementação (Proibições)

O módulo **NÃO DEVE**:
- Editar ou gravar arquivos Markdown.
- Salvar dados no banco de dados (sem ORM Drizzle).
- Fazer chamadas de API reais ou via Fetch para mutações.
- Ler filesystem real em runtime local para renderizar a interface (apenas a injeção mockada no build é aceita).
- Gerar componentes de código fonte automaticamente.
- Gerar ou modificar rotas reais do Next.js.
- Alterar o estado do workspace.
- Instalar capabilities.
- Desbloquear features do Grupo D de forma real ou acionar operações da Gestão Técnica.
