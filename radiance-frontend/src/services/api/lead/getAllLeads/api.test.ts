import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAllLeads } from "./api";

describe("getAllLeads", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("returns leads data on success", async () => {
    const mockLeads = [
      {
        id: "lead-123",
        company_name: "Acme Co",
        first_name: "Alex",
        last_name: "Pham",
        email: "alex@test.com",
        phone: "1234567890",
        project_type: "Business Website",
        timeline: "2-4 weeks",
        message: "Need a website",
        status: "New",
        created_at: "2026-03-22",
      },
      {
        id: "lead-456",
        company_name: "Beta Co",
        first_name: "Jamie",
        last_name: "Lee",
        email: "jamie@test.com",
        phone: "5555555555",
        project_type: "E-commerce",
        timeline: "1-2 months",
        message: "Need an online store",
        status: "Reviewing",
        created_at: "2026-03-21",
      },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockLeads,
        error: "",
      }),
    } as Response);

    const result = await getAllLeads("token");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/lead/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      },
    );

    expect(result).toEqual(mockLeads);
  });

  it("returns an empty array when api returns no leads", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        error: "",
      }),
    } as Response);

    const result = await getAllLeads("token");

    expect(result).toEqual([]);
  });

  it("throws backend error when response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: null,
        error: "Failed to fetch leads",
      }),
    } as Response);

    await expect(getAllLeads("token")).rejects.toThrow("Failed to fetch leads");
  });

  it("throws default error when response is not ok and error is empty", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: null,
        error: "",
      }),
    } as Response);

    await expect(getAllLeads("token")).rejects.toThrow("Failed to fetch leads");
  });

  it("throws when success is false even if response is ok", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        data: null,
        error: "Unable to load leads",
      }),
    } as Response);

    await expect(getAllLeads("token")).rejects.toThrow("Unable to load leads");
  });
});
