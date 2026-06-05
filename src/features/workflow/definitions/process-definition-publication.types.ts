export type PublishProcessVersionInput = {
  processDefinitionId: string;
  processVersionId: string;
  workspaceId: string;
  publishedBy?: string;
};

export type PublishProcessVersionResult =
  | {
      ok: true;
      data: {
        processDefinitionId: string;
        processVersionId: string;
        status: "published";
        publishedAt: string;
      };
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };
