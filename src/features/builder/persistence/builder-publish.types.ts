export type PublishBuilderProcessInput = {
  workspaceId: string;
  processDefinitionId: string;
  processVersionId: string;
  publishedBy?: string;
};

export type PublishBuilderProcessResult =
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
