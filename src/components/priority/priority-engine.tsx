"use client";

import { Play } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/priority-badge";
import { TASK_TYPE_ICON } from "@/lib/labels";
import { cn, formatTime } from "@/lib/utils";

export function PriorityEngine() {
  const { rankedTasks, staff, runDispatch, highlightedTaskId, locationId } =
    useDemo();

  const visible = rankedTasks.filter((t) => t.locationId === locationId);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="navy" className="mb-2">
            Smart Priority Engine
          </Badge>
          <h1 className="font-display text-3xl font-semibold text-navy-900">
            Urgency, due time, and pet welfare
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Medication for Bella outranks kennel cleaning. Run Dispatch to assign
            each open task to available, qualified staff.
          </p>
        </div>
        <Button variant="teal" size="lg" onClick={runDispatch}>
          <Play size={16} />
          Run Dispatch
        </Button>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            title: "Critical first",
            copy: "Overdue medication elevates above every routine chore.",
          },
          {
            title: "Due-time aware",
            copy: "Walks due soon rise above later feedings and cleaning.",
          },
          {
            title: "Skill + load match",
            copy: "Dispatch prefers qualified staff with the lightest queue.",
          },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <p className="text-sm font-semibold text-navy-900">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {item.copy}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranked task board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visible.map((task, index) => {
            const assignee = staff.find((s) => s.id === task.assignedTo);
            return (
              <div
                key={task.id}
                className={cn(
                  "rounded-xl border border-slate-150 bg-white p-4 transition-all",
                  highlightedTaskId === task.id && "highlight-task",
                  task.priority === "critical" && "border-rose-200 bg-rose-50/40",
                  task.priority === "low" && "opacity-90"
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{TASK_TYPE_ICON[task.type]}</span>
                      <p className="text-sm font-semibold text-navy-900">
                        {task.title}
                      </p>
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {task.petName} · Due {formatTime(task.dueAt)}
                      {assignee ? ` · ${assignee.name}` : " · Unassigned"}
                    </p>
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-teal-800">Why: </span>
                      {task.priorityReason}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
