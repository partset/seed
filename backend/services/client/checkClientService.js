const db = require("../../services/dbClient");
const checkClientQuery = require("../../db/client/auth/checkClient.sql");

async function checkClientService(authUserId) {
  const result = await db.query(checkClientQuery.checkClient, [authUserId]);

  return {
    authUserId,
    isClient: result.rows[0]?.is_client ?? false,
  };
}

module.exports = { checkClientService };
