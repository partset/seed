const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { ApiResponse } from "../../response";
import type {
  InsertProjectUpdatePayload,
  ProjectUpdate,
} from "../../../../types/projectUpdate";

export const insertProjectUpdate = async (
  payload: InsertProjectUpdatePayload,
  accessToken: string,
): Promise<ProjectUpdate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/project/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<ProjectUpdate> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to insert project update.");
    }

    return data.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to insert project update.");
  }
};
