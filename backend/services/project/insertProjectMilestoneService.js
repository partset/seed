const db = require("../dbClient");
const insertProjectMilestoneQuery = require("../../db/project/insertProjectMilestone.sql");

async function insertProjectMilestoneService({
  projectId,
  label,
  displayOrder,
  status,
}) {
  const result = await db.query(
    insertProjectMilestoneQuery.insertProjectMilestone,
    [
      projectId.trim(),
      label.trim(),
      Number(displayOrder),
      status.trim().toLowerCase(),
    ],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    projectId: row.project_id,
    label: row.label,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
  };
}

module.exports = { insertProjectMilestoneService };
