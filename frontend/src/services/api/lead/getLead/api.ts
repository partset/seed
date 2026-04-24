import type { Lead } from "../../../../types/lead";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getLead(token: string, leadId: string): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/api/lead/${leadId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiResponse<Lead> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch lead");
  }

  return result.data;
}
