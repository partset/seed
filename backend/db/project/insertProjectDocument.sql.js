module.exports = {
  insertProjectDocument: `
    INSERT INTO project_documents (
      project_id,
      title,
      category,
      description,
      file_name,
      file_type,
      file_url,
      file_size_bytes,
      is_visible_to_client,
      uploaded_by_admin_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
      id,
      project_id AS "projectId",
      title,
      category,
      description,
      file_name AS "fileName",
      file_type AS "fileType",
      file_url AS "fileUrl",
      file_size_bytes AS "fileSizeBytes",
      is_visible_to_client AS "isVisibleToClient",
      created_at AS "createdAt",
      uploaded_by_admin_id AS "uploadedByAdminId";
  `,

  getAdminByAuthUserId: `
    SELECT
      id,
      email
    FROM admin_users
    WHERE auth_user_id = $1
      AND is_active = true
    LIMIT 1;
  `,

  getProjectById: `
    SELECT id
    FROM projects
    WHERE id = $1
    LIMIT 1;
  `,
};
