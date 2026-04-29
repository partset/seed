module.exports = {
  getPayableInvoiceForCheckout: `
    SELECT
      p.id AS project_id,
      p.name AS project_name,
      p.company_id,
      c.name AS company_name,

      bp.id AS billing_plan_id,
      bp.billing_type,
      bp.status AS billing_plan_status,

      i.id AS invoice_id,
      i.invoice_number,
      i.amount_cents,
      i.amount_paid_cents,
      COALESCE(i.balance_due_cents, i.amount_cents - i.amount_paid_cents) AS balance_due_cents,
      i.currency,
      i.status AS invoice_status,
      i.due_date

    FROM projects p

    INNER JOIN companies c
      ON c.id = p.company_id

    INNER JOIN billing_plans bp
      ON bp.project_id = p.id

    INNER JOIN invoices i
      ON i.project_id = p.id
      AND i.billing_plan_id = bp.id

    WHERE p.id = $1
      AND ($2::uuid IS NULL OR i.id = $2::uuid)
      AND bp.status IN ('active', 'draft', 'paused')
      AND i.status IN ('unpaid', 'overdue', 'draft')
      AND COALESCE(i.balance_due_cents, i.amount_cents - i.amount_paid_cents) > 0

    ORDER BY
      CASE i.status
        WHEN 'overdue' THEN 1
        WHEN 'unpaid' THEN 2
        WHEN 'draft' THEN 3
        ELSE 4
      END,
      i.due_date ASC NULLS LAST,
      i.created_at DESC

    LIMIT 1;
  `,

  insertPendingStripePayment: `
    INSERT INTO payments (
      invoice_id,
      project_id,
      company_id,
      amount_cents,
      currency,
      payment_method,
      status,
      provider
    )
    VALUES ($1, $2, $3, $4, $5, 'card', 'pending', 'stripe')
    RETURNING id;
  `,

  attachStripeCheckoutSessionToPayment: `
    UPDATE payments
    SET provider_checkout_session_id = $1
    WHERE id = $2
    RETURNING id;
  `,
};
