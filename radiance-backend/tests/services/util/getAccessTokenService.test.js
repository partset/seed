jest.mock("../../../services/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

const { supabase } = require("../../../services/supabaseClient");
const {
  getAccessTokenService,
} = require("../../../services/util/getAccessTokenService");

describe("getAccessTokenService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      TEST_ADMIN_EMAIL: "testadmin@example.com",
      TEST_ADMIN_PASSWORD: "supersecretpassword",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("calls supabase.auth.signInWithPassword with test admin credentials", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: "access-token-123",
          refresh_token: "refresh-token-123",
          expires_at: 9999999999,
        },
      },
      error: null,
    });

    await getAccessTokenService();

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "testadmin@example.com",
      password: "supersecretpassword",
    });
  });

  it("returns access token data when sign in succeeds", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: "access-token-123",
          refresh_token: "refresh-token-123",
          expires_at: 9999999999,
        },
      },
      error: null,
    });

    const result = await getAccessTokenService();

    expect(result).toEqual({
      access_token: "access-token-123",
      refresh_token: "refresh-token-123",
      expires_at: 9999999999,
    });
  });

  it("throws when supabase returns an error", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    await expect(getAccessTokenService()).rejects.toThrow(
      "Failed to sign in test admin",
    );
  });

  it("throws when no session is returned", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(getAccessTokenService()).rejects.toThrow(
      "No session returned",
    );
  });
});
