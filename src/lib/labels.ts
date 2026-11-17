import type { TaskType } from "./types";

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  feeding: "Feeding",
  medication: "Medication",
  walking: "Walking",
  cleaning: "Cleaning",
  water_check: "Water Check",
  training: "Training",
  grooming: "Grooming",
};

export const TASK_TYPE_ICON: Record<TaskType, string> = {
  feeding: "🥣",
  medication: "💊",
  walking: "🦮",
  cleaning: "🧹",
  water_check: "💧",
  training: "🎯",
  grooming: "✂️",
};
