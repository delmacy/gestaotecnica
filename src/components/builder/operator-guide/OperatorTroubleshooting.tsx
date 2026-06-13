"use client";

import { OperatorTroubleshootingItem } from "./operator-guide-types";
import { useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";

export function OperatorTroubleshooting({
  items,
}: {
  items: OperatorTroubleshootingItem[];
}) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) {
    return null;
  }

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div title="Troubleshooting">
            <HelpCircle className="w-5 h-5 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800">Troubleshooting</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-md overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:bg-slate-50"
            >
              <span className="font-medium text-slate-700 text-sm">
                {item.problem_statement}
              </span>
              <div className="text-slate-400">
                {expandedItems[item.id] ? (
                  <div title="Collapse">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                ) : (
                  <div title="Expand">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
            {expandedItems[item.id] && (
              <div className="p-3 pt-0 border-t border-slate-100 bg-slate-50/50">
                <ol className="list-decimal pl-5 space-y-1 mt-3">
                  {item.solution_steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-slate-600">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
