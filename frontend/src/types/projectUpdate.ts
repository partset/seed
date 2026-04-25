export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  isVisibleToClient: boolean;
  createdAt: string;
  createdByAdminName: string;
}

export interface InsertProjectUpdatePayload {
  projectId: string;
  title: string;
  description: string;
  isVisibleToClient: boolean;
  createdByAdminId: string;
}
