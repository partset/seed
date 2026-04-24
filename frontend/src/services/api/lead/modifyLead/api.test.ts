import { describe, it, expect, vi, beforeEach } from "vitest";
import { modifyLead } from "./api";

const mockLead = {
  id: "lead-123",
  company_name: "Acme Co",
  first_name: "Alex",
  last_name: "Pham",
  email: "alex@test.com",
  phone: "1234567890",
  project_type: "Business Website",
  message: "Need a website",
  status: "New" as const,
  created_at: "2026-03-22T00:00:00.000Z",
};

describe("modifyLead", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the modify lead endpoint with correct request data", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockLead,
        error: "",
      }),
    } as Response);

    const updates = {
      firstName: "Alexander",
      status: "Reviewing" as const,
    };

    const result = await modifyLead("test-token", "lead-123", updates);

    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/lead/lead-123`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify(updates),
      },
    );

    expect(result).toEqual(mockLead);
  });

  it("throws the backend error message when request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: {},
        error: "Failed to update lead",
      }),
    } as Response);

    await expect(
      modifyLead("test-token", "lead-123", { firstName: "Alexander" }),
    ).rejects.toThrow("Failed to update lead");
  });

  it("throws fallback error message when request fails without backend error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: {},
        error: "",
      }),
    } as Response);

    await expect(
      modifyLead("test-token", "lead-123", { firstName: "Alexander" }),
    ).rejects.toThrow("Failed to update lead");
  });
});
