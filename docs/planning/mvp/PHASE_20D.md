# Fase 20D — Demo end-to-end documentada

## Objetivo
- documentar roteiro de demo de como usar o system builder como produto E2E.
- incluir prints ou vídeos (scripts) demonstrando a operação fluída.
- marco oficial de encerramento do MVP técnico.

## Contexto
Temos as peças. Falta mostrar o carro andando para o Sponsor ou para o roadmap futuro. O fechamento é a gravação manual visual/descrita da ferramenta real sendo utilizada como Arquitetura e como Runtime.

## Arquivos permitidos
- `docs/00-current/DEMO_MVP.md`
- Assets em `docs/assets`

## Arquivos proibidos
- Códigos e re-arquiteturas ou hotfixes. É apenas um documento.

## Regras
- Script descritivo de "Faça isso", "Clique ali", "O resultado no Banco será esse", com prints integrados (mockados se a IA não pode extrair).

## Etapas
1. Crie o roteiro passo a passo E2E para modelar, instanciar e rastrear.
2. Adicione os assets visuais disponíveis.

## Validações
- Leitura final aprovada pelo dono do produto.

## Relatório final esperado
Conclusão oficial do MVP.

## Regra de parada
O documento `DEMO_MVP.md` estar formalizado.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/mvp-hardening.md

Fase 20D — Demo end-to-end documentada

Objetivo:
Construir o documento de encerramento do ciclo técnico do MVP, redigindo o manual visual e guiado de toda a experiência construída do System Builder à Rastreabilidade.

Escopo:
- Arquivos a criar: `docs/00-current/DEMO_MVP.md` e possivelmente os de assets visuais.

Não alterar:
- Todo o resto do repositório.

Regras:
1. Deve ser didático para um usuário/Sponsor. "Passo 1: Modelagem -> Passo 2: Roteamento...", "Veja no banco o Evento".

Etapas:
1. Estruture a Demo baseada no caminho feliz do Smoke test da Fase 20A mas com linguagem de Produto, não técnica de QA.

Validações:
Formatos suportados e clareza.

Relatório final:
A conclusão e submissão da última tarefa técnica do pipeline.

Regra de parada:
Documento finalizado. Fim da linha.
```