const db = require("../../services/dbClient");
const checkAdminQuery = require("../../db/admin/auth/checkAdmin.sql");

async function checkAdminService(authUserId) {
  const result = await db.query(checkAdminQuery.checkAdmin, [authUserId]);

  return {
    authUserId,
    isAdmin: result.rows[0]?.is_admin ?? false,
  };
}

module.exports = { checkAdminService };
