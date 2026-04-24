module.exports = {
  checkAdmin: `
    SELECT EXISTS (
        SELECT 1
        FROM admin_users
        WHERE auth_user_id = $1
            AND is_active = true
    ) AS is_admin;
  `,
};
