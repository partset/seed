import type { Lead, LeadStatus } from "../../../../types/lead";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ModifyLeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  projectType?: string;
  message?: string;
  status?: LeadStatus;
}

export async function modifyLead(
  token: string,
  leadId: string,
  updates: ModifyLeadPayload,
): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/api/lead/${leadId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const result: ApiResponse<Lead> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to update lead");
  }

  return result.data;
}
