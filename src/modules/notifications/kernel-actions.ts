import type { ActionDefinition } from "@/platform/actions";

type SendNotificationInput = {
  recipientRole?: string;
  recipientUserId?: string;
  title?: string;
  message?: string;
};

export const sendNotificationKernelAction: ActionDefinition<SendNotificationInput, { delivered: boolean }> = {
  key: "notifications.send",
  moduleKey: "notifications",
  description: "Envia uma notificacao logica.",
  callableBy: ["automation", "system"],
  emits: ["notification.sent"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    const message = String(input.message ?? "").trim();
    if (!title || !message) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e message sao obrigatorios." },
      };
    }

    console.info("[notifications.send]", {
      recipientRole: input.recipientRole,
      recipientUserId: input.recipientUserId,
      title,
      message,
    });

    return {
      success: true,
      data: { delivered: true },
      events: [
        {
          eventType: "notification.sent",
          entityType: "notification",
          entityId: globalThis.crypto?.randomUUID?.() ?? "notification",
          payload: {
            recipientRole: input.recipientRole,
            recipientUserId: input.recipientUserId,
            title,
            message,
          },
        },
      ],
    };
  },
};
