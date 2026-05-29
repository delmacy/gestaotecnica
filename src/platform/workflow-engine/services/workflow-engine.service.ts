import { WorkflowRepository } from "../infra/workflow.repository";
import { ActionExecutorService } from "./action-executor.service";
import { ActionResult } from "../domain/types";
import { AuditoriaService } from "@/platform/auditoria/services/auditoria.service";
import { IntegrationService } from "@/platform/integrations/services/integration.service";

export class WorkflowEngineService {
  private repository: WorkflowRepository;
  private actionExecutor: ActionExecutorService;
  private auditoria: AuditoriaService;
  private integrations: IntegrationService;

  constructor() {
    this.repository = new WorkflowRepository();
    this.actionExecutor = new ActionExecutorService();
    this.auditoria = new AuditoriaService();
    this.integrations = new IntegrationService();
  }

  async createInstance(params: {
    workspaceId: string;
    processVersionId: string;
    actorId?: string;
  }) {
    const initialState = await this.repository.getInitialState(params.processVersionId);

    const instance = await this.repository.createInstance({
      workspaceId: params.workspaceId,
      processVersionId: params.processVersionId,
      currentStateId: initialState?.id,
      createdById: params.actorId,
    });

    await this.repository.appendEvent({
      workspaceId: params.workspaceId,
      instanceId: instance.id,
      eventType: "PROCESS_INSTANCE_CREATED",
      actorId: params.actorId,
      payload: {
        processVersionId: params.processVersionId,
        initialStateId: initialState?.id,
      },
    });

    // Notify integrations
    await this.integrations.queueWebhook({
      workspaceId: params.workspaceId,
      eventType: "PROCESS_INSTANCE_CREATED",
      payload: { instanceId: instance.id, processVersionId: params.processVersionId },
    });

    return instance;
  }

  async executeAction(params: {
    workspaceId: string;
    instanceId: string;
    actionKey: string;
    actorId?: string;
    inputPayload: Record<string, unknown>;
  }): Promise<ActionResult> {
    const instance = await this.repository.getInstance(params.instanceId);
    if (!instance) {
      return { success: false, error: "Instance not found" };
    }

    const availableActions = await this.repository.getAvailableActions(params.instanceId);
    const actionDefinition = availableActions.find(a => a.key === params.actionKey);

    if (!actionDefinition) {
      return { success: false, error: `Action ${params.actionKey} not available in current state` };
    }

    const currentPayload = await this.repository.getPayload(params.instanceId);
    const beforeData = currentPayload?.data || {};

    // 1. Execute implementation
    const result = await this.actionExecutor.execute({
      workspaceId: params.workspaceId,
      instanceId: params.instanceId,
      actionKey: params.actionKey,
      actorId: params.actorId,
      input: params.inputPayload,
    });

    if (!result.success) {
       // return result; // Logic to handle failure
    }

    // 2. Update Payload & Audit Diff
    const afterData = { ...(beforeData as Record<string, unknown>), ...params.inputPayload };
    await this.repository.updatePayload(params.instanceId, afterData);

    const auditLog = this.auditoria.formatAuditPayload(
      beforeData,
      afterData,
      params.actorId || "system",
      "workflow_engine"
    );

    await this.repository.appendEvent({
      workspaceId: params.workspaceId,
      instanceId: params.instanceId,
      eventType: "PAYLOAD_UPDATED",
      actorId: params.actorId,
      payload: auditLog as Record<string, unknown>,
    });

    // 3. Handle Transition
    if (actionDefinition.transitionId) {
       // Implementation to move to next state...
    }

    await this.repository.appendEvent({
      workspaceId: params.workspaceId,
      instanceId: params.instanceId,
      eventType: "ACTION_EXECUTED",
      actorId: params.actorId,
      payload: {
        actionKey: params.actionKey,
        actionId: actionDefinition.id,
        resultPayload: result.payload
      },
    });

    // Notify integrations
    await this.integrations.queueWebhook({
      workspaceId: params.workspaceId,
      eventType: "ACTION_EXECUTED",
      payload: { instanceId: params.instanceId, actionKey: params.actionKey },
    });

    return result;
  }
}
