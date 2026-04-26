import type {
  ProjectDocument,
  InsertProjectDocumentPayload,
} from "../../../../types/projectDocument";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function insertProjectDocument(
  payload: InsertProjectDocumentPayload,
  accessToken: string,
): Promise<ProjectDocument> {
  const formData = new FormData();

  formData.append("projectId", payload.projectId);
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("isVisibleToClient", String(payload.isVisibleToClient));
  formData.append("file", payload.file);

  const response = await fetch(`${API_BASE_URL}/api/project/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to upload document.");
  }

  return result.data;
}
