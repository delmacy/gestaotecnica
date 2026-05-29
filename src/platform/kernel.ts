import { approvalsManifest } from "@/modules/approvals/manifest";
import {
  requestApprovalKernelAction,
  decideApprovalKernelAction,
} from "@/modules/approvals/kernel-actions";
import { automationsManifest } from "@/modules/automations/manifest";
import { runAutomationKernelAction } from "@/modules/automations/kernel-actions";
import { assetsManifest } from "@/modules/assets/manifest";
import {
  createAssetKernelAction,
  updateAssetStatusKernelAction,
} from "@/modules/assets/kernel-actions";
import { documentsManifest } from "@/modules/documents/manifest";
import {
  generateDocumentKernelAction,
  transitionDocumentKernelAction,
} from "@/modules/documents/kernel-actions";
import { evidencesManifest } from "@/modules/evidences/manifest";
import { attachEvidenceKernelAction } from "@/modules/evidences/kernel-actions";
import { legacyManifest } from "@/modules/legacy/manifest";
import { createLegacyRecordKernelAction } from "@/modules/legacy/kernel-actions";
import { notificationsManifest } from "@/modules/notifications/manifest";
import { sendNotificationKernelAction } from "@/modules/notifications/kernel-actions";
import { reportsManifest } from "@/modules/reports/manifest";
import { generateOperationalReportKernelAction } from "@/modules/reports/kernel-actions";
import { serviceOrdersManifest } from "@/modules/service-orders/manifest";
import {
  completeServiceOrderKernelAction,
  createServiceOrderKernelAction,
} from "@/modules/service-orders/kernel-actions";
import { schedulesManifest } from "@/modules/schedules/manifest";
import { createScheduleKernelAction } from "@/modules/schedules/kernel-actions";
import { maintenancePlansManifest } from "@/modules/maintenance-plans/manifest";
import {
  createMaintenancePlanKernelAction,
  generateMaintenanceOrderKernelAction,
} from "@/modules/maintenance-plans/kernel-actions";
import { shiftsManifest } from "@/modules/shifts/manifest";
import {
  addShiftLogEntryKernelAction,
  closeShiftKernelAction,
  openShiftKernelAction,
} from "@/modules/shifts/kernel-actions";
import { workItemsManifest } from "@/modules/work-items/manifest";
import {
  createWorkItemKernelAction,
  transitionWorkItemKernelAction,
} from "@/modules/work-items/kernel-actions";
import { workforceManifest } from "@/modules/workforce/manifest";
import {
  createTeamKernelAction,
  createTechnicianKernelAction,
} from "@/modules/workforce/kernel-actions";
import { globalSearchManifest } from "@/modules/global-search/manifest";
import { globalSearchKernelAction } from "@/modules/global-search/kernel-actions";
import { dashboardManifest } from "@/modules/dashboard/manifest";
import { getDashboardSummaryKernelAction } from "@/modules/dashboard/kernel-actions";
import { registerAction } from "@/platform/actions";
import { registerDefaultEvents } from "@/platform/events/default-events";
import { registerModule } from "@/platform/modules";

let initialized = false;

export function initializePlatformKernel() {
  if (initialized) return;

  registerModule(workItemsManifest);
  registerModule(serviceOrdersManifest);
  registerModule(notificationsManifest);
  registerModule(assetsManifest);
  registerModule(workforceManifest);
  registerModule(schedulesManifest);
  registerModule(maintenancePlansManifest);
  registerModule(globalSearchManifest);
  registerModule(dashboardManifest);
  registerModule(reportsManifest);
  registerModule(automationsManifest);
  registerModule(documentsManifest);
  registerModule(legacyManifest);
  registerModule(shiftsManifest);
  registerModule(evidencesManifest);
  registerModule(approvalsManifest);

  registerDefaultEvents();

  registerAction(createWorkItemKernelAction);
  registerAction(transitionWorkItemKernelAction);
  registerAction(createServiceOrderKernelAction);
  registerAction(completeServiceOrderKernelAction);
  registerAction(sendNotificationKernelAction);
  registerAction(createAssetKernelAction);
  registerAction(updateAssetStatusKernelAction);
  registerAction(generateOperationalReportKernelAction);
  registerAction(runAutomationKernelAction);
  registerAction(generateDocumentKernelAction);
  registerAction(transitionDocumentKernelAction);
  registerAction(createLegacyRecordKernelAction);
  registerAction(addShiftLogEntryKernelAction);
  registerAction(createScheduleKernelAction);
  registerAction(createMaintenancePlanKernelAction);
  registerAction(generateMaintenanceOrderKernelAction);
  registerAction(openShiftKernelAction);
  registerAction(closeShiftKernelAction);
  registerAction(createTechnicianKernelAction);
  registerAction(createTeamKernelAction);
  registerAction(globalSearchKernelAction);
  registerAction(getDashboardSummaryKernelAction);
  registerAction(attachEvidenceKernelAction);
  registerAction(requestApprovalKernelAction);
  registerAction(decideApprovalKernelAction);

  initialized = true;
}
