import { submitLead } from "./api";

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("submitLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits lead data successfully", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { leadId: "123" },
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

    const result = await submitLead(payload);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/lead/insert"),
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
      data: { leadId: "123" },
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
      submitLead({
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
