module.exports = {
  insertCompany: `
    INSERT INTO companies (name, primary_email, primary_phone, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, name, primary_email, primary_phone
  `,

  insertProject: `
    INSERT INTO projects (company_id, name, status, created_at)
    VALUES ($1, $2, 'began', NOW())
    RETURNING id, company_id, name, status
  `,

  insertClientUser: `
    INSERT INTO client_users (
      auth_user_id,
      company_id,
      email,
      first_name,
      last_name,
      is_active,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, true, NOW())
    RETURNING id, auth_user_id, company_id, email, first_name, last_name, is_active
  `,

  updateLeadStatusToConverted: `
    UPDATE leads
    SET status = 'Converted to Client'
    WHERE id = $1
    RETURNING id, status
  `,
};
