# Paperclip Integration Strategy

O System Builder é *Paperclip-ready*, mas não *Paperclip-dependent*.

## Fronteiras de Responsabilidade
- **Paperclip:** Funciona como o escritório e orquestrador dos agentes. Ele gerencia as tarefas, os logs da IA e a execução das rotinas de observação e elicitação.
- **System Builder:** É a fábrica e o motor de execução. Ele não organiza tarefas da IA, ele recebe as propostas (Process Candidates), fornece interface para revisão humana, versiona, publica e executa.
- **n8n:** Integrador logístico (captura sinais de Slack, e-mails, webhooks) que alimenta os agentes.
- **Postgres:** O livro-razão imutável de tudo o que foi de fato oficializado e executado na operação da empresa.
