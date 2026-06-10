import React, { useState } from "react";
import { TaskItem, TaskStatus } from "./tasker-types";
import { X, Save, Lock } from "lucide-react";

interface TaskDetailPanelProps {
  task: TaskItem;
  onClose: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => { success: boolean; error?: string };
}

const STATUSES: TaskStatus[] = ['backlog', 'ready', 'in_progress', 'review', 'done', 'blocked', 'cancelled'];

export function TaskDetailPanel({ task, onClose, onStatusChange }: TaskDetailPanelProps) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSave = () => {
    setErrorMsg("");
    if (selectedStatus === task.status) {
      onClose();
      return;
    }

    const result = onStatusChange(task.id, selectedStatus);
    if (!result.success) {
      setErrorMsg(result.error || "Transição bloqueada pelo contrato do Tasker Board.");
    } else {
      onClose();
    }
  };

  const isGroupD = task.group === "D";

  return (
    <div className="w-96 border-l bg-card h-full flex flex-col shadow-xl absolute right-0 top-0 z-10 sm:relative sm:shadow-none">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold text-sm">Task Details</h3>
          <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md text-xs border border-red-200 dark:border-red-800">
            {errorMsg}
          </div>
        )}

        {isGroupD && (
          <div className="p-3 bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300 rounded-md text-xs border border-slate-200 dark:border-slate-700 flex gap-2 items-start">
            <Lock className="w-4 h-4 mt-0.5" />
            <div>
              <strong>Blocked Group D:</strong> This task requires real operational sources and cannot be transitioned during platform MVP.
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-1">{task.title}</h4>
          <p className="text-muted-foreground text-xs">{task.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Module</span>
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">{task.module}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Priority</span>
            <span className="capitalize text-xs font-medium">{task.priority}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Group</span>
            <span className="font-mono text-xs">{task.group}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Type</span>
            <span className="capitalize text-xs">{task.type}</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-muted-foreground block mb-2">Simulate State Transition</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
            className="w-full text-sm border rounded p-2 bg-background disabled:opacity-50"
            disabled={isGroupD}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="mt-2 text-[10px] text-muted-foreground">
            Changes here are in-memory (mock state) and will reset on refresh.
          </div>
        </div>

        {task.evidence && task.evidence.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Evidences</span>
            <ul className="space-y-1">
              {task.evidence.map(e => (
                <li key={e.id} className="text-xs border p-2 rounded bg-muted/20 flex justify-between items-center">
                  <span className="truncate">{e.name}</span>
                  {e.provided && <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">Provided</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {task.expected_files && task.expected_files.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Expected Files</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {task.expected_files.map((file, i) => (
                <li key={i} className="truncate">{file}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Depends On</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {task.depends_on && task.depends_on.length > 0 ? task.depends_on.map((d, i) => <li key={i} className="truncate">{d.taskId}</li>) : <li>None</li>}
            </ul>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Blocked By</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {task.blocked_by && task.blocked_by.length > 0 ? task.blocked_by.map((d, i) => <li key={i} className="truncate">{d.taskId}</li>) : <li>None</li>}
            </ul>
          </div>
        </div>

        {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Acceptance Criteria</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {task.acceptance_criteria.map((c, i) => (
                <li key={i} className="truncate">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {task.source_docs && task.source_docs.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Source Docs</span>
            <ul className="list-disc list-inside text-xs text-muted-foreground">
              {task.source_docs.map((doc, i) => (
                <li key={i} className="truncate">{doc}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
           <span className="text-xs text-muted-foreground block mb-1">Next Action</span>
           <span className="text-xs">{task.next_action || 'None'}</span>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/10 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium border rounded hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={selectedStatus === task.status || isGroupD}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Simulate Transition
        </button>
      </div>
    </div>
  );
}
