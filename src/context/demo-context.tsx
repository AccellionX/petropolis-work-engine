"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CLOSING_CHECKLIST,
  HOURLY_COMPLETION,
  INITIAL_RESERVATIONS,
  INITIAL_TASKS,
  LOCATIONS,
  OPENING_CHECKLIST,
  PETS,
  PRIORITY_WEIGHT,
  STAFF,
  TASK_TEMPLATES,
  TYPE_TO_QUAL,
} from "@/lib/mock-data";
import type {
  CareTask,
  ChecklistItem,
  DemoEvent,
  HourlyCompletion,
  Priority,
  Reservation,
  StaffMember,
  StaffStatus,
  TaskStatus,
  TaskType,
} from "@/lib/types";
import { DEMO_CLOCK_MS, minutesFromNow, uid } from "@/lib/utils";

interface DemoState {
  locationId: string;
  reservations: Reservation[];
  tasks: CareTask[];
  staff: StaffMember[];
  openingChecklist: ChecklistItem[];
  closingChecklist: ChecklistItem[];
  hourly: HourlyCompletion[];
  events: DemoEvent[];
  lastGeneratedTaskIds: string[];
  highlightedTaskId: string | null;
  demoStep: number | null;
  isDemoRunning: boolean;
}

interface CreateTaskInput {
  type: TaskType;
  title: string;
  instructions: string;
  petName: string;
  petId?: string | null;
  priority: Priority;
  dueInMinutes: number;
  assignedTo?: string | null;
}

