module.exports = {
  getProjectDetails: `
    SELECT 
      P.id AS project_id,
      P.name AS project_name,
      P.current_phase AS project_current_phase,
      P.next_step AS project_next_step,
      P.start_date AS project_start_date,
      P.status AS project_status,
      P.target_launch_date AS project_target_launch_date,
      P.client_visible_summary AS project_client_visible_summary,

      COALESCE(U.updates, '[]'::json) AS updates,
      COALESCE(M.milestones, '[]'::json) AS milestones,
      COALESCE(D.documents, '[]'::json) AS documents

    FROM projects P

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', PU.id,
          'title', PU.title,
          'description', PU.description,
          'isVisibleToClient', PU.is_visible_to_client,
          'createdAt', PU.created_at
        )
        ORDER BY PU.created_at DESC
      ) AS updates
      FROM project_updates PU
      WHERE PU.project_id = P.id
    ) U ON true

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', PM.id,
          'label', PM.label,
          'displayOrder', PM.display_order,
          'status', PM.status,
          'completedAt', PM.completed_at,
          'createdAt', PM.created_at
        )
        ORDER BY PM.display_order ASC
      ) AS milestones
      FROM project_milestones PM
      WHERE PM.project_id = P.id
    ) M ON true

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', PD.id,
          'title', PD.title,
          'category', PD.category,
          'description', PD.description,
          'fileName', PD.file_name,
          'fileType', PD.file_type,
          'fileUrl', PD.file_url,
          'fileSizeBytes', PD.file_size_bytes,
          'isVisibleToClient', PD.is_visible_to_client,
          'createdAt', PD.created_at
        )
        ORDER BY PD.created_at DESC
      ) AS documents
      FROM project_documents PD
      WHERE PD.project_id = P.id
    ) D ON true

    WHERE P.id = $1;
  `,
};
