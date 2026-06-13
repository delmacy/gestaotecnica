# Operator Guide - Interaction Rules

## Ações Permitidas (Autorizadas para MVP)
- Buscar guias por texto (busca local no index estático).
- Filtrar guias por audiência (perfil), categoria ou dificuldade.
- Selecionar um guia na lista para visualizar seus detalhes no painel principal.
- Navegar pelas seções internas do guia (pré-requisitos, passos, etc).
- Marcar ou desmarcar passos (checkboxes) localmente em client-side (sem persistência).
- Limpar o progresso do checklist local.
- Copiar o path de uma rota para a área de transferência.
- Copiar comandos ou fragmentos de texto úteis para a área de transferência.
- Abrir rotas relacionadas através de links diretos configurados.
- Expandir/colapsar os itens de troubleshooting (accordion ou detalhes).
- Alterar o filtro de audiência.

## Ações Proibidas (Fora do Escopo ou Bloqueadas)
- Executar qualquer comando bash/CLI ou de sistema operacional real a partir do navegador.
- Salvar, sincronizar ou persistir o progresso do checklist em banco de dados ou API.
- Editar o texto, título, passos ou metadados de qualquer guia.
- Alterar as configurações ou os dados de um usuário real.
- Alterar mecanismos ou estados de autenticação real (login/logout) por meio do guia em si.
- Fazer upload de novos guias (PDF, MD, imagens).
- Enviar dados de formulários operacionais através da interface do guia.
- Executar um workflow, n8n ou webhook a partir do guia.
- Modificar o estado ou persistir dados nas superfícies do Form Builder, View Builder ou Workflow Builder.
- Desbloquear ou executar rotas de execução real pertencentes ao "Grupo D" (Gestão Técnica / Runtime) que estão atualmente bloqueadas pela arquitetura "Platform First".
