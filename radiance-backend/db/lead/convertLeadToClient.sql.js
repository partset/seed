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

  updateLeadStatusToConverted: `
    UPDATE leads
    SET status = 'Converted'
    WHERE id = $1
    RETURNING id, status
  `,
};
