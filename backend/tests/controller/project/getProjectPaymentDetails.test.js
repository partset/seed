jest.mock("../../../services/project/getProjectPaymentDetailsService", () => ({
  getProjectPaymentDetailsService: jest.fn(),
}));

const {
  getProjectPaymentDetails,
} = require("../../../controllers/project/getProjectPaymentDetails");

const {
  getProjectPaymentDetailsService,
} = require("../../../services/project/getProjectPaymentDetailsService");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("getProjectPaymentDetails controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("returns 200 with project payment details", async () => {
    const req = {
      params: { projectId: "project-123" },
    };

    const res = createMockRes();

    const paymentDetails = {
      projectId: "project-123",
      companyId: "company-123",
      companyName: "Nguyen Dental Studio",
      projectName: "Website Redesign",
      billingPlan: null,
      invoice: null,
    };

    getProjectPaymentDetailsService.mockResolvedValue(paymentDetails);

    await getProjectPaymentDetails(req, res);

    expect(getProjectPaymentDetailsService).toHaveBeenCalledWith("project-123");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: paymentDetails,
      error: "",
    });
  });

  it("returns 404 when payment details are not found", async () => {
    const req = {
      params: { projectId: "missing-project" },
    };

    const res = createMockRes();

    getProjectPaymentDetailsService.mockResolvedValue(null);

    await getProjectPaymentDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project payment details not found.",
    });
  });

  it("returns 500 when the service throws", async () => {
    const req = {
      params: { projectId: "project-123" },
    };

    const res = createMockRes();

    getProjectPaymentDetailsService.mockRejectedValue(
      new Error("Database failed"),
    );

    await getProjectPaymentDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Failed to get project payment details.",
    });
  });
});
