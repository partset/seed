import type { Project } from "../../../../types/project";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function modifyProjectDetails(
  token: string,
  projectId: string,
  updates: Partial<Project>,
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/api/project/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const result: ApiResponse<Project> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update project details");
  }

  return result.data;
}
