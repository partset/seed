import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { convertLeadToClient } from "./api";

describe("convertLeadToClient api service", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns response data when request succeeds", async () => {
    const mockResponse = {
      success: true,
      data: {
        message:
          "Lead converted to client successfully. The client can now use first-time setup with an email code.",
        company: {
          id: "company-1",
          name: "Acme Co",
          primary_email: "client@test.com",
          primary_phone: "1234567890",
        },
        project: {
          id: "project-1",
          company_id: "company-1",
          name: "Acme Co - Business Website",
          status: "began",
        },
        clientUser: {
          id: "client-user-1",
          auth_user_id: "auth-user-1",
          company_id: "company-1",
          email: "client@test.com",
          first_name: "Alex",
          last_name: "Pham",
          is_active: true,
        },
        lead: {
          id: "lead-123",
          status: "Converted to Client",
        },
      },
      error: "",
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    }) as unknown as typeof fetch;

    const payload = {
      companyName: "Acme Co",
      email: "client@test.com",
      phone: "1234567890",
      projectType: "Business Website",
      projectName: "Acme Co - Business Website",
      firstName: "Alex",
      lastName: "Pham",
    };

    const result = await convertLeadToClient("token-123", "lead-123", payload);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/lead/lead-123/convert-to-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token-123",
        },
        body: JSON.stringify(payload),
      },
    );

    expect(result).toEqual(mockResponse);
  });

  it("throws backend error when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        success: false,
        data: null,
        error: "Client already exists.",
      }),
    }) as unknown as typeof fetch;

    await expect(
      convertLeadToClient("token-123", "lead-123", {
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toThrow("Client already exists.");
  });

  it("throws backend error when success is false", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        success: false,
        data: null,
        error: "Failed to convert lead.",
      }),
    }) as unknown as typeof fetch;

    await expect(
      convertLeadToClient("token-123", "lead-123", {
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toThrow("Failed to convert lead.");
  });

  it("throws fallback error when fetch rejects with non-Error", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue("network failure") as unknown as typeof fetch;

    await expect(
      convertLeadToClient("token-123", "lead-123", {
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toThrow(
      "Failed to convert lead to client and create portal user.",
    );
  });

  it("rethrows original Error when fetch rejects with an Error", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Network down")) as unknown as typeof fetch;

    await expect(
      convertLeadToClient("token-123", "lead-123", {
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      }),
    ).rejects.toThrow("Network down");
  });
});
