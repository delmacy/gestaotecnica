# Checklist Model

## Objetivo
Garantir verificações repetíveis sem substituir julgamento profissional.

## Campos e entidades obrigatórios
checklist_id, papel, processo/estado, itens, obrigatoriedade, condição, evidência, bloqueio, aprovação, versão e owner.

## Processo de uso
Derivar pontos críticos → formular itens verificáveis → definir evidência/bloqueio → testar → revisar após incidentes.

## Critérios de aceite
Cada item é verificável; itens condicionais informam condição; falha crítica bloqueia ou escala; conclusão gera evidência.

## Exemplo aplicado
Antes de encerrar ordem: resultado registrado, foto anexada, consumo baixado e validação solicitada.

## Riscos e anti-padrões
Checklist como texto decorativo; marcar tudo automaticamente; itens vagos; excesso de itens sem risco associado.
