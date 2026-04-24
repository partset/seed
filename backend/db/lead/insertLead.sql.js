module.exports = {
  insertLead: `
    INSERT INTO leads (first_name, last_name, email, phone, company_name, project_type, message, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  `,
};
