module.exports = {
  getCompanyById: `
    SELECT P.id, P.name, P.current_phase, P.next_step, P.status, P.client_visible_summary
    FROM projects AS P, companies AS C
    WHERE C.id = $1 AND P.company_id = $1
`,
};
