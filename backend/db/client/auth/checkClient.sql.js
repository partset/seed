module.exports = {
  checkClient: `
    SELECT EXISTS (
        SELECT 1
        FROM client_users
        WHERE auth_user_id = $1
            AND is_active = true
    ) AS is_client;
  `,
};
