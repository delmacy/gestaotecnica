"use client";

import { OperatorWarning } from "./operator-guide-types";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

export function OperatorWarnings({ warnings }: { warnings: OperatorWarning[] }) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  const getAlertStyles = (level: "info" | "warning" | "critical") => {
    switch (level) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: <div title="Critical Warning"><AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" /></div>,
        };
      case "warning":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: <div title="Warning"><AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" /></div>,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: <div title="Info"><Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /></div>,
        };
    }
  };

  return (
    <div className="mb-6 space-y-3">
      {warnings.map((warning) => {
        const styles = getAlertStyles(warning.level);
        return (
          <div
            key={warning.id}
            className={`flex items-start gap-3 p-4 border rounded-md ${styles.bg} ${styles.border}`}
          >
            {styles.icon}
            <div>
              <h4 className={`font-semibold text-sm ${styles.text} mb-1 capitalize`}>
                {warning.level === "critical" ? "Aviso Crítico" : warning.level}
              </h4>
              <p className={`text-sm ${styles.text} opacity-90`}>{warning.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
