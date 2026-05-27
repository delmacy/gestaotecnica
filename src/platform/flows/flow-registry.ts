import type { Flow } from "./flow";

const flows = new Map<string, Flow>();

export function registerFlow(flow: Flow) {
  const existing = flows.get(flow.key);
  if (existing) return existing;
  flows.set(flow.key, flow);
  return flow;
}

export function getFlowsByEvent(eventType: string) {
  return Array.from(flows.values()).filter((flow) => flow.trigger.eventType === eventType);
}

export function listFlows() {
  return Array.from(flows.values());
}
