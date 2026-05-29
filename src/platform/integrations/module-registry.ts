import { getAcquisitionNeeds } from "@/modules/acquisitions/queries";
import { getAssetTypeOptions } from "@/modules/assets/queries";
import { getAssets } from "@/modules/assets/queries";
import { getAutomationRules, getAutomationRuns } from "@/modules/automations/queries";
import { getTechnicalDocuments } from "@/modules/documents/queries";
import { getEvents } from "@/modules/events/queries";
import { getLegacyRecords } from "@/modules/legacy/queries";
import { getMaintenancePlans } from "@/modules/maintenance-plans/queries";
import { getReports } from "@/modules/reports/queries";
import { getSchedules } from "@/modules/schedules/queries";
import { getServiceOrders } from "@/modules/service-orders/queries";
import { getShifts } from "@/modules/shifts/queries";
import { getTechnicalProjects } from "@/modules/technical-projects/queries";
import { getWorkItems } from "@/modules/work-items/queries";
import {
  getTechnicianUnavailabilities,
  getTechnicians,
  getWorkforceAllocations,
} from "@/modules/workforce/queries";

export const gatewayModules = [
  { key: "work-items", name: "Work Items", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "service-orders", name: "Service Orders", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "assets", name: "Assets", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "workforce", name: "Workforce", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "schedules", name: "Schedules", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "shifts", name: "Shifts", methods: ["GET"], packHints: ["operacoes-operacionais"] },
  { key: "documents", name: "Documents", methods: ["GET"], packHints: ["governanca-documental"] },
  { key: "reports", name: "Reports", methods: ["GET"], packHints: ["governanca-documental"] },
  { key: "legacy", name: "Legacy Records", methods: ["GET"], packHints: ["governanca-documental", "integracoes-automacoes"] },
  { key: "automations", name: "Automations", methods: ["GET"], packHints: ["integracoes-automacoes"] },
  { key: "events", name: "Events", methods: ["GET"], packHints: ["integracoes-automacoes"] },
  { key: "maintenance-plans", name: "Maintenance Plans", methods: ["GET"], packHints: ["planejamento-recursos"] },
  { key: "technical-projects", name: "Technical Projects", methods: ["GET"], packHints: ["planejamento-recursos"] },
  { key: "acquisitions", name: "Acquisitions", methods: ["GET"], packHints: ["planejamento-recursos"] },
  { key: "pdf", name: "PDF Gateway", methods: ["POST"], packHints: ["governanca-documental", "integracoes-automacoes"] },
] as const;

export async function readGatewayModule(moduleKey: string) {
  switch (moduleKey) {
    case "work-items":
      return getWorkItems();
    case "service-orders":
      return getServiceOrders();
    case "assets":
      return { assets: await getAssets(), assetTypes: await getAssetTypeOptions() };
    case "workforce":
      return {
        technicians: await getTechnicians(),
        allocations: await getWorkforceAllocations(),
        unavailabilities: await getTechnicianUnavailabilities(),
      };
    case "schedules":
      return getSchedules();
    case "shifts":
      return getShifts();
    case "documents":
      return getTechnicalDocuments();
    case "reports":
      return getReports();
    case "legacy":
      return getLegacyRecords();
    case "automations":
      return { rules: await getAutomationRules(), runs: await getAutomationRuns() };
    case "events":
      return getEvents();
    case "maintenance-plans":
      return getMaintenancePlans();
    case "technical-projects":
      return getTechnicalProjects();
    case "acquisitions":
      return getAcquisitionNeeds();
    default:
      return null;
  }
}
