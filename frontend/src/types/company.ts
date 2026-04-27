import type { Project } from "./project";
import type { ProjectDocument } from "./projectDocument";
import type { ProjectMilestone } from "./projectMilestone";
import type { ProjectUpdate } from "./projectUpdate";
import type { ClientBillingSummary } from "./clientPortal";

export interface AdminPortalProjectRecord extends Project {
  updates: ProjectUpdate[];
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
  balanceDue: string | null;
  invoiceDueDate: string | null;
  billing: ClientBillingSummary | null;
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
