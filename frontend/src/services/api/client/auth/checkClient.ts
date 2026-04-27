import { supabase } from "../../../../lib/supabase";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CheckClientResponse = ApiResponse<{
  authUserId: string;
  isClient: boolean;
}>;

export const checkClient = async (): Promise<CheckClientResponse> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active session found.");
  }

  const response = await fetch(`${API_BASE_URL}/api/client/check-client`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data: CheckClientResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to verify client.");
  }

  return data;
};
