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
