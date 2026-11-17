"use client";

import { useDemo } from "@/context/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/priority-badge";
import { TASK_TYPE_ICON } from "@/lib/labels";
import { cn, DEMO_CLOCK_MS, formatTime } from "@/lib/utils";

export function TaskQueue() {
  const { liveQueue, staff, highlightedTaskId } = useDemo();

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Live task queue</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Ranked by welfare urgency, due time, and priority.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {liveQueue.slice(0, 8).map((task) => {
          const assignee = staff.find((s) => s.id === task.assignedTo);
          const overdue =
            new Date(task.dueAt).getTime() < DEMO_CLOCK_MS &&
            task.status !== "completed";
          return (
            <div
              key={task.id}
              className={cn(
                "rounded-xl border border-slate-150 bg-slate-50/70 p-3 transition-all",
                highlightedTaskId === task.id && "highlight-task bg-white",
                task.isNew && "border-teal-200 bg-teal-50/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base">{TASK_TYPE_ICON[task.type]}</span>
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {task.title}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {task.petName}
                    {assignee ? ` · ${assignee.name}` : " · Unassigned"}
                    {" · Due "}
                    <span className={overdue ? "font-semibold text-rose-600" : ""}>
                      {formatTime(task.dueAt)}
                      {overdue ? " (overdue)" : ""}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
