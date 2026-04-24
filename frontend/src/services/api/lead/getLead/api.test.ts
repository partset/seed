import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLead } from "./api";

describe("getLead", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("returns lead data on success", async () => {
    const mockLead = {
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
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockLead,
        error: "",
      }),
    } as Response);

    const result = await getLead("token", "lead-123");

    expect(result).toEqual(mockLead);
  });
});
