import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type SendNotificationInput = {
  recipientRole?: string;
  recipientUserId?: string;
  title?: string;
  message?: string;
};

export const sendNotificationKernelAction: ActionDefinition<SendNotificationInput, { delivered: boolean }> = {
  key: "notifications.send",
  moduleKey: "notifications",
  description: "Envia uma notificação lógica.",
  callableBy: ["automation", "system"],
  inputSchema: actionObjectSchema(
    {
      recipientRole: stringProperty("Papel destinatário."),
      recipientUserId: uuidProperty("Usuário destinatário."),
      title: stringProperty("Título da notificação."),
      message: stringProperty("Mensagem da notificação."),
    },
    ["title", "message"],
  ),
  outputSchema: actionObjectSchema({
    delivered: { type: "boolean", description: "Indica se a notificação foi processada." },
  }),
  emits: ["notification.sent"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    const message = String(input.message ?? "").trim();
    if (!title || !message) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e message sao obrigatórios." },
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

