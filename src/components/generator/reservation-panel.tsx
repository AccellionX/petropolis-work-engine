"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/priority-badge";
import { TASK_TYPE_ICON } from "@/lib/labels";
import { cn, formatTime } from "@/lib/utils";

export function ReservationPanel() {
  const {
    reservations,
    locationId,
    simulateCheckIn,
    lastGeneratedTaskIds,
    tasks,
    highlightedTaskId,
  } = useDemo();

  const local = reservations.filter((r) => r.locationId === locationId);
  const generated = tasks.filter((t) => lastGeneratedTaskIds.includes(t.id));

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="navy" className="mb-2">
            Reservation → Task Generator
          </Badge>
          <h1 className="font-display text-3xl font-semibold text-navy-900">
            From Goose booking to care checklist
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Mock Goose reservations. Simulate a check-in to instantly generate
            feeding, medication, walking, cleaning, and water-check tasks.
          </p>
        </div>
        <Button
          variant="teal"
          size="lg"
          onClick={() => simulateCheckIn()}
          className="shrink-0"
        >
          <Sparkles size={16} />
          Simulate New Check-In
        </Button>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mock Goose reservations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {local.map((res) => (
              <div
                key={res.id}
                className="rounded-xl border border-slate-150 bg-slate-50/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {res.petName}{" "}
                      <span className="font-normal text-slate-500">
                        · {res.service}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {res.gooseId} · Owner {res.ownerName}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      {res.specialInstructions}
                    </p>
                    {res.medications.length > 0 && (
                      <p className="mt-1 text-xs font-medium text-rose-700">
                        Meds: {res.medications.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        res.status === "checked_in"
                          ? "success"
                          : res.status === "upcoming"
                            ? "normal"
                            : "muted"
                      }
                      className="normal-case tracking-normal"
                    >
                      {res.status.replace("_", " ")}
                    </Badge>
                    {!res.tasksGenerated && (
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => simulateCheckIn(res.id)}
                      >
                        Check in
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-8 left-0 hidden w-8 items-center justify-center text-teal-500 lg:flex">
            <ArrowRight className="absolute -left-4 top-1/2 hidden" />
          </div>
          <CardHeader>
            <div>
              <CardTitle>Generated care tasks</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                {generated.length > 0
                  ? `${generated.length} tasks created from the latest check-in`
                  : "Run a check-in to see the reservation → task transition"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {generated.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Waiting for a simulated check-in…
              </div>
            )}
            {generated.map((task, idx) => (
              <div
                key={task.id}
                className={cn(
                  "animate-fade-up rounded-xl border border-teal-100 bg-teal-50/50 p-3",
                  highlightedTaskId === task.id && "highlight-task bg-white"
                )}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">
                      {TASK_TYPE_ICON[task.type]} {task.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Due {formatTime(task.dueAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
