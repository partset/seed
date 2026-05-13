module.exports = {
  getBillingPlanForProject: `
    SELECT
      id,
      project_id,
      billing_type,
      total_amount_cents,
      monthly_amount_cents,
      deposit_amount_cents,
      currency,
      start_date,
      end_date,
      status,
      created_at
    FROM billing_plans
    WHERE id = $1
      AND project_id = $2;
  `,

  cancelBillingPlan: `
    UPDATE billing_plans
    SET status = 'cancelled'
    WHERE id = $1
      AND project_id = $2
    RETURNING
      id,
      project_id,
      billing_type,
      total_amount_cents,
      monthly_amount_cents,
      deposit_amount_cents,
      currency,
      start_date,
      end_date,
      status,
      created_at;
  `,

  voidOpenInvoicesForBillingPlan: `
    UPDATE invoices
    SET status = 'void'
    WHERE billing_plan_id = $1
      AND project_id = $2
      AND status IN ('draft', 'unpaid', 'overdue')
    RETURNING
      id,
      project_id,
      billing_plan_id,
      invoice_number,
      amount_cents,
      amount_paid_cents,
      balance_due_cents,
      currency,
      due_date,
      status,
      issued_at,
      paid_at,
      period_start,
      period_end,
      created_at;
  `,
};
