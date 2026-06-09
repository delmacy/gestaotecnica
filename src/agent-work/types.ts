import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "./schema";

export type AgentDomain = InferSelectModel<typeof schema.agentDomains>;
export type JulesWorker = InferSelectModel<typeof schema.julesWorkers>;
export type AgentWorkJob = InferSelectModel<typeof schema.agentWorkJobs>;
export type AgentTaskBox = InferSelectModel<typeof schema.agentTaskBoxes>;
export type AgentWorkTask = InferSelectModel<typeof schema.agentWorkTasks>;
export type AgentWorkClaim = InferSelectModel<typeof schema.agentWorkClaims>;
export type AgentWorkEvent = InferSelectModel<typeof schema.agentWorkEvents>;
export type AgentMarkdownSource = InferSelectModel<typeof schema.agentMarkdownSources>;

export interface TaskKit {
  worker: JulesWorker;
  domain: AgentDomain;
  activeClaims: AgentWorkClaim[];
  jobs: {
    job: AgentWorkJob;
    boxes: {
      box: AgentTaskBox;
      tasks: AgentWorkTask[];
    }[];
  }[];
}
