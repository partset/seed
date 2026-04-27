module.exports = {
  getProjectCompany: `
    SELECT company_id
    FROM projects
    WHERE id = $1
    LIMIT 1
  `,
};
