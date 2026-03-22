const db = require("../dbClient");
const getAllLeadsQuery = require("../../db/lead/getAllLeads.sql");

async function getAllLeadsService() {
  const result = await db.query(getAllLeadsQuery.getAllLeads, []);

  return result.rows;
}

module.exports = { getAllLeadsService };
