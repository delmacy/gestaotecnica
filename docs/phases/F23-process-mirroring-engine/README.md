# F23 — Process Mirroring Engine

Status: `planned`

## Objetivo

Converter observações reais em Process Candidates governados, modelos As-Is, versões publicáveis e métricas de processo.

## Resultado de produto

Uma operação pode registrar sinais reais, revisar um candidato, modelar o processo observado e publicá-lo sem que agentes ou integrações promovam mudanças automaticamente.

## Escopo incluído

- fontes de observação;
- Process Candidate;
- revisão e aprovação humana;
- modelos As-Is;
- análise de gaps e padrões;
- versionamento, dependências e métricas;
- publicação no registry.

## Fora de escopo

- execução completa do workflow em produção;
- automação autônoma de publicação;
- capabilities funcionais fora do necessário para matching;
- federação de processos entre instâncias.

## Dependências e gates

- F22 validada;
- inventário do que já existe em `process_mirroring/`, Builder, gateway e runtime;
- contratos de consentimento, proveniência e aprovação humana.

## Regra de segurança

Agentes e integrações podem criar ou enriquecer candidatos. Publicação exige ator humano autorizado e receipt auditável.

## Definição de pronto

Uma fonte real gera candidato, revisão, modelo As-Is versionado e publicação controlada, com trilha de eventos e distinção explícita entre real, sintético e demo.
