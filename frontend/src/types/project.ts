export type ProjectStatus =
  | "planned"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface Project {
  id: string;
  name: string;
  currentPhase: string;
  nextStep: string;
  startDate: string | null;
  status: ProjectStatus;
  targetLaunchDate: string | null;
  clientVisibleSummary: string;
}
