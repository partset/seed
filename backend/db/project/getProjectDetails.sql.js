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
      COALESCE(D.documents, '[]'::json) AS documents,

      B.invoice_id AS billing_invoice_id,
      B.invoice_number AS billing_invoice_number,
      B.amount_cents AS billing_amount_cents,
      B.amount_paid_cents AS billing_amount_paid_cents,
      B.balance_due_cents AS billing_balance_due_cents,
      B.currency AS billing_currency,
      B.due_date AS billing_due_date,
      B.status AS billing_status

    FROM projects P

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', PU.id,
          'title', PU.title,
          'description', PU.description,
          'isVisibleToClient', PU.is_visible_to_client,
          'createdAt', PU.created_at,
          'createdByAdminId', PU.created_by_admin_id,
          'createdByAdminEmail', AU.email
        )
        ORDER BY PU.created_at DESC
      ) AS updates
      FROM project_updates PU
      LEFT JOIN admin_users AU
        ON AU.id = PU.created_by_admin_id
      WHERE PU.project_id = P.id
    ) U ON true

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', PM.id,
          'label', PM.label,
          'displayOrder', PM.display_order,
          'status', PM.status,
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

    LEFT JOIN LATERAL (
      SELECT
        I.id AS invoice_id,
        I.invoice_number,
        I.amount_cents,
        I.amount_paid_cents,
        COALESCE(I.balance_due_cents, I.amount_cents - I.amount_paid_cents) AS balance_due_cents,
        I.currency,
        I.due_date,
        I.status
      FROM invoices I
      WHERE I.project_id = P.id
        AND I.status != 'void'
      ORDER BY 
        CASE 
          WHEN I.status = 'overdue' THEN 1
          WHEN I.status = 'unpaid' THEN 2
          WHEN I.status = 'draft' THEN 3
          WHEN I.status = 'paid' THEN 4
          ELSE 5
        END,
        I.due_date ASC NULLS LAST,
        I.created_at DESC
      LIMIT 1
    ) B ON true

    WHERE P.id = $1;
  `,
};
