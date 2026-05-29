export type ModuleManifest = {
  key: string;
  name: string;
  description?: string;
  operational: {
    capability: string;
    process: string;
    result: string;
    tracking: string;
    evolution: string;
    integrations: string[];
  };
  actions?: string[];
  events?: string[];
  views?: string[];
  dependencies?: string[];
};
