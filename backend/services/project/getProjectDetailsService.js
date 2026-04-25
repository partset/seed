const db = require("../dbClient");
const getProjectDetailsQuery = require("../../db/project/getProjectDetails.sql");

function formatDateOnly(value) {
  if (!value) return null;

  // If pg returns a JS Date object
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
}

async function getProjectDetailsService(projectId) {
  const result = await db.query(getProjectDetailsQuery.getProjectDetails, [
    projectId,
  ]);

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  return {
    id: row.project_id,
    name: row.project_name,
    currentPhase: row.project_current_phase,
    nextStep: row.project_next_step,
    startDate: formatDateOnly(row.project_start_date),
    targetLaunchDate: formatDateOnly(row.project_target_launch_date),
    clientVisibleSummary: row.project_client_visible_summary,
    updates: row.updates,
    milestones: row.milestones,
    documents: row.documents,
  };
}

module.exports = { getProjectDetailsService };
