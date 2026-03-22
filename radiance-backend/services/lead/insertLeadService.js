const db = require("../dbClient");
const insertLeadQuery = require("../../db/lead/insertLead.sql");

async function insertLeadService({
  firstName,
  lastName,
  email,
  phone,
  companyName,
  projectType,
  message,
}) {
  await db.query(insertLeadQuery.insertLead, [
    firstName.trim(),
    lastName.trim(),
    email.trim().toLowerCase(),
    phone,
    companyName.trim(),
    projectType.trim().toLowerCase(),
    message.trim(),
  ]);

  return { message: "Lead inserted successfully" };
}

module.exports = { insertLeadService };
