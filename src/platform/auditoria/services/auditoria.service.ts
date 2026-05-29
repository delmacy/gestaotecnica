import * as jsondiffpatch from "jsondiffpatch";

export class AuditoriaService {
  private differ = jsondiffpatch.create();

  calculateDiff(before: unknown, after: unknown) {
    return this.differ.diff(before, after);
  }

  formatAuditPayload(before: unknown, after: unknown, actor: string, origin: string) {
    return {
      before,
      after,
      diff: this.calculateDiff(before, after),
      actor,
      origin,
      timestamp: new Date().toISOString(),
    };
  }
}
