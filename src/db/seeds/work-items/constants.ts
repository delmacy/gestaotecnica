export const WORK_ITEMS_SEED = {
  organization: {
    key: "org_work_items",
    name: "Work Items Organization",
  },
  workspace: {
    key: "ws_work_items",
    name: "Work Items Workspace",
  },
  user: {
    email: "operator@workitems.local",
    name: "Work Items Operator",
  },
  module: {
    key: "work-items",
    name: "Work Items Module",
  },
  capabilities: [
    {
      key: "cap_work_items_view",
      name: "View Work Items",
      description: "Allow viewing work items",
    },
    {
      key: "cap_work_items_manage",
      name: "Manage Work Items",
      description: "Allow managing work items",
    }
  ],
  item: {
    title: "Equipamento de TI Falho - Work Items Seed",
    description: "Solicitação para conserto de equipamento de TI com defeito.",
  }
};
