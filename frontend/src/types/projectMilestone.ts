export type ProjectMilestoneStatus = "upcoming" | "current" | "complete";

export interface ProjectMilestone {
  id: string;
  projectId: string;
  label: string;
  displayOrder: number;
  status: ProjectMilestoneStatus;
  completedAt: string | null;
  createdAt: string;
}
