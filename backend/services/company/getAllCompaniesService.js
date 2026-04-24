const db = require("../dbClient");
const getAllCompaniesQuery = require("../../db/company/getAllCompanies.sql");

async function getAllCompaniesService() {
  const result = await db.query(getAllCompaniesQuery.getAllCompanies);

  return result.rows.map((company) => ({
    id: company.id,
    name: company.name,
    primaryEmail: company.primary_email,
    primaryPhone: company.primary_phone,
    totalProjects: parseInt(company.total_projects, 10),
    activeProjects: parseInt(company.active_projects, 10),
    latestProjectName: company.latest_project_name,
  }));
}

module.exports = { getAllCompaniesService };
