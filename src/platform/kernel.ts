import { ServiceOrderCompletedNotificationFlow } from "@/adaptations/secao-tecnica/flows/service-order-completed-notification.flow";
import { automationsManifest } from "@/modules/automations/manifest";
import { runAutomationKernelAction } from "@/modules/automations/kernel-actions";
import { assetsManifest } from "@/modules/assets/manifest";
import { createAssetKernelAction } from "@/modules/assets/kernel-actions";
import { notificationsManifest } from "@/modules/notifications/manifest";
import { sendNotificationKernelAction } from "@/modules/notifications/kernel-actions";
import { reportsManifest } from "@/modules/reports/manifest";
import { generateOperationalReportKernelAction } from "@/modules/reports/kernel-actions";
import { serviceOrdersManifest } from "@/modules/service-orders/manifest";
import { completeServiceOrderKernelAction } from "@/modules/service-orders/kernel-actions";
import { workItemsManifest } from "@/modules/work-items/manifest";
import { createWorkItemKernelAction } from "@/modules/work-items/kernel-actions";
import { registerAction } from "@/platform/actions";
import { registerDefaultEvents } from "@/platform/events/default-events";
import { registerFlow } from "@/platform/flows";
import { registerModule } from "@/platform/modules";

let initialized = false;

export function initializePlatformKernel() {
  if (initialized) return;

    registerModule(workItemsManifest);
    registerModule(serviceOrdersManifest);
    registerModule(notificationsManifest);
    registerModule(assetsManifest);
    registerModule(reportsManifest);
    registerModule(automationsManifest);

    registerDefaultEvents();

    registerAction(createWorkItemKernelAction);
    registerAction(completeServiceOrderKernelAction);
    registerAction(sendNotificationKernelAction);
    registerAction(createAssetKernelAction);
    registerAction(generateOperationalReportKernelAction);
    registerAction(runAutomationKernelAction);

    registerFlow(new ServiceOrderCompletedNotificationFlow());

  initialized = true;
}
