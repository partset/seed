const { modifyLead } = require("../../../controllers/lead/modifyLead");
const {
  modifyLeadService,
} = require("../../../services/lead/modifyLeadService");

jest.mock("../../../services/lead/modifyLeadService", () => ({
  modifyLeadService: jest.fn(),
}));

describe("modifyLead controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: "lead-123" },
      body: {
        status: "Contacted",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("calls modifyLeadService with req.params.id and req.body", async () => {
    modifyLeadService.mockResolvedValue({
      id: "lead-123",
      status: "Contacted",
    });

    await modifyLead(req, res, next);

    expect(modifyLeadService).toHaveBeenCalledTimes(1);
    expect(modifyLeadService).toHaveBeenCalledWith("lead-123", {
      status: "Contacted",
    });
  });

  it("returns 200 and the standard success response on success", async () => {
    const updatedLead = {
      id: "lead-123",
      status: "Contacted",
    };

    modifyLeadService.mockResolvedValue(updatedLead);

    await modifyLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedLead,
      error: "",
    });
  });

  it("passes errors to next", async () => {
    const error = new Error("Something went wrong");
    modifyLeadService.mockRejectedValue(error);

    await modifyLead(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
