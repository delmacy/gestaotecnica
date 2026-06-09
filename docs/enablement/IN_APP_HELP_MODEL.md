# In-App Help Model

## Objetivo
Oferecer ajuda contextual alinhada a papel, estado e risco sem substituir autorização.

## Campos e entidades obrigatórios
help_id, rota/superfície, papel, capability, estado, gatilho, mensagem, ação sugerida, link de guia, severidade, versão e owner.

## Processo de uso
Mapear dúvidas/erros → selecionar contexto → escrever ajuda curta → ligar guia → testar compreensão → medir uso.

## Critérios de aceite
Ajuda aparece no contexto correto; não revela ação proibida; aponta para instrução versionada; possui owner e métrica.

## Exemplo aplicado
Ao tentar encerrar ordem sem evidência, a ajuda explica o requisito e abre o checklist aplicável.

## Riscos e anti-padrões
Tooltip genérico; ajuda como regra de negócio; texto visível a papel indevido; mensagem sem ação de recuperação.
