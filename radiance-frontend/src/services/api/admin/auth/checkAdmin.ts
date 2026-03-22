import { supabase } from "../../../../lib/supabase";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CheckAdminResponse = ApiResponse<{
  authUserId: string;
  isAdmin: boolean;
}>;

export const checkAdmin = async (): Promise<CheckAdminResponse> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No active session found.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/check-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data: CheckAdminResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to verify admin.");
  }

  return data;
};
