const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { ApiResponse } from "../../response";

type ConvertLeadToClientPayload = {
  companyName: string;
  email: string;
  phone: string;
  projectType: string;
  projectName?: string;
};

type ConvertLeadToClientResponse = ApiResponse<{
  message: string;
  company: {
    id: string;
    name: string;
    primary_email: string | null;
    primary_phone: string | null;
  };
  project: {
    id: string;
    company_id: string;
    name: string;
    status: string;
  };
}>;

export const convertLeadToClient = async (
  accessToken: string,
  leadId: string,
  payload: ConvertLeadToClientPayload,
): Promise<ConvertLeadToClientResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/lead/${leadId}/convert-to-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data: ConvertLeadToClientResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to convert lead to client.");
    }

    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to convert lead to client.");
  }
};
