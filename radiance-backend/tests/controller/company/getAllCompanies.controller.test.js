jest.mock("../../../services/company/getAllCompaniesService", () => ({
  getAllCompaniesService: jest.fn(),
}));

const {
  getAllCompanies,
} = require("../../../controllers/company/getAllCompanies");
const {
  getAllCompaniesService,
} = require("../../../services/company/getAllCompaniesService");

describe("getAllCompanies controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 200 with companies data", async () => {
    const mockCompanies = [
      {
        id: "company-1",
        name: "Radiance",
        primaryEmail: "contact@radiance.com",
        primaryPhone: "2145551234",
        totalProjects: 3,
        activeProjects: 2,
        latestProjectName: "Radiance redesign",
      },
    ];

    getAllCompaniesService.mockResolvedValueOnce(mockCompanies);

    await getAllCompanies(req, res, next);

    expect(getAllCompaniesService).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockCompanies,
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 200 with an empty array when no companies exist", async () => {
    getAllCompaniesService.mockResolvedValueOnce([]);

    await getAllCompanies(req, res, next);

    expect(getAllCompaniesService).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(error) when service throws", async () => {
    const error = new Error("Database failure");
    getAllCompaniesService.mockRejectedValueOnce(error);

    await getAllCompanies(req, res, next);

    expect(getAllCompaniesService).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
