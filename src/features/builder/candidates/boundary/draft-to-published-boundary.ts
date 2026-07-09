export type DraftToPublishedTransitionContext = {
    isTransition: boolean;
    reason?: string;
};

export function checkDraftToPublishedBoundary(
    currentStatus: string,
    targetStatus: string
): DraftToPublishedTransitionContext {
    if (currentStatus === "draft" && targetStatus === "published") {
        return { isTransition: true };
    }

    return {
        isTransition: false,
        reason: `Invalid transition from ${currentStatus} to ${targetStatus}`
    };
}