interface DemoContextValue extends DemoState {
  locations: typeof LOCATIONS;
  pets: typeof PETS;
  templates: typeof TASK_TEMPLATES;
  setLocationId: (id: string) => void;
  activePetsCount: number;
  pendingTasksCount: number;
  overdueTasksCount: number;
  staffOnShiftCount: number;
  liveQueue: CareTask[];
  rankedTasks: CareTask[];
  pushEvent: (message: string, tone?: DemoEvent["tone"]) => void;
  simulateCheckIn: (reservationId?: string) => string[];
  runDispatch: () => void;
  updateTaskStatus: (
    taskId: string,
    status: TaskStatus,
    extras?: Partial<CareTask>
  ) => void;
  reassignTask: (taskId: string, staffId: string | null) => void;
  overridePriority: (taskId: string, priority: Priority, reason: string) => void;
  createManualTask: (input: CreateTaskInput) => void;
  toggleChecklist: (kind: "opening" | "closing", itemId: string) => void;
  setStaffStatus: (staffId: string, status: StaffStatus) => void;
  attachPhoto: (taskId: string) => void;
  setHighlightedTaskId: (id: string | null) => void;
  runGuidedDemo: () => Promise<void>;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function cloneInitial(): Omit<
  DemoState,
  "demoStep" | "isDemoRunning" | "highlightedTaskId" | "lastGeneratedTaskIds"
> {
  return {
    locationId: "loc-midtown",
    reservations: structuredClone(INITIAL_RESERVATIONS),
    tasks: structuredClone(INITIAL_TASKS),
    staff: structuredClone(STAFF),
    openingChecklist: structuredClone(OPENING_CHECKLIST),
    closingChecklist: structuredClone(CLOSING_CHECKLIST),
    hourly: structuredClone(HOURLY_COMPLETION),
    events: [
      {
        id: "evt-boot",
        message: "Demo state loaded — Midtown pilot is live.",
        timestamp: new Date(DEMO_CLOCK_MS).toISOString(),
        tone: "info",
      },
    ],
  };
}

function sortByUrgency(a: CareTask, b: CareTask) {
  const statusRank = (s: TaskStatus) =>
    s === "completed" ? 2 : s === "blocked" ? 1 : 0;
  const sr = statusRank(a.status) - statusRank(b.status);
  if (sr !== 0) return sr;
  const pr = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  if (pr !== 0) return pr;
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
}

function buildTasksForReservation(res: Reservation): CareTask[] {
  const now = DEMO_CLOCK_MS;
  const base = {
    petId: res.petId,
    petName: res.petName,
    locationId: res.locationId,
    reservationId: res.id,
    status: "pending" as TaskStatus,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    isNew: true,
  };

  const tasks: CareTask[] = [
    {
      ...base,
      id: uid("task"),
      type: "feeding",
      title: `Welcome feeding — ${res.petName}`,
      instructions: `Prepare first meal per diet card. ${res.specialInstructions}`,
      priority: "normal",
      dueAt: minutesFromNow(20),
      sopUrl: "#sop-feeding",
      videoUrl: "#video-feeding",
      priorityReason: "New check-in feeding within first 30 minutes.",
    },
    {
      ...base,
      id: uid("task"),
      type: "walking",
      title: `Intake potty walk — ${res.petName}`,
      instructions: "Short yard walk after check-in. Note elimination.",
      priority: "high",
      dueAt: minutesFromNow(10),
      sopUrl: "#sop-walking",
      videoUrl: "#video-walk",
      priorityReason: "New arrivals need a potty break soon after intake.",
    },
    {
      ...base,
      id: uid("task"),
      type: "water_check",
      title: `Water setup — ${res.petName}`,
      instructions: "Fill fresh water. Place bowl in assigned room.",
      priority: "normal",
      dueAt: minutesFromNow(15),
      sopUrl: "#sop-water",
      videoUrl: "#video-water",
      priorityReason: "Hydration check paired with room assignment.",
    },
    {
      ...base,
      id: uid("task"),
      type: "cleaning",
      title: `Room prep — ${res.petName}`,
      instructions: "Sanitize suite, set bedding, restock waste bags.",
      priority: "low",
      dueAt: minutesFromNow(35),
      sopUrl: "#sop-cleaning",
      videoUrl: "#video-clean",
      priorityReason: "Room prep ranked below live animal-care tasks.",
    },
  ];

  if (res.medications.length > 0) {
    tasks.unshift({
      ...base,
      id: uid("task"),
      type: "medication",
      title: `Medication — ${res.petName}`,
      instructions: `Administer: ${res.medications.join(", ")}. Confirm with SOP.`,
      priority: "critical",
      dueAt: minutesFromNow(5),
      sopUrl: "#sop-medication",
      videoUrl: "#video-med",
      priorityReason:
        "Medication on file — welfare-critical tasks outrank routine work.",
    });
  }

  // ensure unique createdAt ordering
  return tasks.map((t, i) => ({
    ...t,
    createdAt: new Date(now + i).toISOString(),
  }));
}

function pickAssignee(
  task: CareTask,
  staff: StaffMember[],
  workload: Record<string, number>
): string | null {
  const needed = TYPE_TO_QUAL[task.type];
  const candidates = staff
    .filter((s) => s.status === "on_shift")
    .filter(
      (s) =>
        s.qualifications.includes(needed as StaffMember["qualifications"][number]) ||
        s.qualifications.includes("supervisor")
    )
    .sort(
      (a, b) => (workload[a.id] ?? 0) - (workload[b.id] ?? 0) || a.name.localeCompare(b.name)
    );
  return candidates[0]?.id ?? null;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [locationId, setLocationId] = useState("loc-midtown");
  const [reservations, setReservations] = useState(
    () => structuredClone(INITIAL_RESERVATIONS)
  );
  const [tasks, setTasks] = useState(() => structuredClone(INITIAL_TASKS));
  const [staff, setStaff] = useState(() => structuredClone(STAFF));
  const [openingChecklist, setOpeningChecklist] = useState(
    () => structuredClone(OPENING_CHECKLIST)
  );
  const [closingChecklist, setClosingChecklist] = useState(
    () => structuredClone(CLOSING_CHECKLIST)
  );
  const [hourly, setHourly] = useState(() => structuredClone(HOURLY_COMPLETION));
  const [events, setEvents] = useState<DemoEvent[]>(() => [
    {
      id: "evt-boot",
      message: "Demo state loaded — Midtown pilot is live.",
      timestamp: new Date(DEMO_CLOCK_MS).toISOString(),
      tone: "info",
    },
  ]);
  const [lastGeneratedTaskIds, setLastGeneratedTaskIds] = useState<string[]>(
    []
  );
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(
    null
  );
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const reservationsRef = useRef(reservations);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    reservationsRef.current = reservations;
  }, [reservations]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const pushEvent = useCallback(
    (message: string, tone: DemoEvent["tone"] = "info") => {
      setEvents((prev) => [
        {
          id: uid("evt"),
          message,
          timestamp: new Date(DEMO_CLOCK_MS).toISOString(),
          tone,
        },
        ...prev,
      ].slice(0, 20));
    },
    []
  );

