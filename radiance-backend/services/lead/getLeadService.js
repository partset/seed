const db = require("../dbClient");
const getLeadQuery = require("../../db/lead/getLead.sql");

async function getLeadService(leadId) {
  const result = await db.query(getLeadQuery.getLead, [leadId]);

  return result.rows[0];
}

module.exports = { getLeadService };
