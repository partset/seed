module.exports = {
  getCompanies: `
        SELECT
            c.id,
            c.name,
            c.primary_email,
            c.primary_phone,


        COUNT(p.id) AS total_projects,
        COUNT(*) FILTER (WHERE p.status = 'active') AS active_projects,


        latest_project.name AS latest_project_name


        FROM companies c


        LEFT JOIN projects p
        ON p.company_id = c.id


        LEFT JOIN LATERAL (
        SELECT
            name,
            id AS project_id
        FROM projects
        WHERE company_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
        ) latest_project ON true


        GROUP BY
        c.id,
        c.name,
        c.primary_email,
        c.primary_phone,
        latest_project.name,
        latest_project.project_id


        ORDER BY c.created_at DESC;
`,
};
