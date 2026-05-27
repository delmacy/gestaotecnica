export type ModuleManifest = {
  key: string;
  name: string;
  description?: string;
  actions?: string[];
  events?: string[];
  views?: string[];
  dependencies?: string[];
};
