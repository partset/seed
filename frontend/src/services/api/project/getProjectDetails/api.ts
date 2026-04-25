import type { AdminPortalProjectRecord } from "../../../../types/company";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProjectDetails(
  token: string,
  projectId: string,
): Promise<AdminPortalProjectRecord> {
  const response = await fetch(
    `${API_BASE_URL}/api/project/${projectId}/details`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result: ApiResponse<AdminPortalProjectRecord> = await response.json();
  console.log("API response for getProjectDetails:", result);

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch project by company ID");
  }

  return result.data ?? [];
}
