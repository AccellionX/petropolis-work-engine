"use client";

import { useState } from "react";
import { useDemo } from "@/context/demo-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/priority-badge";
import type { Priority, TaskType } from "@/lib/types";
import { TASK_TYPE_LABELS } from "@/lib/labels";

export function ManagerAdmin() {
  const {
    staff,
    locationId,
    templates,
    openingChecklist,
    closingChecklist,
    toggleChecklist,
    createManualTask,
    tasks,
    reassignTask,
    overridePriority,
  } = useDemo();

  const localStaff = staff.filter((s) => s.locationId === locationId);
  const blocked = tasks.filter(
    (t) => t.locationId === locationId && (t.status === "blocked" || t.status === "needs_help")
  );
  const openTasks = tasks.filter(
    (t) =>
      t.locationId === locationId &&
      !["completed"].includes(t.status)
  );

  const [title, setTitle] = useState("Extra enrichment session");
  const [type, setType] = useState<TaskType>("walking");
  const [priority, setPriority] = useState<Priority>("normal");
  const [petName, setPetName] = useState("Max");
  const [assignee, setAssignee] = useState("");

  return (
    <div className="space-y-5">
      <header>
        <Badge variant="navy" className="mb-2">
          Manager Admin
        </Badge>
        <h1 className="font-display text-3xl font-semibold text-navy-900">
          Staff, templates, and overrides
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Everything here writes to local demo state so you can show managers
          staying in control during the pilot.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {localStaff.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.qualifications.map((q) => (
                        <Badge
                          key={q}
                          variant="teal"
                          className="normal-case tracking-normal"
                        >
                          {q}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge
                    variant={
                      member.status === "on_shift" ? "success" : "muted"
                    }
                    className="normal-case tracking-normal"
                  >
                    {member.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {tpl.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {TASK_TYPE_LABELS[tpl.type]} · ~{tpl.estimatedMinutes} min
                  </p>
                </div>
                <PriorityBadge priority={tpl.defaultPriority} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Opening checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {openingChecklist.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklist("opening", item.id)}
                  className="h-4 w-4 accent-teal-600"
                />
                <span
                  className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-navy-900"}`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Closing checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {closingChecklist.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklist("closing", item.id)}
                  className="h-4 w-4 accent-teal-600"
                />
                <span
                  className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-navy-900"}`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manual task creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Pet name
                <input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TaskType)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                >
                  {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-slate-500">
                Priority
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                >
                  {(["critical", "high", "normal", "low"] as Priority[]).map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label className="text-xs font-medium text-slate-500 sm:col-span-2">
                Assign to
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                >
                  <option value="">Unassigned</option>
                  {localStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button
              variant="teal"
              onClick={() => {
                createManualTask({
                  title,
                  type,
                  priority,
                  petName,
                  instructions: `Manager-created ${TASK_TYPE_LABELS[type].toLowerCase()} for ${petName}.`,
                  dueInMinutes: priority === "critical" ? 5 : 30,
                  assignedTo: assignee || null,
                });
              }}
            >
              Create task
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blocked & help requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {blocked.length === 0 && (
              <p className="text-sm text-slate-500">
                No blocked tasks right now.
              </p>
            )}
            {blocked.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-rose-100 bg-rose-50/50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-navy-900">
                    {task.title}
                  </p>
                  <StatusBadge status={task.status} />
                </div>
                <p className="mt-1 text-xs text-rose-800">
                  {task.blockedReason ?? "Staff requested help."}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reassign & priority override</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {openTasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
              <select
                value={task.assignedTo ?? ""}
                onChange={(e) =>
                  reassignTask(task.id, e.target.value || null)
                }
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
              >
                <option value="">Unassigned</option>
                {localStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={task.priority}
                onChange={(e) =>
                  overridePriority(
                    task.id,
                    e.target.value as Priority,
                    "Adjusted during manager review"
                  )
                }
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
              >
                {(["critical", "high", "normal", "low"] as Priority[]).map(
                  (p) => (
                    <option key={p} value={p}>
                      Override → {p}
                    </option>
                  )
                )}
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  overridePriority(
                    task.id,
                    "critical",
                    "Elevated for immediate welfare attention"
                  )
                }
              >
                Force critical
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
