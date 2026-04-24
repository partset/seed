import type { Project } from "./project";
import type { ProjectDocument } from "./projectDocument";
import type { ProjectMilestone } from "./projectMilestone";
import type { ProjectUpdate } from "./projectUpdate";

export interface AdminPortalProjectRecord extends Project {
  updates: ProjectUpdate[];
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
}

export interface Company {
  id: string;
  name: string;
  primaryEmail: string;
  primaryPhone: string;
  totalProjects: number;
  activeProjects: number;
  latestProjectName: string;
}

export interface AdminPortalCompanyRecord extends Company {
  projects: Project[];
}
