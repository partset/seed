module.exports = {
  getProjectPaymentDetails: `
    SELECT
        p.id AS project_id,
        p.name AS project_name,
        p.company_id,
        c.name AS company_name,

        bp.id AS billing_plan_id,
        bp.billing_type,
        bp.total_amount_cents,
        bp.monthly_amount_cents,
        bp.deposit_amount_cents,
        bp.currency AS billing_currency,
        bp.start_date AS billing_start_date,
        bp.end_date AS billing_end_date,
        bp.status AS billing_status,

        i.id AS invoice_id,
        i.invoice_number,
        i.amount_cents,
        i.amount_paid_cents,
        COALESCE(i.balance_due_cents, i.amount_cents - i.amount_paid_cents) AS balance_due_cents,
        i.currency AS invoice_currency,
        i.due_date,
        i.status AS invoice_status,
        i.issued_at,
        i.paid_at,
        i.period_start,
        i.period_end

    FROM projects p

    INNER JOIN companies c
        ON c.id = p.company_id

    LEFT JOIN LATERAL (
        SELECT bp.*
        FROM billing_plans bp
        WHERE bp.project_id = p.id
          AND bp.status IN ('active', 'draft', 'paused')
        ORDER BY
          CASE bp.status
            WHEN 'active' THEN 1
            WHEN 'draft' THEN 2
            WHEN 'paused' THEN 3
            ELSE 4
          END,
          bp.created_at DESC
        LIMIT 1
    ) bp ON true

    LEFT JOIN LATERAL (
        SELECT i.*
        FROM invoices i
        WHERE i.project_id = p.id
          AND i.status != 'void'
        ORDER BY
          CASE i.status
            WHEN 'overdue' THEN 1
            WHEN 'unpaid' THEN 2
            WHEN 'draft' THEN 3
            WHEN 'paid' THEN 4
            ELSE 5
          END,
          i.due_date ASC NULLS LAST,
          i.created_at DESC
        LIMIT 1
    ) i ON true

    WHERE p.id = $1
    LIMIT 1;
  `,
};
