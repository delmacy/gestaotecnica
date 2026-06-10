# Descrição Manual da Tela de OS

DESCRICAO_MANUAL_SEM_PRINT

Campos obrigatórios:
- Título da OS
- Solicitante
- Local de Atendimento
- Descrição do Problema
- Prioridade (Baixa, Média, Alta, Crítica)
- Categoria do Serviço

Campos opcionais:
- Patrimônio/Equipamento
- SLA Acordado
- Arquivos Anexos (fotos, PDFs)
- Observações Internas

Status disponíveis:
- Nova
- Em Triagem
- Aguardando Informação
- Atribuída
- Em Execução
- Pausada
- Concluída
- Validada/Fechada
- Cancelada

Quem cria:
- Atendente / Dispatcher (Nível 1)
- Sistema (via integrações)

Quem edita:
- Atendente / Dispatcher
- Técnico (apenas alguns campos e status)
- Supervisor

Quem encerra:
- Técnico (muda para Concluída)
- Supervisor (valida e muda para Fechada)

Campos que atrapalham ou geram retrabalho:
- O campo "Categoria do Serviço" tem uma lista muito longa (mais de 100 itens) e sem busca fácil, o que faz os atendentes colocarem em "Outros" frequentemente.
- O campo "Patrimônio" não é obrigatório na criação, então a OS vai para o técnico sem a identificação do equipamento, gerando retrabalho no local.

Observações:
A interface é muito poluída com campos legados que não usamos mais. A navegação no mobile para o técnico é difícil devido ao layout em abas pesadas.