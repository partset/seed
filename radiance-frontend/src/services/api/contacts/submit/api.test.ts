import { submitContact } from "./api";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("submitContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits contact data successfully", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { contactId: "123" },
        error: "",
      }),
    });

    const payload = {
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "(555) 123-4567",
      companyName: "Seed",
      projectType: "Landing Page",
      message: "I need a landing page for my business.",
    };

    const result = await submitContact(payload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/contact/insert"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }),
    );

    expect(result).toEqual({
      success: true,
      data: { contactId: "123" },
      error: "",
    });
  });

  it("throws backend error when request fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        data: {},
        error: "Insert failed.",
      }),
    });

    await expect(
      submitContact({
        firstName: "Alex",
        lastName: "Pham",
        email: "alex@example.com",
        phone: "(555) 123-4567",
        companyName: "Seed",
        projectType: "Landing Page",
        message: "I need a landing page for my business.",
      }),
    ).rejects.toThrow("Insert failed.");
  });
});
