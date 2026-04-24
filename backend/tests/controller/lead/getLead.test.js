jest.mock("../../../services/lead/getLeadService", () => ({
  getLeadService: jest.fn(),
}));

const { getLeadService } = require("../../../services/lead/getLeadService");
const { getLead } = require("../../../controllers/lead/getLead");

describe("getLead controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: "lead-123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("returns 200 with the lead data", async () => {
    const mockLead = {
      id: "lead-123",
      company_name: "Acme Co",
      first_name: "Alex",
      last_name: "Pham",
      email: "alex@test.com",
      phone: "1234567890",
      project_type: "Business Website",
      status: "New",
      created_at: "2026-03-22T12:00:00.000Z",
    };

    getLeadService.mockResolvedValue(mockLead);

    await getLead(req, res, next);

    expect(getLeadService).toHaveBeenCalledTimes(1);
    expect(getLeadService).toHaveBeenCalledWith("lead-123");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockLead,
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns 200 with undefined data when no lead is found", async () => {
    getLeadService.mockResolvedValue(undefined);

    await getLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: "Lead not found",
    });
  });

  it("calls next when the service throws", async () => {
    const error = new Error("Database failure");
    getLeadService.mockRejectedValue(error);

    await getLead(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
