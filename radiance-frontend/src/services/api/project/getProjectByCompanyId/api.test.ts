import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProjectByCompanyId } from "./api";

describe("getProjectByCompanyId", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns project data when the API call succeeds", async () => {
    const mockProjects = [
      {
        id: "project-1",
        name: "Client Portal",
        status: "active",
        currentPhase: "Development",
        nextStep: "Write tests",
        startDate: "2026-03-01",
        targetLaunchDate: "2026-04-01",
        clientVisibleSummary: "In progress",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProjects,
          error: "",
        }),
      }),
    );

    const result = await getProjectByCompanyId("mock-token", "company-1");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/project/company-1"),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      }),
    );
    expect(result).toEqual(mockProjects);
  });

  it("returns an empty array when data is nullish", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: null,
          error: "",
        }),
      }),
    );

    const result = await getProjectByCompanyId("mock-token", "company-1");

    expect(result).toEqual([]);
  });

  it("throws an error when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          data: null,
          error: "Failed to fetch project by company ID",
        }),
      }),
    );

    await expect(
      getProjectByCompanyId("mock-token", "company-1"),
    ).rejects.toThrow("Failed to fetch project by company ID");
  });

  it("throws the fallback error when the API does not provide one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          data: null,
          error: "",
        }),
      }),
    );

    await expect(
      getProjectByCompanyId("mock-token", "company-1"),
    ).rejects.toThrow("Failed to fetch project by company ID");
  });
});
