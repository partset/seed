jest.mock("../../../services/lead/convertLeadToClientService", () => ({
  convertLeadToClientService: jest.fn(),
}));

const {
  convertLeadToClientService,
} = require("../../../services/lead/convertLeadToClientService");
const {
  convertLeadToClient,
} = require("../../../controllers/lead/convertLeadToClient");

describe("convertLeadToClient controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: "lead-123",
      },
      body: {
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("returns 201 with converted client data", async () => {
    const mockResult = {
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
    };

    convertLeadToClientService.mockResolvedValue(mockResult);

    await convertLeadToClient(req, res, next);

    expect(convertLeadToClientService).toHaveBeenCalledTimes(1);
    expect(convertLeadToClientService).toHaveBeenCalledWith({
      leadId: "lead-123",
      companyName: "Acme Co",
      email: "client@test.com",
      phone: "1234567890",
      projectType: "Business Website",
      projectName: "Acme Co - Business Website",
      firstName: "Alex",
      lastName: "Pham",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResult,
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the service throws", async () => {
    const error = new Error("Service failure");
    convertLeadToClientService.mockRejectedValue(error);

    await convertLeadToClient(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
