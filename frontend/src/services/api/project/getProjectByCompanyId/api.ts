import type { Project } from "../../../../types/project";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProjectByCompanyId(
  token: string,
  companyId: string,
): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/api/project/${companyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiResponse<Project[]> = await response.json();
  console.log("API response for getProjectByCompanyId:", result);

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch project by company ID");
  }

  return result.data ?? [];
}
