const db = require("../dbClient");
const getProjectsByCompanyIdQuery = require("../../db/project/getProjectByCompanyId.sql");

async function getProjectsByCompanyIdService(companyId) {
  const result = await db.query(
    getProjectsByCompanyIdQuery.getProjectsByCompanyId,
    [companyId],
  );

  return result.rows.map((project) => ({
    id: project.id,
    name: project.name,
    currentPhase: project.current_phase,
    nextStep: project.next_step,
    status: project.status,
    clientVisibleSummary: project.client_visible_summary,
  }));
}

module.exports = { getProjectsByCompanyIdService };
