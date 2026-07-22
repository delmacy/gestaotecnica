import type { CapabilityItem } from "../capabilities/contracts/capability-item";

export type DbCapability = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function mapDbCapabilityToCapabilityItem(dbRow: DbCapability): CapabilityItem {
  return {
    id: dbRow.id,
    slug: dbRow.key,
    name: dbRow.name,
    description: dbRow.description || "",
    category: "foundation", // Default fallback since it's missing in DB
    core_business: false, // Default fallback
    mvp_priority: "medium", // Default fallback
    status: dbRow.isActive ? "documented" : "future",
    depends_on: [],
    used_by: [],
    owns_entities: [],
    does_not_own: [],
    main_processes: [],
    main_events: [],
    related_docs: [],
    boundary_risk: [],
    install_state: "available",
    synthetic_notes: "Real data from DB",
  };
}