  const locationTasks = useMemo(
    () => tasks.filter((t) => t.locationId === locationId),
    [tasks, locationId]
  );

  const activePetsCount = useMemo(
    () =>
      PETS.filter((p) => p.locationId === locationId && p.active).length,
    [locationId]
  );

  const pendingTasksCount = useMemo(
    () =>
      locationTasks.filter((t) =>
        ["pending", "assigned", "in_progress", "needs_help"].includes(t.status)
      ).length,
    [locationTasks]
  );

  const overdueTasksCount = useMemo(
    () =>
      locationTasks.filter(
        (t) =>
          !["completed", "blocked"].includes(t.status) &&
          new Date(t.dueAt).getTime() < DEMO_CLOCK_MS
      ).length,
    [locationTasks]
  );

  const staffOnShiftCount = useMemo(
    () =>
      staff.filter(
        (s) => s.locationId === locationId && s.status === "on_shift"
      ).length,
    [staff, locationId]
  );

  const liveQueue = useMemo(
    () =>
      [...locationTasks]
        .filter((t) => t.status !== "completed")
        .sort(sortByUrgency),
    [locationTasks]
  );

  const rankedTasks = useMemo(
    () => [...locationTasks].sort(sortByUrgency),
    [locationTasks]
  );

  const simulateCheckIn = useCallback(
    (reservationId?: string) => {
      let list = [...reservationsRef.current];
      let target =
        (reservationId ? list.find((r) => r.id === reservationId) : undefined) ??
        list.find(
          (r) =>
            r.locationId === locationId &&
            (r.status === "upcoming" || !r.tasksGenerated)
        );

      if (!target) {
        target = {
          id: uid("res"),
          gooseId: `GOOSE-${Math.floor(48000 + Math.random() * 900)}`,
          petId: "pet-max",
          petName: "Cooper",
          service: "daycare",
          checkInAt: new Date(DEMO_CLOCK_MS).toISOString(),
          checkOutAt: minutesFromNow(480),
          ownerName: "Taylor Kim",
          specialInstructions: "First daycare visit — monitor for anxiety.",
          medications: [],
          status: "upcoming",
          locationId,
          tasksGenerated: false,
        };
        list = [target, ...list];
      }

      const checkedIn: Reservation = {
        ...target,
        status: "checked_in",
        tasksGenerated: true,
        checkInAt: new Date(DEMO_CLOCK_MS).toISOString(),
      };
      const generated = buildTasksForReservation(checkedIn);
      const generatedIds = generated.map((t) => t.id);

      const nextReservations = list.some((r) => r.id === checkedIn.id)
        ? list.map((r) => (r.id === checkedIn.id ? checkedIn : r))
        : [checkedIn, ...list];

      reservationsRef.current = nextReservations;
      setReservations(nextReservations);
      setTasks((prev) => {
        const next = [...generated, ...prev];
        tasksRef.current = next;
        return next;
      });
      setLastGeneratedTaskIds(generatedIds);
      pushEvent(
        `Check-in simulated for ${checkedIn.petName} — ${generated.length} care tasks generated.`,
        "success"
      );
      return generatedIds;
    },
    [locationId, pushEvent]
  );

