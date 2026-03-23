const db = require("../dbClient");
const convertLeadToClientQuery = require("../../db/lead/convertLeadToClient.sql");

async function convertLeadToClientService({
  leadId,
  companyName,
  email,
  phone,
  projectType,
  projectName,
}) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const normalizedCompanyName = companyName.trim();
    const normalizedEmail = email ? email.trim().toLowerCase() : null;
    const normalizedPhone = phone ? phone.trim() : null;
    const normalizedProjectType = projectType.trim().toLowerCase();
    const resolvedProjectName =
      projectName?.trim() ||
      `${normalizedCompanyName} - ${normalizedProjectType}`;

    const companyResult = await client.query(
      convertLeadToClientQuery.insertCompany,
      [normalizedCompanyName, normalizedEmail, normalizedPhone],
    );

    const company = companyResult.rows[0];

    const projectResult = await client.query(
      convertLeadToClientQuery.insertProject,
      [company.id, resolvedProjectName],
    );

    const project = projectResult.rows[0];

    await client.query(convertLeadToClientQuery.updateLeadStatusToConverted, [
      leadId,
    ]);

    await client.query("COMMIT");

    return {
      message: "Lead converted to client successfully",
      company,
      project,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { convertLeadToClientService };
