import React from "react";
import { UiContractsViewer } from "@/components/builder/ui-contracts/UiContractsViewer";

export const metadata = {
  title: "UI Contracts Viewer | System Builder",
  description: "Visualização e gestão estática de contratos de UI da plataforma System Builder",
};

export default function UiContractsPage() {
  return <UiContractsViewer />;
}
