export const queues = [
  {
    key: "operacional-n1",
    label: "Operacional N1",
    description: "Fila de atendimento tecnico-operacional inicial.",
  },
  {
    key: "triagem-tecnica",
    label: "Triagem Tecnica",
    description: "Fila de classificacao e encaminhamento tecnico.",
  },
  {
    key: "supervisao-tecnica",
    label: "Supervisao Tecnica",
    description: "Fila de demandas que exigem decisao ou validacao do supervisor.",
  },
  {
    key: "secretaria-tecnica",
    label: "Secretaria Tecnica",
    description: "Fila de preparacao documental e consolidacao administrativa.",
  },
  {
    key: "livro-turno",
    label: "Livro de Turno",
    description: "Fila de pendencias e registros associados ao turno.",
  },
  {
    key: "planejamento-tecnico",
    label: "Planejamento Tecnico",
    description: "Fila de atividades planejadas, projetos e manutencao futura.",
  },
] as const;
