# Guia de Anonimização de Fontes Reais

Este guia orienta o mascaramento e a remoção de informações sensíveis ou de identificação pessoal (PII) antes que qualquer fonte real seja submetida para análise no projeto de Process Mirroring.

## 1. Dados que DEVEM ser Removidos ou Mascarados

Você **não deve** enviar fontes que contenham dados identificáveis reais:
- **Nomes Próprios Completos** (Clientes, Funcionários, Terceiros).
- **Números de Documentos** (CPF, RG, CNH, CNPJ).
- **Dados de Contato** (Telefones reais, e-mails pessoais).
- **Localizações Específicas** (Endereço completo: rua, número, bairro, CEP; geolocalização exata).
- **Identificadores de Bens** (Placas de veículos, números de série de equipamentos de clientes, se aplicável).
- **Identificadores Corporativos Sensíveis** (Matrículas de RH, dados salariais).
- **Imagens Sensíveis** (Fotos com rostos, fachadas de residências privadas claras, senhas em post-its).

## 2. Dados que PODEM (e devem) Permanecer

Para que a análise do processo funcione, os seguintes contextos e "metadados" das informações devem ser mantidos:
- Jargões técnicos reais e gírias usadas para descrever o problema.
- Formato de datas ou horários (ex: "dia 14 as 15h").
- Nomes de ruas e bairros incompletos (apenas se for relevante para mostrar como a triagem avalia a distância - ex: manter apenas o nome do Bairro ou Região).
- Valores monetários aproximados (se o orçamento/custo for parte do processo).
- Títulos de colunas reais nas planilhas de controle.

## 3. Como Anonimizar as Fontes (Exemplos Práticos)

### 3.1. Como substituir nomes (Criar IDs Fictícios)
* **Antes:** "Oi, aqui é o João da Silva, falei com a Maria mais cedo."
* **Depois:** "Oi, aqui é o [Cliente 1], falei com a [Atendente A] mais cedo."

### 3.2. Como mascarar telefone ou documentos
* **Antes:** "Meu telefone é (11) 98765-4321 e meu CPF é 123.456.789-00."
* **Depois:** "Meu telefone é [TELEFONE] e meu CPF é [CPF]."

### 3.3. Como mascarar endereços
* **Antes:** "Moro na Rua das Flores, 123, apto 45, Bairro Centro, CEP 01000-000."
* **Depois:** "Moro na [Endereço omitido], Bairro [Bairro/Região]."

### 3.4. Como borrar prints (Imagens)
* Use ferramentas simples (Paint, Snipping Tool, Preview, ferramentas de censura em editores de imagem do celular).
* Coloque um retângulo preto ou aplique "blur/desfoque" cobrindo o cabeçalho onde aparece o nome ou telefone do contato do WhatsApp.
* Borre campos com dados sensíveis na tela do sistema oficial, deixando visível **apenas o nome do campo/label** e o tipo de dado (mas não o conteúdo real sensível).

### 3.5. Como anonimizar planilhas (Excel/CSV)
* Copie a aba original para um novo arquivo.
* Selecione a coluna inteira com Nomes e substitua por "Cliente 1", "Cliente 2", usando a alça de preenchimento.
* Exclua colunas inteiras de "Telefone", "CPF" ou "Endereço Completo". Deixe apenas a coluna de "Bairro" se ela for usada para roteirização técnica.

## 4. Checklist Antes de Enviar

Antes de encaminhar as fontes, o responsável deve verificar:
- [ ] Não há nenhum nome completo real nos textos/planilhas.
- [ ] Todos os telefones, CPFs, RGs ou documentos foram substituídos por tags `[TIPO]`.
- [ ] Nenhuma foto de rosto, documento ou fachada pessoal está visível.
- [ ] Não há e-mails ou senhas corporativas em prints.
- [ ] Os prints de telas de sistema legível estão censurados nas áreas de dados reais, mas mostram a estrutura dos campos (UI).
- [ ] A essência da demanda (o "problema relatado") foi preservada para entendermos a triagem.