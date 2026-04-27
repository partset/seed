import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ProjectDocumentSignedUrlResponse {
  url: string;
  expiresInSeconds: number;
  fileName: string | null;
}

export async function getProjectDocumentSignedUrl(
  token: string,
  projectId: string,
  documentId: string,
): Promise<ProjectDocumentSignedUrlResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/project/${projectId}/documents/${documentId}/download-url`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result: ApiResponse<ProjectDocumentSignedUrlResponse> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch document signed URL.");
  }

  if (!result.data?.url) {
    throw new Error("Document signed URL was missing from the response.");
  }

  return result.data;
}
