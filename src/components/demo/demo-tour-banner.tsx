"use client";

import { useDemo } from "@/context/demo-context";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reservation arrives",
  "Tasks generated",
  "Priority ranked",
  "Staff assigned",
  "Task completed",
  "Dashboard updates",
];

export function DemoTourBanner() {
  const { demoStep, isDemoRunning } = useDemo();
  if (!isDemoRunning && demoStep == null) return null;

  return (
    <div className="border-b border-teal-200 bg-teal-50/95">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-teal-950">
            Guided demo in progress
          </p>
          <p className="text-xs text-teal-800">
            Step {demoStep ?? "—"} of {STEPS.length}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((label, idx) => {
            const step = idx + 1;
            const active = demoStep === step;
            const done = demoStep != null && demoStep > step;
            return (
              <div
                key={label}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-[11px] font-medium",
                  active && "border-teal-500 bg-white text-teal-900 shadow-sm",
                  done && "border-teal-200 bg-teal-100/70 text-teal-800",
                  !active && !done && "border-transparent bg-white/50 text-teal-700/70"
                )}
              >
                <span className="mr-1 text-teal-500">{step}.</span>
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
