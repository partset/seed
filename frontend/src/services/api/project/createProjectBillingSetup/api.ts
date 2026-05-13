import type {
  CreateProjectBillingSetupPayload,
  CreateProjectBillingSetupResponse,
} from "../../../../types/projectBillingSetup";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createProjectBillingSetup(
  accessToken: string,
  projectId: string,
  payload: CreateProjectBillingSetupPayload,
): Promise<CreateProjectBillingSetupResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/project/${projectId}/billing-setup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result =
    (await response.json()) as ApiResponse<CreateProjectBillingSetupResponse>;

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to create project billing setup.");
  }

  return result.data;
}
