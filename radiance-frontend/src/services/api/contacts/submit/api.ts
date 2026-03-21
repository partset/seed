const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { ApiResponse } from "../../response";

type SubmitContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  projectType: string;
  message: string;
};

type SubmitContactResponse = ApiResponse<{
  contactId?: string;
}>;

export const submitContact = async (
  payload: SubmitContactPayload,
): Promise<SubmitContactResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: SubmitContactResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to submit contact.");
    }

    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to submit contact.");
  }
};
