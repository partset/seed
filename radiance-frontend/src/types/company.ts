import type { Project } from "./project";
import type { ProjectDocument } from "./projectDocument";
import type { ProjectMilestone } from "./projectMilestone";
import type { ProjectUpdate } from "./projectUpdate";

export interface Company {
  id: string;
  name: string;
  primaryEmail: string;
  primaryPhone: string;
  createdAt: string;
}

export interface AdminPortalCompanyRecord extends Company {
  projects: Project[];
}

export interface AdminPortalProjectRecord extends Project {
  updates: ProjectUpdate[];
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
}
