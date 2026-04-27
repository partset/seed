const db = require("../../services/dbClient");
const checkClientQuery = require("../../db/client/auth/checkClient.sql");

async function checkClientService(authUserId) {
  const result = await db.query(checkClientQuery.checkClient, [authUserId]);

  const row = result.rows[0];

  return {
    authUserId,
    isClient: row?.is_client ?? false,
    companyId: row?.company_id ?? null,
  };
}

module.exports = { checkClientService };
