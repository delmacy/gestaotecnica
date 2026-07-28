import { ServiceOrderCompletedNotificationFlow } from "@/adaptations/secao-tecnica/flows/service-order-completed-notification.flow";
import { WorkItemAutoServiceOrderFlow } from "@/adaptations/secao-tecnica/flows/work-item-auto-service-order.flow";
import {
  ServiceOrderGovernanceFlow,
  ServiceOrderApprovedDocumentFlow,
  PeriodicMaintenanceGeneratorFlow,
  InventoryUsageFlow,
} from "@/adaptations/secao-tecnica/flows/service-order-governance.flow";
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
import { inventoryManifest } from "@/modules/inventory/manifest";
import { adjustStockKernelAction } from "@/modules/inventory/kernel-actions";
import { complianceManifest } from "@/modules/compliance/manifest";
import { createAuditKernelAction } from "@/modules/compliance/kernel-actions";
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
import { workIntakeManifest } from "@/modules/work-intake/manifest";
import {
  captureIntakeKernelAction,
  transitionIntakeKernelAction,
} from "@/modules/work-intake/kernel-actions";
import { globalSearchManifest } from "@/modules/global-search/manifest";
import { globalSearchKernelAction } from "@/modules/global-search/kernel-actions";
import { dashboardManifest } from "@/modules/dashboard/manifest";
import { getDashboardSummaryKernelAction } from "@/modules/dashboard/kernel-actions";
import { workspaceConfigManifest } from "@/modules/workspace-config/manifest";
import { toggleModuleKernelAction } from "@/modules/workspace-config/kernel-actions";
import {
  saveBlueprintDraftKernelAction,
  getLatestBlueprintKernelAction
} from "@/platform/blueprints/actions/kernel-actions";
import { listCapabilitiesKernelAction } from "@/platform/registry/actions/kernel-actions";
import {
  createOrganizationKernelAction,
  updateOrganizationKernelAction,
  createWorkspaceKernelAction,
  updateWorkspaceKernelAction,
  installCapabilityKernelAction,
  publishWorkspaceKernelAction,
  createEntityKernelAction,
  saveDynamicRecordKernelAction
} from "@/platform/workspace/application/kernel-actions";
import {
  saveProcessDefinitionKernelAction,
  getProcessDefinitionKernelAction,
  saveFlowDefinitionKernelAction,
  getFlowDefinitionKernelAction,
  publishFlowKernelAction,
  deleteFlowKernelAction
} from "@/platform/workflows/application/kernel-actions";
import {
  saveViewDefinitionKernelAction,
  getViewDefinitionKernelAction,
} from "@/platform/views/application/kernel-actions";
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
  registerModule(workforceManifest);
  registerModule(schedulesManifest);
  registerModule(maintenancePlansManifest);
  registerModule(inventoryManifest);
  registerModule(complianceManifest);
  registerModule(globalSearchManifest);
  registerModule(dashboardManifest);
  registerModule(workspaceConfigManifest);
  registerModule(reportsManifest);
  registerModule(automationsManifest);
  registerModule(documentsManifest);
  registerModule(legacyManifest);
  registerModule(shiftsManifest);
  registerModule(evidencesManifest);
  registerModule(approvalsManifest);
  registerModule(workIntakeManifest);

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
  registerAction(adjustStockKernelAction);
  registerAction(createAuditKernelAction);
  registerAction(openShiftKernelAction);
  registerAction(closeShiftKernelAction);
  registerAction(createTechnicianKernelAction);
  registerAction(createTeamKernelAction);
  registerAction(globalSearchKernelAction);
  registerAction(getDashboardSummaryKernelAction);
  registerAction(toggleModuleKernelAction);
  registerAction(attachEvidenceKernelAction);
  registerAction(requestApprovalKernelAction);
  registerAction(decideApprovalKernelAction);
  registerAction(saveBlueprintDraftKernelAction);
  registerAction(getLatestBlueprintKernelAction);
  registerAction(listCapabilitiesKernelAction);
  registerAction(createOrganizationKernelAction);
  registerAction(updateOrganizationKernelAction);
  registerAction(createWorkspaceKernelAction);
  registerAction(updateWorkspaceKernelAction);
  registerAction(installCapabilityKernelAction);
  registerAction(publishWorkspaceKernelAction);
  registerAction(createEntityKernelAction);
  registerAction(saveDynamicRecordKernelAction);
  registerAction(saveProcessDefinitionKernelAction);
  registerAction(getProcessDefinitionKernelAction);
  registerAction(saveFlowDefinitionKernelAction);
  registerAction(getFlowDefinitionKernelAction);
  registerAction(publishFlowKernelAction);
  registerAction(deleteFlowKernelAction);
  registerAction(saveViewDefinitionKernelAction);
  registerAction(getViewDefinitionKernelAction);
  registerAction(captureIntakeKernelAction);
  registerAction(transitionIntakeKernelAction);

  registerFlow(new ServiceOrderCompletedNotificationFlow());
  registerFlow(new WorkItemAutoServiceOrderFlow());
  registerFlow(new ServiceOrderGovernanceFlow());
  registerFlow(new ServiceOrderApprovedDocumentFlow());
  registerFlow(new PeriodicMaintenanceGeneratorFlow());
  registerFlow(new InventoryUsageFlow());

  initialized = true;
}
