const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { ApiResponse } from "../../response";

type SubmitLeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  projectType: string;
  message: string;
};

type SubmitLeadResponse = ApiResponse<{
  leadId?: string;
}>;

export const submitLead = async (
  payload: SubmitLeadPayload,
): Promise<SubmitLeadResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lead/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: SubmitLeadResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to submit lead.");
    }

    return data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to submit lead.");
  }
};
