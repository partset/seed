module.exports = {
  checkClient: `
    SELECT 
      true AS is_client,
      company_id
    FROM client_users
    WHERE auth_user_id = $1
      AND is_active = true
    LIMIT 1;
  `,
};
