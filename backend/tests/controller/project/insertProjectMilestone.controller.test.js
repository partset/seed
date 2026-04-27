const {
  insertProjectMilestone,
} = require("../../../controllers/project/insertProjectMilestone");
const {
  insertProjectMilestoneService,
} = require("../../../services/project/insertProjectMilestoneService");

jest.mock("../../../services/project/insertProjectMilestoneService", () => ({
  insertProjectMilestoneService: jest.fn(),
}));

function createMockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("insertProjectMilestone controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        label: "Design Phase",
        displayOrder: 1,
        status: "upcoming",
      },
    };

    res = createMockResponse();
    next = jest.fn();
  });

  it("returns 201 with the inserted milestone", async () => {
    const insertedMilestone = {
      id: "milestone-123",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
      createdAt: "2026-04-26T12:00:00.000Z",
    };

    insertProjectMilestoneService.mockResolvedValue(insertedMilestone);

    await insertProjectMilestone(req, res, next);

    expect(insertProjectMilestoneService).toHaveBeenCalledTimes(1);
    expect(insertProjectMilestoneService).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: insertedMilestone,
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("passes errors to next", async () => {
    const error = new Error("Insert failed");

    insertProjectMilestoneService.mockRejectedValue(error);

    await insertProjectMilestone(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
