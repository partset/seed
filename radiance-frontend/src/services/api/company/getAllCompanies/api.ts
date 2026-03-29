import type { Company } from "../../../../types/company";
import type { ApiResponse } from "../../response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllCompanies(token: string): Promise<Company[]> {
  const response = await fetch(`${API_BASE_URL}/api/company/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result: ApiResponse<Company[]> = await response.json();
  console.log("API response for getAllCompanies:", result);

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch companies");
  }

  return result.data ?? [];
}
