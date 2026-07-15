export const validTimelineItem = {
  id: "123",
  type: "audit",
  title: "Processo Iniciado",
  occurredAt: new Date(),
  payload: { key: "value" }
};

export const invalidTimelineItem = {
  id: 123, // should be string
  type: "audit",
  title: "Processo Iniciado",
  occurredAt: new Date(),
  payload: { key: "value" }
};
