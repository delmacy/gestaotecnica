"use client";

import React, { useState, useMemo } from "react";
import { MOCK_TASKS } from "./tasker-data";
import { TaskItem, TaskStatus, TaskGroup } from "./tasker-types";
import { TaskCard } from "./TaskCard";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { TaskFilters } from "./TaskFilters";
import { BadgeInfo } from "lucide-react";

const COLUMNS: TaskStatus[] = ['backlog', 'ready', 'in_progress', 'review', 'done', 'blocked', 'cancelled'];
const GROUPS: TaskGroup[] = ['A', 'B', 'C', 'D'];

export function TaskerBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");
  const [selectedModule, setSelectedModule] = useState<string | "all">("all");

  const modules = useMemo(() => {
    const mods = new Set(tasks.map(t => t.module));
    return Array.from(mods).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (selectedGroup !== "all" && t.group !== selectedGroup) return false;
      if (selectedStatus !== "all" && t.status !== selectedStatus) return false;
      if (selectedModule !== "all" && t.module !== selectedModule) return false;
      return true;
    });
  }, [tasks, selectedGroup, selectedStatus, selectedModule]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus): { success: boolean; error?: string } => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return { success: false, error: "Task not found." };

    const task = tasks[taskIndex];

    // Transistion Rules
    if (task.group === "D") {
      return { success: false, error: "Group D tasks are blocked waiting for real operational sources." };
    }

    if (newStatus === "done") {
      const hasEvidence = task.evidence && task.evidence.length > 0;
      if (!hasEvidence) {
        return { success: false, error: "Transition to 'done' requires at least one evidence." };
      }
    }

    if (newStatus === "blocked" || newStatus === "cancelled") {
      // In a real scenario, this would check a reason field submitted with the transition.
      // For the mock, we can check if it has a blocked_by dependency.
      if (newStatus === "blocked" && (!task.blocked_by || task.blocked_by.length === 0)) {
        return { success: false, error: "Transition to 'blocked' requires a blocked_by dependency or reason." };
      }
    }

    if (task.id.startsWith("DEV-") && (newStatus === "in_progress" || newStatus === "ready")) {
      const hasReadiness = task.depends_on?.some(d => d.taskId.includes("READINESS") || d.taskId.includes("CONTRACT"));
      if (!hasReadiness && task.status === "backlog") {
        return { success: false, error: "DEV tasks cannot leave backlog/ready without readiness approval." };
      }
    }

    // Simulate updating in-memory state
    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...task, status: newStatus };
    setTasks(newTasks);

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(newTasks[taskIndex]);
    }

    return { success: true };
  };

  const handleClearFilters = () => {
    setSelectedGroup("all");
    setSelectedStatus("all");
    setSelectedModule("all");
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="p-4 border-b bg-card flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Tasker Board</h1>
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs px-2 py-1 rounded font-medium border border-yellow-200 dark:border-yellow-800 flex items-center gap-1">
            <BadgeInfo className="w-3 h-3" />
            Synthetic/Mock Mode
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          Coordenação interna do System Builder. Não edita Markdown real nem persiste em banco. Mudanças são efêmeras.
        </p>
      </div>

      <TaskFilters
        groups={GROUPS}
        statuses={COLUMNS}
        modules={modules}
        selectedGroup={selectedGroup}
        selectedStatus={selectedStatus}
        selectedModule={selectedModule}
        onGroupChange={setSelectedGroup}
        onStatusChange={setSelectedStatus}
        onModuleChange={setSelectedModule}
        onClearFilters={handleClearFilters}
      />

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 h-full">
          {COLUMNS.map(columnStatus => {
            // Se houver um filtro de status ativo que não seja este, não renderizar a coluna
            if (selectedStatus !== "all" && selectedStatus !== columnStatus) return null;

            const columnTasks = filteredTasks.filter(t => t.status === columnStatus);

            return (
              <div key={columnStatus} className="flex flex-col w-72 min-w-[18rem] bg-muted/30 rounded-lg border h-full overflow-hidden">
                <div className="p-3 border-b bg-muted/50 font-semibold text-sm capitalize flex justify-between items-center">
                  <span>{columnStatus.replace('_', ' ')}</span>
                  <span className="bg-background text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="p-3 overflow-y-auto flex-1">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={setSelectedTask}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center p-4">
                      <div className="text-center text-muted-foreground text-xs py-8 border-2 border-dashed rounded-lg w-full flex flex-col items-center gap-2">
                        <span className="opacity-50">Nenhuma tarefa</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
