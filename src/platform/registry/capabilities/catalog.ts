/**
 * Initial Domains for the Capability Catalog
 */
export const CAPABILITY_DOMAINS = {
  IDENTITY_ACCESS: "identity-access",
  ORGANIZATION_PEOPLE: "organization-people",
  ATTENDANCE_REQUESTS: "attendance-requests",
  WORK_EXECUTION: "work-execution",
  ASSETS_MAINTENANCE: "assets-maintenance",
  INVENTORY_MATERIALS: "inventory-materials",
  PROCUREMENT_SUPPLIERS: "procurement-suppliers",
  SALES_RELATIONSHIP: "sales-relationship",
  FINANCIAL: "financial",
  DOCUMENTS_RECORDS: "documents-records",
  SCHEDULE_AVAILABILITY: "schedule-availability",
  QUALITY_COMPLIANCE: "quality-compliance",
  COMMUNICATION_NOTIFICATIONS: "communication-notifications",
  DATA_ANALYSIS: "data-analysis",
  EDUCATION_TRAINING: "education-training",
  HEALTH_CLINICAL: "health-clinical",
} as const;

/**
 * Initial Groups for the Capability Catalog
 */
export const CAPABILITY_GROUPS = {
  CORE_MANAGEMENT: "core-management",
  OPERATIONAL_CONTROL: "operational-control",
  RESOURCE_OPTIMIZATION: "resource-optimization",
  STRATEGIC_PLANNING: "strategic-planning",
  SUPPORT_SERVICES: "support-services",
} as const;
