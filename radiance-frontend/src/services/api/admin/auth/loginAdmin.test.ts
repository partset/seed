import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAdmin } from "./loginAdmin";
import { supabase } from "../../../../lib/supabase";
import { checkAdmin } from "./checkAdmin";

vi.mock("../../../../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock("./checkAdmin", () => ({
  checkAdmin: vi.fn(),
}));

describe("loginAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in successfully when user is an admin", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          email: "alex@example.com",
        },
        session: {
          access_token: "valid-token",
        },
      },
      error: null,
    } as any);

    vi.mocked(checkAdmin).mockResolvedValue({
      success: true,
      data: {
        authUserId: "user-123",
        isAdmin: true,
      },
      error: "",
    });

    const result = await loginAdmin({
      email: "alex@example.com",
      password: "password123",
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "alex@example.com",
      password: "password123",
    });

    expect(checkAdmin).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();

    expect(result).toEqual({
      user: {
        id: "user-123",
        email: "alex@example.com",
      },
      session: {
        access_token: "valid-token",
      },
    });
  });

  it("throws when Supabase sign-in fails", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: "Invalid login credentials",
      },
    } as any);

    await expect(
      loginAdmin({
        email: "alex@example.com",
        password: "wrongpassword",
      }),
    ).rejects.toThrow("Invalid login credentials");

    expect(checkAdmin).not.toHaveBeenCalled();
  });

  it("signs out and throws when user is not an admin", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: "user-456",
          email: "notadmin@example.com",
        },
        session: {
          access_token: "valid-token",
        },
      },
      error: null,
    } as any);

    vi.mocked(checkAdmin).mockResolvedValue({
      success: true,
      data: {
        authUserId: "user-456",
        isAdmin: false,
      },
      error: "",
    });

    await expect(
      loginAdmin({
        email: "notadmin@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("You do not have access to the admin portal.");

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it("signs out and throws when admin verification request fails", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: "user-789",
          email: "alex@example.com",
        },
        session: {
          access_token: "valid-token",
        },
      },
      error: null,
    } as any);

    vi.mocked(checkAdmin).mockRejectedValue(
      new Error("Failed to verify admin."),
    );

    await expect(
      loginAdmin({
        email: "alex@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Failed to verify admin.");

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