  const runDispatch = useCallback(() => {
    setTasks((prev) => {
      const workload: Record<string, number> = {};
      prev.forEach((t) => {
        if (
          t.assignedTo &&
          ["assigned", "in_progress", "needs_help"].includes(t.status)
        ) {
          workload[t.assignedTo] = (workload[t.assignedTo] ?? 0) + 1;
        }
      });

      const next = prev.map((task) => {
        if (task.locationId !== locationId) return task;
        if (["completed", "blocked"].includes(task.status)) return task;
        if (task.assignedTo && task.status !== "pending") return task;

        const assignee = pickAssignee(task, staff, workload);
        if (!assignee) return task;
        workload[assignee] = (workload[assignee] ?? 0) + 1;
        const name = staff.find((s) => s.id === assignee)?.name ?? "Staff";
        return {
          ...task,
          assignedTo: assignee,
          status: "assigned" as TaskStatus,
          priorityReason: `${task.priorityReason} Assigned to ${name} (qualified + lowest current load).`,
          isNew: false,
        };
      });
      return next.sort(sortByUrgency);
    });
    pushEvent(
      "Dispatch run complete — tasks assigned to available, qualified staff.",
      "success"
    );
  }, [locationId, staff, pushEvent]);

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus, extras: Partial<CareTask> = {}) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const updated: CareTask = {
            ...t,
            ...extras,
            status,
            completedAt:
              status === "completed"
                ? new Date(DEMO_CLOCK_MS).toISOString()
                : t.completedAt,
            isNew: false,
          };
          return updated;
        })
      );

      if (status === "completed") {
        const task = tasksRef.current.find((t) => t.id === taskId);
        setStaff((prev) =>
          prev.map((s) => {
            if (!task || task.assignedTo !== s.id) return s;
            return { ...s, tasksCompletedToday: s.tasksCompletedToday + 1 };
          })
        );
        setHourly((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last) {
            copy[copy.length - 1] = {
              ...last,
              completed: last.completed + 1,
              pending: Math.max(0, last.pending - 1),
            };
          }
          return copy;
        });
        pushEvent("Task marked complete — manager dashboard updated.", "success");
      } else if (status === "needs_help") {
        pushEvent("Staff requested help — escalated to supervisor queue.", "warn");
      } else if (status === "blocked") {
        pushEvent("Task blocked — manager notified.", "warn");
      } else if (status === "in_progress") {
        pushEvent("Task started by staff.", "info");
      }
    },
    [pushEvent]
  );

  const reassignTask = useCallback(
    (taskId: string, staffId: string | null) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignedTo: staffId,
                status: staffId ? "assigned" : "pending",
              }
            : t
        )
      );
      const name = staff.find((s) => s.id === staffId)?.name ?? "Unassigned";
      pushEvent(`Task reassigned to ${name}.`, "info");
    },
    [staff, pushEvent]
  );

  const overridePriority = useCallback(
    (taskId: string, priority: Priority, reason: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                priority,
                priorityReason: `Manager override: ${reason}`,
              }
            : t
        )
      );
      pushEvent(`Priority overridden to ${priority}.`, "warn");
    },
    [pushEvent]
  );

  const createManualTask = useCallback(
    (input: CreateTaskInput) => {
      const task: CareTask = {
        id: uid("task"),
        type: input.type,
        title: input.title,
        instructions: input.instructions,
        petId: input.petId ?? null,
        petName: input.petName,
        priority: input.priority,
        status: input.assignedTo ? "assigned" : "pending",
        dueAt: minutesFromNow(input.dueInMinutes),
        assignedTo: input.assignedTo ?? null,
        locationId,
        reservationId: null,
        sopUrl: "#sop-custom",
        videoUrl: "#video-custom",
        priorityReason: "Manually created by manager.",
        createdAt: new Date(DEMO_CLOCK_MS).toISOString(),
        isNew: true,
      };
      setTasks((prev) => [task, ...prev]);
      pushEvent(`Manual task created: ${input.title}`, "success");
    },
    [locationId, pushEvent]
  );

  const toggleChecklist = useCallback(
    (kind: "opening" | "closing", itemId: string) => {
      const setter = kind === "opening" ? setOpeningChecklist : setClosingChecklist;
      setter((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        )
      );
    },
    []
  );

  const setStaffStatus = useCallback(
    (staffId: string, status: StaffStatus) => {
      setStaff((prev) =>
        prev.map((s) => (s.id === staffId ? { ...s, status } : s))
      );
      const labels: Record<StaffStatus, string> = {
        on_shift: "clocked in",
        on_break: "on break",
        off_shift: "clocked out",
      };
      const name = staff.find((s) => s.id === staffId)?.name ?? "Staff";
      pushEvent(`${name} ${labels[status]}.`, "info");
    },
    [staff, pushEvent]
  );

  const attachPhoto = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, photoAttached: true } : t
        )
      );
      pushEvent("Photo attachment simulated on task card.", "info");
    },
    [pushEvent]
  );

  const resetDemo = useCallback(() => {
    const fresh = cloneInitial();
    reservationsRef.current = fresh.reservations;
    tasksRef.current = fresh.tasks;
    setLocationId(fresh.locationId);
    setReservations(fresh.reservations);
    setTasks(fresh.tasks);
    setStaff(fresh.staff);
    setOpeningChecklist(fresh.openingChecklist);
    setClosingChecklist(fresh.closingChecklist);
    setHourly(fresh.hourly);
    setEvents(fresh.events);
    setLastGeneratedTaskIds([]);
    setHighlightedTaskId(null);
    setDemoStep(null);
    setIsDemoRunning(false);
  }, []);

  const runGuidedDemo = useCallback(async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    resetDemo();
    await wait(350);

    setDemoStep(1);
    pushEvent("Demo step 1 — New reservation arrives.", "info");
    await wait(900);
    const ids = simulateCheckIn("res-daisy");
    setDemoStep(2);
    pushEvent("Demo step 2 — Care tasks generated from reservation.", "success");
    if (ids[0]) setHighlightedTaskId(ids[0]);
    await wait(1400);

    setDemoStep(3);
    pushEvent(
      "Demo step 3 — Priority engine ranks welfare-critical work first.",
      "info"
    );
    await wait(1200);

    setDemoStep(4);
    runDispatch();
    pushEvent("Demo step 4 — Qualified staff receive assignments.", "success");
    await wait(1400);

    setDemoStep(5);
    const completeTarget = ids[1] ?? ids[0];
    if (completeTarget) {
      setHighlightedTaskId(completeTarget);
      updateTaskStatus(completeTarget, "in_progress");
      await wait(700);
      updateTaskStatus(completeTarget, "completed", { photoAttached: true });
      pushEvent("Demo step 5 — Staff completes a task.", "success");
    }
    await wait(1100);

    setDemoStep(6);
    pushEvent("Demo step 6 — Manager dashboard reflects live updates.", "success");
    await wait(1200);

    setDemoStep(null);
    setIsDemoRunning(false);
    setHighlightedTaskId(null);
  }, [
    isDemoRunning,
    resetDemo,
    pushEvent,
    simulateCheckIn,
    runDispatch,
    updateTaskStatus,
  ]);

  const value: DemoContextValue = {
    locationId,
    reservations,
    tasks,
    staff,
    openingChecklist,
    closingChecklist,
    hourly,
    events,
    lastGeneratedTaskIds,
    highlightedTaskId,
    demoStep,
    isDemoRunning,
    locations: LOCATIONS,
    pets: PETS,
    templates: TASK_TEMPLATES,
    setLocationId,
    activePetsCount,
    pendingTasksCount,
    overdueTasksCount,
    staffOnShiftCount,
    liveQueue,
    rankedTasks,
    pushEvent,
    simulateCheckIn,
    runDispatch,
    updateTaskStatus,
    reassignTask,
    overridePriority,
    createManualTask,
    toggleChecklist,
    setStaffStatus,
    attachPhoto,
    setHighlightedTaskId,
    runGuidedDemo,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
