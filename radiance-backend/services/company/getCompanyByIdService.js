const db = require("../dbClient");
const getCompanyById = require("../../db/company/getCompanyById.sql");

async function getCompanyByIdService(companyId) {
  const result = await db.query(getCompanyById.getCompanyById, [companyId]);

  return result.rows.map((project) => ({
    id: project.id,
    name: project.name,
    currentPhase: project.current_phase,
    nextStep: project.next_step,
    status: project.status,
    clientVisibleSummary: project.client_visible_summary,
  }));
}

module.exports = { getCompanyByIdService };
