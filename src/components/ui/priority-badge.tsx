import type { Priority, TaskStatus } from "@/lib/types";
import { Badge } from "./badge";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={priority}>{priority}</Badge>;
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; variant: "critical" | "high" | "normal" | "low" | "success" | "teal" | "muted" }> = {
    pending: { label: "Pending", variant: "muted" },
    assigned: { label: "Assigned", variant: "teal" },
    in_progress: { label: "In Progress", variant: "normal" },
    completed: { label: "Completed", variant: "success" },
    blocked: { label: "Blocked", variant: "critical" },
    needs_help: { label: "Needs Help", variant: "high" },
  };
  const item = map[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
