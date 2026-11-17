"use client";

import { KpiCards } from "@/components/dashboard/kpi-cards";
import { TaskQueue } from "@/components/dashboard/task-queue";
import { StaffOverview } from "@/components/dashboard/staff-overview";
import { CompletionChart } from "@/components/dashboard/completion-chart";
import { EventFeed } from "@/components/dashboard/event-feed";
import { useDemo } from "@/context/demo-context";
import { Badge } from "@/components/ui/badge";

export default function OperationsDashboard() {
  const { locations, locationId } = useDemo();
  const location = locations.find((l) => l.id === locationId);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="navy">Operations Dashboard</Badge>
            <Badge variant="teal" className="normal-case tracking-normal">
              {location?.name}
              {location?.isPilot ? " · Phase 1 Pilot" : ""}
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            Reservations become prioritized staff work
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Watch how Goose check-ins turn into ranked care tasks, then land with
            the right person on shift — without claiming any live integrations.
          </p>
        </div>
      </header>

      <KpiCards />

      <div className="grid gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <TaskQueue />
        </div>
        <div className="space-y-5 xl:col-span-2">
          <StaffOverview />
          <EventFeed />
        </div>
      </div>

      <CompletionChart />
    </div>
  );
}
