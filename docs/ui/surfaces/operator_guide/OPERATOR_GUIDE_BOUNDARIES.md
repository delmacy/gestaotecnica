# Operator Guide - Boundaries

O Operator Guide é uma superfície de enablement da plataforma. Para garantir que ele não vaze responsabilidades de outros sistemas, os seguintes limites (boundaries) são estabelecidos:

## O que o Operator Guide É e Faz:
- **Ensina o uso das superfícies:** Funciona como um tutorial / documentação interativa sobre como usar o System Builder.
- **Apresenta procedimentos:** Fornece o passo a passo claro para realizar tarefas específicas (ex: "Como montar um Form Blueprint").
- **Relaciona rotas e contratos:** Vincula os procedimentos às rotas reais onde a ação será executada.
- **Mantém estado efêmero:** O acompanhamento de checkboxes durante um guia é mantido apenas em memória do cliente (React state).

## O que o Operator Guide NÃO É e NÃO Faz:
- **Não executa ações operacionais:** O guia nunca fará chamadas à API, nem gravará no banco de dados para "executar" um passo por trás dos panos.
- **Não substitui a autenticação:** Não possui atalhos que bypassam login ou alteram o superusuário em runtime.
- **Não altera estado real:** Não edita metadados, não altera perfis de acesso, e não publica formulários ou workflows.
- **Não é um sistema de Help Desk:** Não permite abertura de tickets de suporte ou envio de mensagens.
- **Não é um sistema de Gestão de Treinamento (LMS):** Não há gamificação real, certificados, ou acompanhamento persistente de pontuação de aprendizado.
- **Não é uma base de conhecimento dinâmica:** Nesta fase, os guias são *hardcoded* (static index). Ele não lê arquivos do sistema local (filesystem) e não possui um editor de Markdown ou WYSIWYG embutido.
