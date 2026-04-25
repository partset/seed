const db = require("../dbClient");
const insertProjectUpdateQuery = require("../../db/project/insertProjectUpdate.sql");

async function insertProjectUpdateService({
  projectId,
  title,
  description,
  isVisibleToClient,
  createdByAdminId,
}) {
  const result = await db.query(insertProjectUpdateQuery.insertProjectUpdate, [
    projectId,
    title.trim(),
    description.trim(),
    isVisibleToClient,
    createdByAdminId,
  ]);

  const row = result.rows[0];

  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    isVisibleToClient: row.is_visible_to_client,
    createdByAdminId: row.created_by_admin_id,
    createdAt: row.created_at,
    createdByAdminEmail: row.created_by_admin_email,
    createdByAdminName: row.created_by_admin_name,
  };
}

module.exports = { insertProjectUpdateService };
