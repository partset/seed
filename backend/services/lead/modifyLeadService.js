const db = require("../dbClient");
const modifyLeadQuery = require("../../db/lead/modifyLead.sql");

async function modifyLeadService(leadId, updates) {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    projectType,
    message,
    status,
  } = updates;

  const result = await db.query(modifyLeadQuery.modifyLead, [
    leadId,
    firstName ? firstName.trim() : null,
    lastName ? lastName.trim() : null,
    email ? email.trim().toLowerCase() : null,
    phone ?? null,
    companyName ? companyName.trim() : null,
    projectType ? projectType.trim() : null,
    message ? message.trim() : null,
    status ? status.trim() : null,
  ]);

  if (result.rows.length === 0) {
    const error = new Error("Lead not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

module.exports = { modifyLeadService };
