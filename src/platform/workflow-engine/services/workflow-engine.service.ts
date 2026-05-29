import { WorkflowRepository } from "../infra/workflow.repository";
import { ActionExecutorService } from "./action-executor.service";
import { ActionResult } from "../domain/types";

export class WorkflowEngineService {
  private repository: WorkflowRepository;
  private actionExecutor: ActionExecutorService;

  constructor() {
    this.repository = new WorkflowRepository();
    this.actionExecutor = new ActionExecutorService();
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

    // 1. Execute the implementation
    const result = await this.actionExecutor.execute({
      workspaceId: params.workspaceId,
      instanceId: params.instanceId,
      actionKey: params.actionKey,
      actorId: params.actorId,
      input: params.inputPayload,
    });

    if (!result.success) {
      return result;
    }

    // 2. Update Payload
    if (Object.keys(params.inputPayload).length > 0) {
      const currentPayload = await this.repository.getPayload(params.instanceId);
      const newData = { ...((currentPayload?.data as Record<string, unknown>) || {}), ...params.inputPayload };
      await this.repository.updatePayload(params.instanceId, newData);

      await this.repository.appendEvent({
        workspaceId: params.workspaceId,
        instanceId: params.instanceId,
        eventType: "PAYLOAD_UPDATED",
        actorId: params.actorId,
        payload: { diff: params.inputPayload },
      });
    }

    // 3. Handle Transition if action is linked to one
    if (actionDefinition.transitionId) {
      // For now, we manually handle state change based on transitionId
      // In Phase 11/12, transitions table already defines toStateId
      // Let's implement a simple state update
      // (This should ideally be in its own service)
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

    return result;
  }
}
