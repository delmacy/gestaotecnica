import { OnboardingEvidence, OnboardingEvidenceSchema } from "../contracts/onboarding-evidence";

export class OnboardingService {
  private static STORAGE_KEY = "admin_onboarding_evidence";

  static saveEvidence(evidence: Omit<OnboardingEvidence, "id" | "timestamp">): OnboardingEvidence {
    const fullEvidence: OnboardingEvidence = {
      ...evidence,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    OnboardingEvidenceSchema.parse(fullEvidence);

    // In a real environment, this might be a database or a server-side API call.
    // We are simulating persistence via localStorage or a simple in-memory fallback.
    if (typeof window !== "undefined" && window.localStorage) {
      const existing = this.getEvidences();
      existing.push(fullEvidence);
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
    }

    return fullEvidence;
  }

  static getEvidences(): OnboardingEvidence[] {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = window.localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        try {
          return JSON.parse(data) as OnboardingEvidence[];
        } catch {
          return [];
        }
      }
    }
    return [];
  }
}
