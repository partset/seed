module.exports = {
  insertProjectMilestone: `
    INSERT INTO project_milestones (
      project_id,
      label,
      display_order,
      status,
      created_at
    )
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING 
      id,
      project_id,
      label,
      display_order,
      status,
      created_at
  `,
};
