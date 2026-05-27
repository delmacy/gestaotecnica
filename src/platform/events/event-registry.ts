import type { EventDefinition } from "./event-types";

const events = new Map<string, EventDefinition>();

export function registerEvent(eventDefinition: EventDefinition) {
  const existing = events.get(eventDefinition.key);
  if (existing) return existing;
  events.set(eventDefinition.key, eventDefinition);
  return eventDefinition;
}

export function getEvent(eventKey: string) {
  return events.get(eventKey);
}

export function listEvents() {
  return Array.from(events.values());
}
