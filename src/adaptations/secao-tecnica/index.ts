import { assetTypes } from "./asset-types";
import { businessRoles } from "./roles";
import { demandTypes } from "./demand-types";
import { documentTemplates } from "./document-templates";
import { legacyConfig } from "./legacy";
import { queues } from "./queues";
import { reportTemplates } from "./report-templates";
import { serviceOrderTypes } from "./service-order-types";
import { shiftTypes } from "./shift-types";
import { terminology } from "./terminology";
import { workflows } from "./workflows";

export const secaoTecnicaAdaptation = {
  key: "secao-tecnica",
  name: "Secao Tecnica",
  workspaceName: "Sala Tecnica",
  terminology,
  demandTypes,
  serviceOrderTypes,
  assetTypes,
  shiftTypes,
  businessRoles,
  workflows,
  queues,
  reportTemplates,
  documentTemplates,
  legacyConfig,
} as const;

export type SecaoTecnicaAdaptation = typeof secaoTecnicaAdaptation;
