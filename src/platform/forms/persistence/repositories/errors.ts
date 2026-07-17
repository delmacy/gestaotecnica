export class WorkspaceDivergenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceDivergenceError";
  }
}
