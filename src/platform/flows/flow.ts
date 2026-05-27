import type { FlowContext } from "./flow-context";

export type FlowTrigger = {
  eventType: string;
};

export abstract class Flow {
  abstract key: string;
  abstract name: string;
  abstract trigger: FlowTrigger;
  version?: string;

  abstract run(context: FlowContext): Promise<void>;
}
