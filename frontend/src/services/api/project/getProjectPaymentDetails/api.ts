import type { ProjectPaymentDetails } from "../../../../types/projectPaymentDetails";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProjectPaymentDetails(
  token: string,
  projectId: string,
): Promise<ProjectPaymentDetails> {
  const response = await fetch(
    `${API_BASE_URL}/api/project/${projectId}/payment-details`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result: ApiResponse<ProjectPaymentDetails> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Failed to fetch project payment details by project ID",
    );
  }

  if (!result.data) {
    throw new Error("Project payment details were not returned.");
  }

  return result.data;
}
