const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { ApiResponse } from "../../response";
import type {
  ProjectMilestone,
  InsertProjectMilestonePayload,
} from "../../../../types/projectMilestone";

export const insertProjectMilestone = async (
  payload: InsertProjectMilestonePayload,
  accessToken: string,
): Promise<ProjectMilestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/project/milestone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse<ProjectMilestone> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to project milestone.");
    }

    return data.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to project milestone.");
  }
};
