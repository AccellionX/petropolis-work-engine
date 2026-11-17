"use client";

import { useDemo } from "@/context/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StaffOverview() {
  const { staff, locationId } = useDemo();
  const local = staff.filter((s) => s.locationId === locationId);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Staff availability</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Who is qualified and free for dispatch.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {local.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                  member.status === "on_shift"
                    ? "bg-teal-600"
                    : member.status === "on_break"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                )}
              >
                {member.avatarInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">
                  {member.name}
                </p>
                <p className="text-xs text-slate-500">
                  {member.role} · {member.tasksCompletedToday} done today
                </p>
              </div>
            </div>
            <Badge
              variant={
                member.status === "on_shift"
                  ? "success"
                  : member.status === "on_break"
                    ? "high"
                    : "muted"
              }
              className="normal-case tracking-normal"
            >
              {member.status === "on_shift"
                ? "On shift"
                : member.status === "on_break"
                  ? "Break"
                  : "Off"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
