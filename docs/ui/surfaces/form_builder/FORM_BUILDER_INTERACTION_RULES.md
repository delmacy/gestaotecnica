# Form Builder - Interaction Rules

## 1. Interações Permitidas
As seguintes ações são autorizadas para compor a simulação da interface do Form Builder:

- **Selecionar Blueprint:** Clicar num projeto na lista lateral (ex: "Clinic Appointment") para carregar seu schema no Canvas.
- **Selecionar Campo:** Clicar num input exibido no Canvas para ativá-lo, carregando suas propriedades no painel direito.
- **Alternar Abas (Painel Central/Direito):** Navegar entre as visões `Canvas` e `Preview`, ou entre `Properties`, `Validation`, `Bindings`, `Governance`.
- **Filtrar:** Buscar campos na Palette.
- **Simular Propriedades Locais:** Uso de Toggle buttons de `required`/`optional` no Inspector, mudando a visualização em tela, suportado por React State passageiro.
- **Visualizar Metadados:** Ver os avisos de segurança (Governance Warnings) e associações (Bindings).
- **Limpar Seleção:** Clicar fora de um campo para voltar o inspetor ao estado raiz do formulário.

## 2. Interações Proibidas
As seguintes ações caem no bloqueio de escopo real/persistido e não devem estar presentes de maneira funcional na aplicação:

- **Salvar Realmente o Formulário:** Um botão "Save" não deve existir, ou deve exibir um toast avisando "Mock Mode: Not Persisted".
- **Persistir Propriedades:** As edições feitas no inspector (ex: Required) serão esquecidas ao trocar de blueprint ou dar reload na página.
- **Acessar/Gravar Banco:** Sem mutações para o backend PostgreSQL via Actions.
- **Gerar Migration / Código:** Nenhum botão que dispare alteração real no sistema de arquivos do repositório.
- **Executar Runtime Submissão:** O modo `Preview` apenas renderiza os campos. Um botão de "Submit" não deve enviar payloads reais.
- **Coletar PII:** Todos os dados inseridos em modo Preview devem ser considerados efêmeros.
- **Instalar Capabilities:** Alterar conexões ou status do ambiente Builder está fora de escopo.
