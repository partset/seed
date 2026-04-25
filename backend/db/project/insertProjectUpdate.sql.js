module.exports = {
  insertProjectUpdate: `
    WITH matched_admin AS (
      SELECT id, email
      FROM admin_users
      WHERE auth_user_id = $5
      LIMIT 1
    ),
    inserted_update AS (
      INSERT INTO project_updates (
        project_id,
        title,
        description,
        is_visible_to_client,
        created_by_admin_id,
        created_at
      )
      SELECT
        $1,
        $2,
        $3,
        $4,
        MA.id,
        NOW()
      FROM matched_admin MA
      RETURNING 
        id,
        project_id,
        title,
        description,
        is_visible_to_client,
        created_by_admin_id,
        created_at
    )
    SELECT
      IU.id,
      IU.project_id,
      IU.title,
      IU.description,
      IU.is_visible_to_client,
      IU.created_by_admin_id,
      IU.created_at,
      AU.email AS created_by_admin_email,
      COALESCE(AU.email, 'Admin') AS created_by_admin_name
    FROM inserted_update IU
    LEFT JOIN admin_users AU
      ON AU.id = IU.created_by_admin_id;
  `,
};
