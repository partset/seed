const db = require("../../services/dbClient");
const insertContactQuery = require("../../db/contact/insertContact.sql");

async function insertContactService({
  firstName,
  lastName,
  email,
  phone,
  companyName,
  projectType,
  message,
}) {
  await db.query(insertContactQuery.insertContact, [
    firstName.trim(),
    lastName.trim(),
    email.trim().toLowerCase(),
    phone,
    companyName.trim(),
    projectType.trim().toLowerCase(),
    message.trim(),
  ]);

  return { message: "Contact inserted successfully" };
}

module.exports = { insertContactService };
