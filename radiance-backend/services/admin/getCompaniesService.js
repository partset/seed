const db = require("../../services/dbClient");
const getCompaniesQuery = require("../../db/admin/load/getCompanies.sql");

async function getCompaniesService() {
  const result = await db.query(getCompaniesQuery.getCompanies);

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

module.exports = { getCompaniesService };
