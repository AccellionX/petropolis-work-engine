"use client";

import { useDemo } from "@/context/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatTime } from "@/lib/utils";

export function EventFeed() {
  const { events } = useDemo();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Live activity</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Simulated ops signals for this walkthrough.
          </p>
        </div>
      </CardHeader>
      <CardContent className="max-h-64 space-y-2 overflow-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2"
          >
            <span
              className={cn(
                "mt-1 h-2 w-2 shrink-0 rounded-full",
                event.tone === "success" && "bg-emerald-500",
                event.tone === "warn" && "bg-amber-500",
                event.tone === "info" && "bg-sky-500"
              )}
            />
            <div>
              <p className="text-sm text-navy-900">{event.message}</p>
              <p className="text-[11px] text-slate-400">
                {formatTime(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
