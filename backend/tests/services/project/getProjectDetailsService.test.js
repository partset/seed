const db = require("../../../services/dbClient");
const {
  getProjectDetailsService,
} = require("../../../services/project/getProjectDetailsService");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("getProjectDetailsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns formatted project details when project exists", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          project_id: "550e8400-e29b-41d4-a716-446655440000",
          project_name: "Website Redesign",
          updates: [
            {
              updateId: "update-1",
              title: "Started design",
              description: "Homepage mockup started",
              isVisibleToClient: true,
              createdAt: "2026-04-24T12:00:00.000Z",
            },
          ],
          milestones: [
            {
              milestoneId: "milestone-1",
              label: "Design",
              displayOrder: 1,
              status: "current",
              completedAt: null,
              createdAt: "2026-04-24T12:00:00.000Z",
            },
          ],
        },
      ],
    });

    const result = await getProjectDetailsService(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "550e8400-e29b-41d4-a716-446655440000",
    ]);

    expect(result).toEqual({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      projectName: "Website Redesign",
      updates: [
        {
          updateId: "update-1",
          title: "Started design",
          description: "Homepage mockup started",
          isVisibleToClient: true,
          createdAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      milestones: [
        {
          milestoneId: "milestone-1",
          label: "Design",
          displayOrder: 1,
          status: "current",
          completedAt: null,
          createdAt: "2026-04-24T12:00:00.000Z",
        },
      ],
    });
  });

  it("returns null when project does not exist", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await getProjectDetailsService(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(result).toBeNull();
  });

  it("throws an error when the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(
      getProjectDetailsService("550e8400-e29b-41d4-a716-446655440000"),
    ).rejects.toThrow("Database error");
  });
});
