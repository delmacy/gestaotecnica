import React from "react";
import { TaskItem, TaskPriority } from "./tasker-types";
import { cn } from "@/lib/utils";
import { AlertCircle, Lock, CheckCircle2 } from "lucide-react";

interface TaskCardProps {
  task: TaskItem;
  onClick: (task: TaskItem) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const groupColors = {
  A: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  B: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  C: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  D: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-dashed",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isBlocked = task.status === "blocked" || task.group === "D";
  const hasEvidence = task.evidence && task.evidence.length > 0;

  return (
    <div
      onClick={() => onClick(task)}
      className={cn(
        "p-3 rounded-lg border shadow-sm cursor-pointer transition-all hover:shadow-md mb-3 flex flex-col gap-2",
        "bg-card text-card-foreground",
        isBlocked && "opacity-75 bg-muted/50 border-dashed"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
        {isBlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
      </div>

      <h4 className="text-sm font-medium leading-tight">{task.title}</h4>

      <div className="flex flex-wrap gap-1 mt-1">
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", groupColors[task.group])}>
          Grp {task.group}
        </span>
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium bg-secondary text-secondary-foreground")}>
          {task.module}
        </span>
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium border border-border text-muted-foreground capitalize")}>
          {task.type}
        </span>
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", priorityColors[task.priority])}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {task.agent_owner ? (
            <span className="truncate max-w-[100px]">{task.agent_owner.name}</span>
          ) : (
            <span>Unassigned</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.blocked_by && task.blocked_by.length > 0 && (
            <div title="Has blockers"><AlertCircle className="w-3 h-3 text-destructive" /></div>
          )}
          {hasEvidence && (
            <div title="Has evidence"><CheckCircle2 className="w-3 h-3 text-green-500" /></div>
          )}
        </div>
      </div>
    </div>
  );
}
