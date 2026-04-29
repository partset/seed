import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateProjectCheckoutSessionPayload {
  invoiceId?: string;
}

export interface CreateProjectCheckoutSessionResponse {
  checkoutUrl: string;
}

export async function createProjectCheckoutSession(
  token: string,
  projectId: string,
  payload: CreateProjectCheckoutSessionPayload = {},
): Promise<CreateProjectCheckoutSessionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/project/${projectId}/payment/checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result: ApiResponse<CreateProjectCheckoutSessionResponse> =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to create checkout session.");
  }

  if (!result.data?.checkoutUrl) {
    throw new Error("Checkout URL was not returned.");
  }

  return result.data;
}
