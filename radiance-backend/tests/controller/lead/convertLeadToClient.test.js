const {
  convertLeadToClient,
} = require("../../../controllers/lead/convertLeadToClient");
const {
  convertLeadToClientService,
} = require("../../../services/lead/convertLeadToClientService");

jest.mock("../../../services/lead/convertLeadToClientService", () => ({
  convertLeadToClientService: jest.fn(),
}));

describe("convertLeadToClient controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: { id: "lead-123" },
      body: {
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 201 with converted company and project data", async () => {
    convertLeadToClientService.mockResolvedValue({
      message: "Lead converted to client successfully",
      company: {
        id: "company-123",
        name: "Radiance",
        primary_email: "alex@example.com",
        primary_phone: "1234567890",
      },
      project: {
        id: "project-123",
        company_id: "company-123",
        name: "Radiance - web app",
        status: "active",
      },
    });

    await convertLeadToClient(req, res, next);

    expect(convertLeadToClientService).toHaveBeenCalledWith({
      leadId: "lead-123",
      companyName: "Radiance",
      email: "alex@example.com",
      phone: "1234567890",
      projectType: "web app",
      projectName: "",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        message: "Lead converted to client successfully",
        company: {
          id: "company-123",
          name: "Radiance",
          primary_email: "alex@example.com",
          primary_phone: "1234567890",
        },
        project: {
          id: "project-123",
          company_id: "company-123",
          name: "Radiance - web app",
          status: "active",
        },
      },
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when service throws", async () => {
    const error = new Error("Database failure");
    convertLeadToClientService.mockRejectedValue(error);

    await convertLeadToClient(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
