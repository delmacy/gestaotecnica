import { runtimeDb } from "@/db";
import { notifications } from "@/db/runtime/schema/notifications";
import { WorkflowRepository } from "@/platform/workflow-engine/infra/workflow.repository";
import { eq } from "drizzle-orm";

export class NotificationService {
  private workflowRepo: WorkflowRepository;

  constructor() {
    this.workflowRepo = new WorkflowRepository();
  }

  async sendNotification(params: {
    workspaceId: string;
    recipientUserId?: string;
    recipientRoleId?: string;
    processInstanceId?: string;
    title: string;
    message: string;
    actorId?: string;
  }) {
    const [notification] = await runtimeDb.insert(notifications).values({
      workspaceId: params.workspaceId,
      recipientUserId: params.recipientUserId,
      recipientRoleId: params.recipientRoleId,
      processInstanceId: params.processInstanceId,
      title: params.title,
      message: params.message,
      status: "unread",
    }).returning();

    if (params.processInstanceId) {
      await this.workflowRepo.appendEvent({
        workspaceId: params.workspaceId,
        instanceId: params.processInstanceId,
        eventType: "NOTIFICATION_SENT",
        actorId: params.actorId,
        payload: { notificationId: notification.id, title: params.title },
      });
    }

    return notification;
  }

  async markAsRead(notificationId: string) {
    await runtimeDb.update(notifications)
      .set({
        status: "read",
        readAt: new Date()
      })
      .where(eq(notifications.id, notificationId));
  }
}
