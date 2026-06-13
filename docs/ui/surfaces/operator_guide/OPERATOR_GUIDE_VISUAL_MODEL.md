# Operator Guide - Visual Model

## Layout Estrutural

A superfície **Operator Guide** será inserida na área de conteúdo do `BuilderShell` sob a rota `/builder/operator-guide`. O layout adotará um formato de "Studio/Portal", dividido em painéis.

### 1. Header (Topo da página)
- **Título da Superfície:** "Operator Guide" ou "Centro de Guias Operacionais".
- **Aviso Global (Badge/Banner):** "Read-only / Static Guide - No real operations are executed. Progress is local and temporary." - Muito importante para contextualizar as limitações de dados sintéticos/estado local.
- **Busca:** Campo de texto de busca global de guias.

### 2. Painel Lateral (Esquerda - Navegação e Filtros)
- **Filtros:**
  - Por Perfil (Audiência recomendada).
  - Por Superfície Relacionada (Form Builder, Tasker, etc).
  - Por Dificuldade.
- **Lista/Árvore de Guias:**
  - Agrupados por `Categorias` (ex: "Getting Started", "Platform Access").
  - Item da lista mostra o título e o nível de dificuldade.

### 3. Painel de Detalhe (Direita - O Guia Selecionado)
Ao selecionar um guia, este painel exibe:
- **Cabeçalho do Guia:** Título, Descrição.
- **Metadados:** Perfil recomendado, Dificuldade, Duração estimada (apenas como metadado, sem promessa operacional de controle de tempo).
- **Pré-requisitos:** Lista de condições para seguir o guia.
- **Seções Principais:**
  - **Passos Numerados (Checklist Local):** Cada passo possui um checkbox (estado local) e uma descrição detalhada. Pode conter trechos de comando/texto com botão "Copiar".
  - **Warnings:** Área de destaque (ex: Card amarelo/vermelho) para avisos importantes.
  - **Resultado Esperado:** Mensagem final de sucesso ou estado desejado.
  - **Troubleshooting:** Accordion ou lista para resolução de problemas comuns naquele procedimento.
- **Rodapé / Sidebar de Contexto:**
  - **Rotas Relacionadas:** Links (botões) para navegar para outras superfícies da plataforma referenciadas no guia (ex: "Ir para Tasker").

## Responsividade
- Em resoluções menores, a lista de guias pode colapsar em um menu drawer ou empilhar sobre os detalhes. No MVP, assume-se uso prioritário em Desktop (painel duplo).
