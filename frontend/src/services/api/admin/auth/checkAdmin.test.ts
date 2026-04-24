import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkAdmin } from "./checkAdmin";
import { supabase } from "../../../../lib/supabase";

vi.mock("../../../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("checkAdmin", () => {
  it("verifies admin successfully", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          access_token: "valid-token",
        },
      },
      error: null,
    } as any);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          authUserId: "user-123",
          isAdmin: true,
        },
        error: "",
      }),
    });

    const result = await checkAdmin();

    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/check-admin"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer valid-token",
        },
      }),
    );

    expect(result).toEqual({
      success: true,
      data: {
        authUserId: "user-123",
        isAdmin: true,
      },
      error: "",
    });
  });

  it("throws when there is no active session", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    } as any);

    await expect(checkAdmin()).rejects.toThrow("No active session found.");

    expect(fetch).not.toHaveBeenCalled();
  });

  it("throws backend error when admin verification fails", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          access_token: "valid-token",
        },
      },
      error: null,
    } as any);

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: {},
        error: "Failed to verify admin.",
      }),
    });

    await expect(checkAdmin()).rejects.toThrow("Failed to verify admin.");
  });
});
