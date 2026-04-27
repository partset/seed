export type ProjectMilestoneStatus = "upcoming" | "current" | "complete";

export interface ProjectMilestone {
  id: string;
  projectId: string;
  label: string;
  displayOrder: number;
  status: ProjectMilestoneStatus;
  createdAt: string;
}

export interface InsertProjectMilestonePayload {
  projectId: string;
  label: string;
  displayOrder: number;
  status: ProjectMilestoneStatus;
}
