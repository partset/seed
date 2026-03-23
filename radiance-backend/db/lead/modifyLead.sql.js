module.exports = {
  modifyLead: `
  UPDATE public.leads
  SET
    first_name   = COALESCE($2, first_name),
    last_name    = COALESCE($3, last_name),
    email        = COALESCE($4, email),
    phone        = COALESCE($5, phone),
    company_name = COALESCE($6, company_name),
    project_type = COALESCE($7, project_type),
    message      = COALESCE($8, message),
    status       = COALESCE($9, status)
  WHERE id = $1
  RETURNING *;
`,
};
