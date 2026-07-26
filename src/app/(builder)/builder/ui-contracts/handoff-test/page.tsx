import { Metadata } from "next";
import { HandoffTest } from "@/components/builder/ui-contracts/HandoffTest";

export const metadata: Metadata = {
  title: "Handoff Test | Builder UI Contracts",
};

export default function HandoffTestPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Builder to Runtime Handoff</h1>
      <p className="text-muted-foreground mb-8">
        This is a testing ground for the Builder to Runtime Handoff. It allows verifying the handoff states (empty, blocked, demo, synthetic, live) per the contract.
      </p>

      <HandoffTest />
    </div>
  );
}
