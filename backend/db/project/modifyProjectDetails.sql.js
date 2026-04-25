module.exports = {
  modifyProjectDetails: `
    UPDATE public.projects
    SET
      name = CASE
        WHEN $2::boolean THEN $3
        ELSE name
      END,

      current_phase = CASE
        WHEN $4::boolean THEN $5
        ELSE current_phase
      END,

      next_step = CASE
        WHEN $6::boolean THEN $7
        ELSE next_step
      END,

      start_date = CASE
        WHEN $8::boolean THEN $9::date
        ELSE start_date
      END,

      status = CASE
        WHEN $10::boolean THEN $11
        ELSE status
      END,

      target_launch_date = CASE
        WHEN $12::boolean THEN $13::date
        ELSE target_launch_date
      END,

      client_visible_summary = CASE
        WHEN $14::boolean THEN $15
        ELSE client_visible_summary
      END

    WHERE id = $1
    RETURNING *
  `,
};
