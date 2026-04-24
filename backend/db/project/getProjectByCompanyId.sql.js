module.exports = {
  getProjectsByCompanyId: `
    SELECT P.id, P.name, P.current_phase, P.next_step, P.status, P.client_visible_summary, P.target_launch_date
    FROM projects AS P, companies AS C
    WHERE C.id = $1 AND P.company_id = $1
`,
};
