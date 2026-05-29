export const shiftTypes = [
  {
    key: "expediente",
    label: "Expediente",
    description: "Jornada regular de trabalho.",
    requiresShiftLog: false,
    receivesTickets: true,
    receivesServiceOrders: true,
    allowsOverlap: true,
  },
  {
    key: "plantao",
    label: "Plantao",
    description: "Turno operacional de atendimento tecnico.",
    requiresShiftLog: true,
    receivesTickets: true,
    receivesServiceOrders: true,
    allowsOverlap: false,
  },
  {
    key: "sobreaviso",
    label: "Sobreaviso",
    description: "Disponibilidade para acionamento.",
    requiresShiftLog: false,
    receivesTickets: "when_triggered",
    receivesServiceOrders: "when_triggered",
    allowsOverlap: true,
  },
  {
    key: "ausencia",
    label: "Ausencia",
    description: "Indisponibilidade planejada ou registrada.",
    requiresShiftLog: false,
    receivesTickets: false,
    receivesServiceOrders: false,
    allowsOverlap: false,
  },
] as const;

export type ShiftTypeKey = (typeof shiftTypes)[number]["key"];
