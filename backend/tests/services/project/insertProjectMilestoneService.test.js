const db = require("../../../services/dbClient");
const insertProjectMilestoneQuery = require("../../../db/project/insertProjectMilestone.sql");
const {
  insertProjectMilestoneService,
} = require("../../../services/project/insertProjectMilestoneService");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("insertProjectMilestoneService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts a project milestone and returns the formatted milestone", async () => {
    const mockRow = {
      id: "milestone-123",
      project_id: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      display_order: 1,
      status: "upcoming",
      created_at: "2026-04-26T12:00:00.000Z",
    };

    db.query.mockResolvedValue({
      rows: [mockRow],
    });

    const result = await insertProjectMilestoneService({
      projectId: " 550e8400-e29b-41d4-a716-446655440000 ",
      label: " Design Phase ",
      displayOrder: "1",
      status: "UPCOMING",
    });

    expect(db.query).toHaveBeenCalledTimes(1);

    expect(db.query).toHaveBeenCalledWith(
      insertProjectMilestoneQuery.insertProjectMilestone,
      ["550e8400-e29b-41d4-a716-446655440000", "Design Phase", 1, "upcoming"],
    );

    expect(result).toEqual({
      id: "milestone-123",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
      createdAt: "2026-04-26T12:00:00.000Z",
    });
  });

  it("throws when the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(
      insertProjectMilestoneService({
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        label: "Design Phase",
        displayOrder: 1,
        status: "upcoming",
      }),
    ).rejects.toThrow("Database error");
  });
});
