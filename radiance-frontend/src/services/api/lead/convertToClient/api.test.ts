import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { convertLeadToClient } from "./api";

const originalFetch = globalThis.fetch;

describe("convertLeadToClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("calls the convert endpoint with correct request data", async () => {
    const mockResponse = {
      success: true,
      data: {
        message: "Lead converted to client successfully",
        company: {
          id: "company-123",
          name: "Acme Co",
          primary_email: "alex@test.com",
          primary_phone: "1234567890",
        },
        project: {
          id: "project-123",
          company_id: "company-123",
          name: "Acme Co - Business Website",
          status: "active",
        },
      },
      error: "",
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await convertLeadToClient("test-token", "lead-123", {
      companyName: "Acme Co",
      email: "alex@test.com",
      phone: "1234567890",
      projectType: "Business Website",
      projectName: "Acme Co - Business Website",
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/lead/lead-123/convert-to-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify({
          companyName: "Acme Co",
          email: "alex@test.com",
          phone: "1234567890",
          projectType: "Business Website",
          projectName: "Acme Co - Business Website",
        }),
      },
    );

    expect(result).toEqual(mockResponse);
  });

  it("throws api error message when request fails", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: {},
        error: "Failed to convert lead to client.",
      }),
    } as Response);

    await expect(
      convertLeadToClient("test-token", "lead-123", {
        companyName: "Acme Co",
        email: "alex@test.com",
        phone: "1234567890",
        projectType: "Business Website",
      }),
    ).rejects.toThrow("Failed to convert lead to client.");
  });

  it("throws fallback error for unknown failure", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue("unknown");

    await expect(
      convertLeadToClient("test-token", "lead-123", {
        companyName: "Acme Co",
        email: "alex@test.com",
        phone: "1234567890",
        projectType: "Business Website",
      }),
    ).rejects.toThrow("Failed to convert lead to client.");
  });
});
