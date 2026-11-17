"use client";

import { AlertTriangle, ClipboardList, PawPrint, Users } from "lucide-react";
import { useDemo } from "@/context/demo-context";
import { Card } from "@/components/ui/card";

const items = [
  {
    key: "pets",
    label: "Active Pets",
    icon: PawPrint,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    key: "pending",
    label: "Pending Tasks",
    icon: ClipboardList,
    color: "text-navy-800",
    bg: "bg-slate-100",
  },
  {
    key: "overdue",
    label: "Overdue Tasks",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    key: "staff",
    label: "Staff on Shift",
    icon: Users,
    color: "text-sky-700",
    bg: "bg-sky-50",
  },
] as const;

export function KpiCards() {
  const {
    activePetsCount,
    pendingTasksCount,
    overdueTasksCount,
    staffOnShiftCount,
  } = useDemo();

  const values = {
    pets: activePetsCount,
    pending: pendingTasksCount,
    overdue: overdueTasksCount,
    staff: staffOnShiftCount,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.key}
            className="animate-fade-up p-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-navy-900">
                  {values[item.key]}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
              >
                <Icon size={18} />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
