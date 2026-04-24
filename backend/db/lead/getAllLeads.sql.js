module.exports = {
  getAllLeads: `
    SELECT
        id,
        created_at,
        first_name,
        last_name,
        email,
        phone,
        company_name,
        project_type,
        message,
        status
    FROM leads
    ORDER BY created_at DESC
  `,
};
