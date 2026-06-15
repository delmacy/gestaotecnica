import { Capability } from "./schemas";
import { CAPABILITY_DOMAINS, CAPABILITY_GROUPS } from "./catalog";

export const EXAMPLE_CAPABILITIES: Capability[] = [
  {
    id: "cap-work-req-001",
    key: "manage-work-request",
    name: "Manage Work Request",
    description: "Capability to receive, validate, and prioritize work requests from various sources.",
    domain: CAPABILITY_DOMAINS.WORK_EXECUTION,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "work-request", name: "Work Request", description: "The core request for work to be performed." }
    ],
    businessActions: [
      { key: "create-request", name: "Create Request" },
      { key: "validate-request", name: "Validate Request" },
      { key: "prioritize-request", name: "Prioritize Request" }
    ],
    businessEvents: [
      { key: "request-received", name: "Request Received" },
      { key: "request-validated", name: "Request Validated" }
    ],
    businessRules: [
      { key: "priority-calc", name: "Priority Calculation Rule", description: "Rule to calculate priority based on urgency and impact." }
    ],
    roles: [
      { key: "requester", name: "Requester" },
      { key: "coordinator", name: "Work Coordinator" }
    ],
    inputs: [
      { key: "request-data", type: "object", required: true }
    ],
    outputs: [
      { key: "validated-request", type: "object", required: true }
    ],
    dependencies: [],
    relatedCapabilities: ["schedule-resource"],
    applicableSectors: ["industry", "services", "health"],
    metadata: {}
  },
  {
    id: "cap-sched-res-001",
    key: "schedule-resource",
    name: "Schedule Resource",
    description: "Capability to allocate resources (human or material) to tasks over time.",
    domain: CAPABILITY_DOMAINS.SCHEDULE_AVAILABILITY,
    group: CAPABILITY_GROUPS.RESOURCE_OPTIMIZATION,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "schedule", name: "Schedule" },
      { key: "resource-allocation", name: "Resource Allocation" }
    ],
    businessActions: [
      { key: "allocate-resource", name: "Allocate Resource" },
      { key: "release-resource", name: "Release Resource" }
    ],
    businessEvents: [
      { key: "resource-scheduled", name: "Resource Scheduled" }
    ],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: ["manage-work-request"],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-asset-001",
    key: "manage-asset",
    name: "Manage Asset",
    description: "Capability to track lifecycle and status of physical or digital assets.",
    domain: CAPABILITY_DOMAINS.ASSETS_MAINTENANCE,
    group: CAPABILITY_GROUPS.CORE_MANAGEMENT,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "asset", name: "Asset" }
    ],
    businessActions: [
      { key: "register-asset", name: "Register Asset" },
      { key: "update-asset-status", name: "Update Asset Status" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["industry", "facilities"],
    metadata: {}
  },
  {
    id: "cap-inv-001",
    key: "control-inventory",
    name: "Control Inventory",
    description: "Capability to manage stock levels, locations, and movements of materials.",
    domain: CAPABILITY_DOMAINS.INVENTORY_MATERIALS,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "inventory-item", name: "Inventory Item" },
      { key: "stock-level", name: "Stock Level" }
    ],
    businessActions: [
      { key: "adjust-stock", name: "Adjust Stock" },
      { key: "transfer-stock", name: "Transfer Stock" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["retail", "industry", "health"],
    metadata: {}
  },
  {
    id: "cap-proc-001",
    key: "procure-item",
    name: "Procure Item",
    description: "Capability to manage the acquisition of items or services from suppliers.",
    domain: CAPABILITY_DOMAINS.PROCUREMENT_SUPPLIERS,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "purchase-requisition", name: "Purchase Requisition" },
      { key: "purchase-order", name: "Purchase Order" }
    ],
    businessActions: [
      { key: "create-requisition", name: "Create Requisition" },
      { key: "approve-order", name: "Approve Order" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-fin-001",
    key: "issue-invoice",
    name: "Issue Invoice",
    description: "Capability to generate and send billing documents for services or goods.",
    domain: CAPABILITY_DOMAINS.FINANCIAL,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "invoice", name: "Invoice" }
    ],
    businessActions: [
      { key: "generate-invoice", name: "Generate Invoice" },
      { key: "cancel-invoice", name: "Cancel Invoice" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-crm-001",
    key: "manage-customer",
    name: "Manage Customer",
    description: "Capability to maintain customer profiles and relationship history.",
    domain: CAPABILITY_DOMAINS.SALES_RELATIONSHIP,
    group: CAPABILITY_GROUPS.CORE_MANAGEMENT,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "customer-profile", name: "Customer Profile" }
    ],
    businessActions: [
      { key: "register-customer", name: "Register Customer" },
      { key: "update-preferences", name: "Update Preferences" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-doc-001",
    key: "manage-document",
    name: "Manage Document",
    description: "Capability to store, version, and control access to documents.",
    domain: CAPABILITY_DOMAINS.DOCUMENTS_RECORDS,
    group: CAPABILITY_GROUPS.SUPPORT_SERVICES,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "document", name: "Document" },
      { key: "document-version", name: "Document Version" }
    ],
    businessActions: [
      { key: "upload-document", name: "Upload Document" },
      { key: "archive-document", name: "Archive Document" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-qual-001",
    key: "conduct-inspection",
    name: "Conduct Inspection",
    description: "Capability to verify compliance of objects or processes against standards.",
    domain: CAPABILITY_DOMAINS.QUALITY_COMPLIANCE,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "inspection-checklist", name: "Inspection Checklist" },
      { key: "inspection-report", name: "Inspection Report" }
    ],
    businessActions: [
      { key: "perform-inspection", name: "Perform Inspection" },
      { key: "record-finding", name: "Record Finding" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["industry", "health", "services"],
    metadata: {}
  },
  {
    id: "cap-edu-001",
    key: "train-person",
    name: "Train Person",
    description: "Capability to deliver and track educational content and certifications.",
    domain: CAPABILITY_DOMAINS.EDUCATION_TRAINING,
    group: CAPABILITY_GROUPS.SUPPORT_SERVICES,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "training-program", name: "Training Program" },
      { key: "certification", name: "Certification" }
    ],
    businessActions: [
      { key: "enroll-student", name: "Enroll Student" },
      { key: "issue-certificate", name: "Issue Certificate" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  },
  {
    id: "cap-health-001",
    key: "record-clinical-service",
    name: "Record Clinical Service",
    description: "Capability to document medical procedures and clinical observations.",
    domain: CAPABILITY_DOMAINS.HEALTH_CLINICAL,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "clinical-record", name: "Clinical Record" }
    ],
    businessActions: [
      { key: "record-observation", name: "Record Observation" },
      { key: "prescribe-treatment", name: "Prescribe Treatment" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["health"],
    metadata: {}
  },
  {
    id: "cap-data-001",
    key: "analyze-operational-data",
    name: "Analyze Operational Data",
    description: "Capability to process and visualize operational metrics for decision support.",
    domain: CAPABILITY_DOMAINS.DATA_ANALYSIS,
    group: CAPABILITY_GROUPS.STRATEGIC_PLANNING,
    version: "1.0.0",
    status: "active",
    businessObjects: [
      { key: "data-dashboard", name: "Data Dashboard" },
      { key: "operational-metric", name: "Operational Metric" }
    ],
    businessActions: [
      { key: "generate-report", name: "Generate Report" },
      { key: "calculate-kpi", name: "Calculate KPI" }
    ],
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: [],
    applicableSectors: ["all"],
    metadata: {}
  }
];
