export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSizeBytes: number;
  isVisibleToClient: boolean;
  createdAt: string;
  uploadedByAdminName: string;
}

export interface InsertProjectDocumentPayload {
  projectId: string;
  title: string;
  category: string;
  description: string;
  isVisibleToClient: boolean;
  file: File;
}
