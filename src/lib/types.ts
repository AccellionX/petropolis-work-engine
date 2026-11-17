export type Priority = "critical" | "high" | "normal" | "low";
export type TaskStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "blocked"
  | "needs_help";
export type TaskType =
  | "feeding"
  | "medication"
  | "walking"
  | "cleaning"
  | "water_check"
  | "training"
  | "grooming";
export type StaffStatus = "on_shift" | "on_break" | "off_shift";
export type Qualification =
  | "medication"
  | "walking"
  | "feeding"
  | "cleaning"
  | "training"
  | "grooming"
  | "supervisor";

export interface Location {
  id: string;
  name: string;
  city: string;
  isPilot: boolean;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  species: "dog" | "cat";
  photoEmoji: string;
  notes: string;
  locationId: string;
  room: string;
  active: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  qualifications: Qualification[];
  status: StaffStatus;
  locationId: string;
  tasksCompletedToday: number;
}

export interface Reservation {
  id: string;
  gooseId: string;
  petId: string;
  petName: string;
  service: "daycare" | "boarding" | "grooming" | "training";
  checkInAt: string;
  checkOutAt: string;
  ownerName: string;
  specialInstructions: string;
  medications: string[];
  status: "upcoming" | "checked_in" | "checked_out";
  locationId: string;
  tasksGenerated: boolean;
}

export interface CareTask {
  id: string;
  type: TaskType;
  title: string;
  instructions: string;
  petId: string | null;
  petName: string;
  priority: Priority;
  status: TaskStatus;
  dueAt: string;
  assignedTo: string | null;
  locationId: string;
  reservationId: string | null;
  sopUrl: string;
  videoUrl: string;
  priorityReason: string;
  blockedReason?: string;
  photoAttached?: boolean;
  completedAt?: string;
  createdAt: string;
  isNew?: boolean;
}

export interface TaskTemplate {
  id: string;
  name: string;
  type: TaskType;
  defaultPriority: Priority;
  instructions: string;
  estimatedMinutes: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface DemoEvent {
  id: string;
  message: string;
  timestamp: string;
  tone: "info" | "success" | "warn";
}

export interface HourlyCompletion {
  hour: string;
  completed: number;
  pending: number;
}
