// services/project/getProjectCompanyService.js
const db = require("../dbClient");
const getProjectCompanyQuery = require("../../db/project/getProjectCompany.sql");

async function getProjectCompanyService(projectId) {
  const result = await db.query(getProjectCompanyQuery.getProjectCompany, [
    projectId,
  ]);

  return result.rows[0]?.company_id || null;
}

module.exports = { getProjectCompanyService };
